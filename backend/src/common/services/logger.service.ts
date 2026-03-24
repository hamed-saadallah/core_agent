import { Injectable, Logger } from '@nestjs/common';

export enum LogLevelEnum {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

@Injectable()
export class LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('APP');
  }

  debug(message: string, context?: string, data?: any) {
    this.logger.debug(`${message}${data ? ` - ${JSON.stringify(data)}` : ''}`, context);
  }

  log(message: string, context?: string, data?: any) {
    this.logger.log(`${message}${data ? ` - ${JSON.stringify(data)}` : ''}`, context);
  }

  warn(message: string, context?: string, data?: any) {
    this.logger.warn(`${message}${data ? ` - ${JSON.stringify(data)}` : ''}`, context);
  }

  error(message: string, context?: string, error?: any) {
    this.logger.error(`${message}${error ? ` - ${error.message || JSON.stringify(error)}` : ''}`, error?.stack, context);
  }
}
