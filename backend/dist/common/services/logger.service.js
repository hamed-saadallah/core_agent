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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = exports.LogLevelEnum = void 0;
const common_1 = require("@nestjs/common");
var LogLevelEnum;
(function (LogLevelEnum) {
    LogLevelEnum["DEBUG"] = "debug";
    LogLevelEnum["INFO"] = "info";
    LogLevelEnum["WARN"] = "warn";
    LogLevelEnum["ERROR"] = "error";
})(LogLevelEnum || (exports.LogLevelEnum = LogLevelEnum = {}));
let LoggerService = class LoggerService {
    constructor() {
        this.logger = new common_1.Logger('APP');
    }
    debug(message, context, data) {
        this.logger.debug(`${message}${data ? ` - ${JSON.stringify(data)}` : ''}`, context);
    }
    log(message, context, data) {
        this.logger.log(`${message}${data ? ` - ${JSON.stringify(data)}` : ''}`, context);
    }
    warn(message, context, data) {
        this.logger.warn(`${message}${data ? ` - ${JSON.stringify(data)}` : ''}`, context);
    }
    error(message, context, error) {
        this.logger.error(`${message}${error ? ` - ${error.message || JSON.stringify(error)}` : ''}`, error?.stack, context);
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LoggerService);
