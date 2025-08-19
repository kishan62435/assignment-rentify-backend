// Load environment variables from .env file
import dotenv from 'dotenv';
import express from 'express';
import cors from'cors';
import connectToDatabase from './../database/connection.js';
import { putConnection } from './middlewares/putConnection.js';
import routes from './../routes/router.js';
import authRoutes from './../routes/authRoutes.js';
import { errorConverter, errorHandler } from './middlewares/errorHandler.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(putConnection);

app.use('/api/auth', authRoutes);
app.use('/api', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB2:', error);
    process.exit(1);
  });