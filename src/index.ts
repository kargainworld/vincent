import express from 'express';
import cors from 'cors';
import logger from './loaders/logger';
import mongoDb from './loaders/mongoDb';
import msSqlDb from './loaders/msSqlDb';
import VinDecoder from './services/VinDecoder';
import validateVinRequest from './middlewares/validateVinRequest';

const app = express();
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINAL,
  optionsSuccessStatus: 200,
};
const decoder = new VinDecoder({
  useDatabase: true,
  useCache: false,
  useApi: false,
  useDecoder: true,
});

app.use(express.json());

app.get('/vin/:vin', cors(corsOptions), validateVinRequest, async (req, res) => {
  try {
    const vinData = await decoder.getVinData(req.params.vin);

    if (vinData) {
      return res.json({ success: true, vinData });
    }

    return res.json({ success: false, error: 105 });
  } catch (error) {
    logger.error('Internal error', error);
    return res.status(500).json({ success: false, error: 500 });
  }
});

app.get('/health-check', (req, res) => res.json({ success: true }));

const server = app.listen(process.env.PORT);

process.on('SIGTERM', async () => {
  await Promise.all([
    new Promise((resolve) => {
      server.close(resolve);
    }),
    new Promise((resolve) => {
      mongoDb.connection.close(false, resolve);
    }),
    msSqlDb.close(),
  ]);

  process.exit(0);
});
