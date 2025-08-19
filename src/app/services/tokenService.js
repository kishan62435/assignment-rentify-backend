import { getCollection } from "../middlewares/putConnection.js";
import { ObjectId } from "mongodb";
export const getLatestTokenIdByUserId = async (db, userId) => {
    try {
        const tokensCollection = getCollection(db, 'tokenMetaData');
        
        const tokens = await tokensCollection.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).limit(1).toArray();
        return tokens[0]?.tokenId;
    } catch (error) {
        console.log(error, 'error from service');
    }
}