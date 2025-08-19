import responses from "../helpers/responses.js";
import { ObjectId } from "mongodb";
import { getCollection } from "../middlewares/putConnection.js";

// providerController.js


/**
 * Retrieves a provider document from the providerCollection by its id.
 *
 * @async
 * @function
 * @param {db} db - The db connection.
 * @param {string} id - The id of the provider to retrieve.
 * @returns {Promise<Object|null>} The provider document if found, null otherwise.
 */
export const getProviderById = async (db, id) => {
    // Queries the providerCollection for a document with the given id and returns it.
    
    const providerCollection = getCollection(db, 'providers')
    // Find the provider document with the given id
    return await providerCollection.findOne({ _id: new ObjectId(id) });
};
  
/**
 * Creates a new provider in the providerCollection.
 *
 * @async
 * @function
 * @param {db} db - The db connection.
 * @param {Object} providerData - The data for the new provider.
 * @throws {Error} If a provider with the same mobile number already exists, throws an error with status 409.
 * @returns {Promise<Object>} The inserted provider document.
 */
export const createProvider = async (db, providerData) => {
    // Check if a provider with the same mobile number already exists
    try {
        const providerCollection = getCollection(db, 'providers')

        const existingProvider = await providerCollection.findOne({ mobile: providerData.mobile });

        // If a provider with the same mobile number exists, throw an error
        if (existingProvider) {
            throw Object.assign(new Error('Provider with the same mobile number already exists'), {
                status: 409 // Custom status code indicating conflict
            });
        }

        // Insert the new provider into the collection
        return await providerCollection.insertOne(providerData);
    }
    catch (error) {
        throw error;
    }
};

/**
 * Updates a provider document in the providerCollection with the given id and data.
 *
 * @async
 * @function
 * @param {db} db - The db connection.
 * @param {string} id - The id of the provider to update.
 * @param {Object} providerData - The data to update the provider with.
 * @throws {Error} If the provider is not found, throws an error with status 404.
 * @returns {Promise<Object>} The updated provider document.
 */
export const updateProvider = async (db, id, providerData) => {
    try {
        const providerCollection = getCollection(db, 'providers')
        // Find the provider document with the given id
        const provider = await providerCollection.findOne({ _id: new ObjectId(id) })

        // If the provider is not found, throw an error
        if(!provider){
            throw Object.assign(new Error('Update failed, Provider not found!'), {
                status: 404 // Custom status code indicating conflict
            });
        }

        // Update the provider document with the given data
        return await providerCollection.updateOne({_id: new ObjectId(id)}, { $set: providerData })
    } catch (error) {
        // Log and rethrow any errors that occur
        console.log(error);
        throw error;
    }
};