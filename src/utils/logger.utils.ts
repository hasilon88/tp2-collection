import winston from 'winston';
import { config } from '../config/config';

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),            
    winston.format.json(),                  
    winston.format.prettyPrint(),           
    logFormat                               
  ),
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production'
        ? winston.format.json()             
        : winston.format.simple()           
    }),
    new winston.transports.File({ filename: config.TEST_LOGS_PATH })  
  ],
});
