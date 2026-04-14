import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChainNodeEntity } from '@/infrastructure/database/entities/chain-node.entity';
import { AgentEntity } from '@/infrastructure/database/entities/agent.entity';
import { AddChainNodeDto, UpdateChainNodeDto } from '../dtos/chain.dto';
import { ChainsService } from './chains.service';

@Injectable()
export class ChainNodesService {
  private readonly logger = new Logger(ChainNodesService.name);

  constructor(
    @InjectRepository(ChainNodeEntity) private nodeRepository: Repository<ChainNodeEntity>,
    @InjectRepository(AgentEntity) private agentRepository: Repository<AgentEntity>,
    private chainsService: ChainsService,
  ) {}

  async addNode(chainId: string, addNodeDto: AddChainNodeDto, userId: string): Promise<ChainNodeEntity> {
    this.logger.log(`Adding node to chain: ${chainId}`);

    // Verify chain exists and user owns it
    await this.chainsService.findOne(chainId, userId);

    // Verify agent exists
    const agent = await this.agentRepository.findOne({
      where: { id: addNodeDto.agentId },
    });

    if (!agent) {
      throw new BadRequestException(`Agent with ID ${addNodeDto.agentId} not found`);
    }

    // Reorder nodes if necessary
    const existingNodes = await this.nodeRepository.find({
      where: { chainId },
      order: { order: 'ASC' },
    });

    if (addNodeDto.order > existingNodes.length) {
      throw new BadRequestException(`Order ${addNodeDto.order} is out of bounds. Valid range: 0-${existingNodes.length}`);
    }

    if (addNodeDto.order < existingNodes.length) {
      await this.nodeRepository
        .createQueryBuilder()
        .update(ChainNodeEntity)
        .set({ order: () => 'order + 1' })
        .where('chainId = :chainId AND order >= :order', { chainId, order: addNodeDto.order })
        .execute();
    }

    const node = this.nodeRepository.create({
      chainId,
      agentId: addNodeDto.agentId,
      order: addNodeDto.order,
      nodeConfig: addNodeDto.nodeConfig || {},
    });

    return await this.nodeRepository.save(node);
  }

  async updateNode(chainId: string, nodeId: string, updateNodeDto: UpdateChainNodeDto, userId: string): Promise<ChainNodeEntity> {
    this.logger.log(`Updating node: ${nodeId} in chain: ${chainId}`);

    // Verify chain exists and user owns it
    await this.chainsService.findOne(chainId, userId);

    const node = await this.nodeRepository.findOne({
      where: { id: nodeId, chainId },
    });

    if (!node) {
      throw new NotFoundException(`Node with ID ${nodeId} not found in chain ${chainId}`);
    }

    if (updateNodeDto.order !== undefined && updateNodeDto.order !== node.order) {
      // Handle reordering
      const allNodes = await this.nodeRepository.find({
        where: { chainId },
        order: { order: 'ASC' },
      });

      if (updateNodeDto.order > allNodes.length - 1) {
        throw new BadRequestException(`Order ${updateNodeDto.order} is out of bounds`);
      }

      const currentOrder = node.order;
      const newOrder = updateNodeDto.order;

      if (newOrder > currentOrder) {
        // Moving down
        await this.nodeRepository
          .createQueryBuilder()
          .update(ChainNodeEntity)
          .set({ order: () => 'order - 1' })
          .where('chainId = :chainId AND order > :currentOrder AND order <= :newOrder', { chainId, currentOrder, newOrder })
          .execute();
      } else {
        // Moving up
        await this.nodeRepository
          .createQueryBuilder()
          .update(ChainNodeEntity)
          .set({ order: () => 'order + 1' })
          .where('chainId = :chainId AND order >= :newOrder AND order < :currentOrder', { chainId, newOrder, currentOrder })
          .execute();
      }

      node.order = newOrder;
    }

    if (updateNodeDto.nodeConfig !== undefined) {
      node.nodeConfig = updateNodeDto.nodeConfig;
    }

    return await this.nodeRepository.save(node);
  }

  async removeNode(chainId: string, nodeId: string, userId: string): Promise<void> {
    this.logger.log(`Removing node: ${nodeId} from chain: ${chainId}`);

    // Verify chain exists and user owns it
    await this.chainsService.findOne(chainId, userId);

    const node = await this.nodeRepository.findOne({
      where: { id: nodeId, chainId },
    });

    if (!node) {
      throw new NotFoundException(`Node with ID ${nodeId} not found in chain ${chainId}`);
    }

    const nodeOrder = node.order;

    // Remove the node
    await this.nodeRepository.remove(node);

    // Reorder remaining nodes
    await this.nodeRepository
      .createQueryBuilder()
      .update(ChainNodeEntity)
      .set({ order: () => 'order - 1' })
      .where('chainId = :chainId AND order > :nodeOrder', { chainId, nodeOrder })
      .execute();
  }

  async getNodesByChain(chainId: string): Promise<ChainNodeEntity[]> {
    return await this.nodeRepository.find({
      where: { chainId },
      relations: ['agent'],
      order: { order: 'ASC' },
    });
  }
}
