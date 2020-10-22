import winston from 'winston';

const loggerSettings = {
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `[${info.level}]: ${info.message}`),
  ),
  level: 'info',
  transports: [new winston.transports.Console()],
};

const logger = winston.createLogger(loggerSettings);

export default logger;
