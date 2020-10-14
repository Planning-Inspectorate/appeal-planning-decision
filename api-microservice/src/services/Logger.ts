import * as winston from 'winston';

export default class LoggerService {
  private logger: winston.Logger;

  public constructor() {
    const loggerSettings = {
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      level: 'info',
      transports: [new winston.transports.Console()],
    };

    this.logger = winston.createLogger(loggerSettings);
  }

  public info(message: string): void {
    this.logger.info(message);
  }
}
