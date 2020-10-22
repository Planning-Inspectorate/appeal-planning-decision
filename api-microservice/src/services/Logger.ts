import * as winston from 'winston';

export default class LoggerService {
  private logger: winston.Logger;

  public constructor() {
    const loggerSettings = {
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf((info) => `[${info.level}]: ${info.message}`),
      ),
      level: 'info',
      transports: [new winston.transports.Console()],
    };

    this.logger = winston.createLogger(loggerSettings);
  }

  public info(message: string): void {
    this.logger.info(message);
  }
}
