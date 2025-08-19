import { MongoClient, ServerApiVersion } from 'mongodb';
import config from '../config/config.js';
import { getEnvironment } from '../config/environment.js';

let client;


/**
 * Connects to the MongoDB database.
 *
 * @returns {Promise<void>} A promise that resolves when the connection is established, or rejects with an error if it fails.
 * @throws {Error} If there is an error connecting to the database.
 */
const connectToDatabase = async () => {
  try {
    // Get the environment and the corresponding MongoDB URI from the config
    const environment = getEnvironment();
    const uri = config[environment].mongoURI;

    // Create a new MongoClient instance with the URI and server API options
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    // Connect to the MongoDB server
    await client.connect();

    // Ping the MongoDB server to check the connection
    await client.db('admin').command({ ping: 1 });

    // Log a success message
    console.log('Connected to MongoDB');
  } catch (error) {
    // Log and rethrow any errors that occur
    console.error('Error connecting to MongoDB1:', error);
    throw error;
  }
};

export const getClient = () => client;
export default connectToDatabase;