// userController.js
import { ObjectId } from "mongodb";
import { getCollection } from "../middlewares/putConnection.js";


/**
 * Retrieves a user document from the userCollection by its id.
 *
 * @async
 * @function
 * @param {db} db - The db connection.
 * @param {string} id - The id of the user to retrieve.
 * @returns {Promise<Object|null>} The user document if found, null otherwise.
 */
export const getUserById = async (db, id) => {
    // Queries the userCollection for a document with the given id and returns it.
    const userCollection = getCollection(db, 'users');
    return await userCollection.findOne({ _id: new ObjectId(id) });
  };
  
/**
 * Creates a new user document in the userCollection with the given data.
 *
 * @async
 * @function
 * @param {db} db - The db connection.
 * @param {Object} userData - The data for the new user.
 * @throws {Error} If a user with the same mobile number already exists, throws an error with status 409.
 * @returns {Promise<Object>} The inserted user document.
 */
export const createUser = async (db, userData) => {
  try {

    const userCollection = getCollection(db, 'users');
    const providerCollection = getCollection(db, 'providers')

    const provider = await providerCollection.findOne({_id: new ObjectId(userData.provider_id)});

    if(!provider){
      throw Object.assign(new Error('The given provider does not exist'), {
        status: 409 // Custom status code indicating conflict
      });
    }
    const existingUser = await userCollection.findOne({ mobile: userData.mobile });

    if (existingUser) {
      throw Object.assign(new Error('User with the same mobile number already exists'), {
        status: 409 // Custom status code indicating conflict
      });
    }

    return await userCollection.insertOne(userData);
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a user document in the userCollection with the given id and data.
 *
 * @async
 * @function
 * @param {db} db - The db connection.
 * @param {string} id - The id of the user to update.
 * @param {Object} providerData - The data to update the user with.
 * @throws {Error} If the user is not found, throws an error with status 404.
 * @returns {Promise<Object>} The updated user document.
 */
export const updateUser = async (db, id, providerData) => {

  // Find the user document with the given id and update it with the given data

    try{
        const userCollection = getCollection(db, 'users');

        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if(!user){
            throw Object.assign(new Error('Update failed, User not found!'), {
                status: 404
            });
        }

        return await userCollection.updateOne({_id: new ObjectId(id)}, { $set: providerData });
    }
    catch(error){
        throw error;
    }
}

/**
 * Deletes a user document from the userCollection with the given id.
 *
 * @async
 * @function
 * @param {db} db - The db connection.
 * @param {string} id - The id of the user to delete.
 * @throws {Error} If the user is not found, throws an error with status 404.
 * @returns {Promise<Object>} The result of the deleteOne operation.
 */
export const deleteUser = async (db, id) => {
    try{
        const userCollection = getCollection(db, 'users');

        const user = await userCollection.findOne({ _id: new ObjectId(id) });
        if(!user){
            throw Object.assign(new Error('Delete failed, User not found!'), {
                status: 404
            });
        }
        // Delete the user document with the given id
        return await userCollection.deleteOne({ _id: new ObjectId(id) });
    }
    catch(error){
        throw error;
    }
}