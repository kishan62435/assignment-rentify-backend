import { getClient } from '../../database/connection.js';


export const putConnection = (req, res, next) => {
  // Fetch the database connection from the database connection module
  const db = getClient().db('rentify');

  // Attach the database connection to the request object
  req.db = db;

  // Call the next middleware function
  next();
};


export const getCollection = (db, collection) => {
    // Fetch the collection from the database connection using the provided collection name
    return db.collection(collection);
};
