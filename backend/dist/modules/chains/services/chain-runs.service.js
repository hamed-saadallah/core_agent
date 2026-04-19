"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ChainRunsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainRunsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const chain_run_entity_1 = require("../../../infrastructure/database/entities/chain-run.entity");
const chain_entity_1 = require("../../../infrastructure/database/entities/chain.entity");
const agent_runs_service_1 = require("../../agent-runs/services/agent-runs.service");
const chains_service_1 = require("./chains.service");
const chain_nodes_service_1 = require("./chain-nodes.service");
let ChainRunsService = ChainRunsService_1 = class ChainRunsService {
    constructor(chainRunRepository, chainRepository, chainsService, chainNodesService, agentRunsService) {
        this.chainRunRepository = chainRunRepository;
        this.chainRepository = chainRepository;
        this.chainsService = chainsService;
        this.chainNodesService = chainNodesService;
        this.agentRunsService = agentRunsService;
        this.logger = new common_1.Logger(ChainRunsService_1.name);
    }
    async findAll(query) {
        const qb = this.chainRunRepository.createQueryBuilder('run');
        if (query.userId) {
            qb.where('run.userId = :userId', { userId: query.userId });
        }
        if (query.chainId) {
            qb.andWhere('run.chainId = :chainId', { chainId: query.chainId });
        }
        if (query.status) {
            qb.andWhere('run.status = :status', { status: query.status });
        }
        const skip = query.skip || 0;
        const limit = query.limit || 10;
        const [runs, total] = await qb.skip(skip).take(limit).orderBy('run.createdAt', 'DESC').getManyAndCount();
        return { runs, total };
    }
    async findOne(id, userId) {
        const run = await this.chainRunRepository.findOne({ where: { id } });
        if (!run) {
            throw new common_1.NotFoundException(`Chain run with ID ${id} not found`);
        }
        if (userId && run.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to access this chain run');
        }
        return run;
    }
    async getRunsByChain(chainId, skip = 0, limit = 10, userId, status) {
        const where = { chainId };
        if (userId) {
            where.userId = userId;
        }
        if (status) {
            where.status = status;
        }
        const [runs, total] = await this.chainRunRepository.findAndCount({
            where,
            skip,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { runs, total };
    }
    async executeChainRun(chainId, userId, parameters, metadata) {
        this.logger.log(`Executing chain run for chain: ${chainId}`);
        const startTime = Date.now();
        // Validate chain exists and user owns it
        const chain = await this.chainsService.findOne(chainId, userId);
        if (!chain.startingPrompt) {
            throw new common_1.BadRequestException(`Chain ${chainId} does not have a starting prompt`);
        }
        // Get nodes
        const nodes = await this.chainNodesService.getNodesByChain(chainId);
        if (nodes.length === 0) {
            throw new common_1.BadRequestException(`Chain ${chainId} has no nodes`);
        }
        // Create chain run record
        const chainRun = this.chainRunRepository.create({
            chainId,
            userId,
            input: { parameters, startingPrompt: chain.startingPrompt },
            status: 'running',
            intermediateResults: [],
            metadata,
        });
        const savedRun = await this.chainRunRepository.save(chainRun);
        try {
            let context = {
                startingPrompt: this.fillPromptTemplate(chain.startingPrompt, parameters),
            };
            const intermediateResults = [];
            // Execute each node in sequence
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                this.logger.log(`Executing node ${i + 1}/${nodes.length} (agent: ${node.agentId})`);
                try {
                    // Prepare input for agent: combine previous output with context
                    let nodeInput;
                    if (i === 0) {
                        // First node: use starting prompt + parameters
                        nodeInput = { ...parameters };
                    }
                    else {
                        // Subsequent nodes: pass previous result as context
                        const previousOutput = intermediateResults[i - 1];
                        nodeInput = {
                            ...parameters,
                            previousOutput: previousOutput?.output?.output || previousOutput?.output || '',
                            context: context,
                        };
                    }
                    // Get agent and execute
                    const agent = node.agent;
                    if (!agent.promptTemplate) {
                        throw new common_1.BadRequestException(`Agent ${node.agentId} does not have a prompt template`);
                    }
                    if (!agent.modelId) {
                        throw new common_1.BadRequestException(`Agent ${node.agentId} does not have a model assigned`);
                    }
                    const agentTemperature = node.nodeConfig?.temperature || agent.temperature;
                    // Execute agent
                    const agentResult = await this.agentRunsService.executeAgentRun(node.agentId, userId, nodeInput, agent.promptTemplate, agent.modelId, agentTemperature, { chainRunId: savedRun.id, nodeOrder: i, chainId });
                    intermediateResults.push({
                        nodeId: node.id,
                        nodeOrder: i,
                        agentId: node.agentId,
                        agentRunId: agentResult.runId,
                        output: agentResult.output,
                        executionTime: agentResult.executionTime,
                        status: 'completed',
                    });
                    // Update context for next node
                    context.previousNodeOutput = agentResult.output;
                    this.logger.log(`Node ${i + 1} completed successfully`);
                }
                catch (nodeError) {
                    const executionTime = Date.now() - startTime;
                    intermediateResults.push({
                        nodeId: node.id,
                        nodeOrder: i,
                        agentId: node.agentId,
                        output: null,
                        error: nodeError instanceof Error ? nodeError.message : String(nodeError),
                        executionTime: Date.now() - startTime,
                        status: 'failed',
                    });
                    savedRun.status = 'failed';
                    savedRun.error = `Node ${i} execution failed: ${nodeError instanceof Error ? nodeError.message : String(nodeError)}`;
                    savedRun.intermediateResults = intermediateResults;
                    savedRun.executionTime = executionTime;
                    await this.chainRunRepository.save(savedRun);
                    this.logger.error(`Node ${i + 1} execution failed: ${nodeError}`);
                    throw new common_1.BadRequestException(`Chain execution failed at node ${i + 1}: ${nodeError instanceof Error ? nodeError.message : String(nodeError)}`);
                }
            }
            const executionTime = Date.now() - startTime;
            // Set final output from last node
            const finalOutput = intermediateResults[intermediateResults.length - 1]?.output;
            savedRun.output = finalOutput;
            savedRun.status = 'completed';
            savedRun.intermediateResults = intermediateResults;
            savedRun.executionTime = executionTime;
            await this.chainRunRepository.save(savedRun);
            return {
                success: true,
                output: finalOutput,
                executionTime,
                runId: savedRun.id,
                intermediateResults,
            };
        }
        catch (error) {
            const executionTime = Date.now() - startTime;
            savedRun.status = 'failed';
            savedRun.error = error instanceof Error ? error.message : String(error);
            savedRun.executionTime = executionTime;
            await this.chainRunRepository.save(savedRun);
            this.logger.error(`Chain execution failed: ${error}`);
            throw new common_1.BadRequestException(`Chain execution failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    fillPromptTemplate(template, parameters) {
        let filledPrompt = template;
        const parameterRegex = /{(\w+)}/g;
        const matches = filledPrompt.match(parameterRegex);
        if (matches) {
            matches.forEach((match) => {
                const paramName = match.slice(1, -1);
                const paramValue = parameters[paramName];
                if (paramValue !== undefined) {
                    filledPrompt = filledPrompt.replace(new RegExp(match, 'g'), paramValue);
                }
            });
        }
        return filledPrompt;
    }
};
exports.ChainRunsService = ChainRunsService;
exports.ChainRunsService = ChainRunsService = ChainRunsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chain_run_entity_1.ChainRunEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(chain_entity_1.ChainEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        chains_service_1.ChainsService,
        chain_nodes_service_1.ChainNodesService,
        agent_runs_service_1.AgentRunsService])
], ChainRunsService);
