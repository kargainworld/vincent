import mongoose from 'mongoose';
import logger from './logger';

const MONGODB_URL: string = (process.env.MONGODB_URL as string);

if (MONGODB_URL) {
  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }).then();

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', err);
    process.exit(1);
  });
}

export default mongoose;
