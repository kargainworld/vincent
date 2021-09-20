import winston from 'winston';

const { createLogger, format, transports } = winston;
const {
  combine, timestamp, json, splat,
} = format;

const logger = createLogger({
  format: combine(
    json(),
    splat(),
    timestamp({ format: 'DD-MM-YY HH:mm:ss' }),
  ),
  transports: process.env.NODE_ENV === 'production'
    ? [new transports.File({ filename: 'logs.log', level: 'error' })]
    : [new transports.Console({ level: 'debug' })],
});

export default logger;
