"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AllExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const custom_exceptions_1 = require("../exceptions/custom.exceptions");
let AllExceptionsFilter = AllExceptionsFilter_1 = class AllExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(AllExceptionsFilter_1.name);
    }
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'INTERNAL_ERROR';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? res : res.message || exception.message;
            code = res.code || 'HTTP_ERROR';
        }
        else if (exception instanceof custom_exceptions_1.AgentException) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof custom_exceptions_1.ToolException) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof custom_exceptions_1.ValidationException) {
            status = common_1.HttpStatus.BAD_REQUEST;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof custom_exceptions_1.NotFoundException) {
            status = common_1.HttpStatus.NOT_FOUND;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof custom_exceptions_1.UnauthorizedException) {
            status = common_1.HttpStatus.UNAUTHORIZED;
            message = exception.message;
            code = exception.code;
        }
        else if (exception instanceof Error) {
            this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
        }
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            code,
        };
        response.status(status).json(errorResponse);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = AllExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)()
], AllExceptionsFilter);
