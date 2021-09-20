import msSql from 'mssql';
import logger from './logger';

const msSqlPool = new msSql.ConnectionPool({
  server: process.env.SQL_SERVER as string,
  database: process.env.SQL_DATABASE as string,
  port: Number(String(process.env.SQL_PORT)) as number,
  user: process.env.SQL_USER as string,
  password: process.env.SQL_PASSWORD as string,
  options: {
    trustServerCertificate: true,
  },
});

msSqlPool
  .connect()
  .then((pool) => {
    logger.info('Connected to MS SQL');
    return pool;
  })
  .catch((error) => {
    logger.error('MS SQL connection error', error);
  });

export default msSqlPool;
