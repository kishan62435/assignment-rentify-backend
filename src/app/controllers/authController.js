import jwt from 'jsonwebtoken';
// import config from '../config/config.js';
import { getCollection } from '../middlewares/putConnection.js';
import { generateToken } from '../helpers/jwtHelper.js';
import catchAsync from '../utils/catchAsync.js';
import { ObjectId } from 'bson';

const checkAndInvalidateTokens = async(userId, tokensCollection) => {
    const activeSessions = await tokensCollection.find({ userId: new ObjectId(userId) }).toArray();
    activeSessions.forEach(async session => {
        await tokensCollection.deleteOne({ _id: session._id });
    });
}


const storeTokenMetadata = async(userId, tokenId, expiresAt, tokensCollection) => {
    const tokenData = {
        userId,
        tokenId,
        createdAt: new Date(),
        expiresAt: new Date(expiresAt)
    };
    await tokensCollection.insertOne(tokenData);
}

const login = catchAsync(
    async (req, res) => {
        const { password } = req.body;
        const email = req.body.email.toLowerCase().trim();

        const userCollection = getCollection(req.db, 'users');

        const tokensCollection = getCollection(req.db, 'tokenMetaData');
        // Find the user in the database
        const user = await userCollection.findOne({ email: email});

        // If the user is not found, throw an error
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not registered');
        }

        // If the provided password does not match the stored password, throw an error
        if (user.password !== password) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Login Credentials');
        }

        // Generate a JSON Web Token with the user data
        const { token, jwtId, exp } = generateToken({ userId: user._id, userType: user.userType });

        await checkAndInvalidateTokens(user._id, tokensCollection);

        await storeTokenMetadata(user._id, jwtId, exp, tokensCollection);

        delete user.password;
        return res.status(200).json({ success: true, data: {token, user} });
    },
);

const logout = catchAsync(
    async (req, res) => {
        const { userId } = req.userId;
        console.log(req.userId, 'here is the userId');
        const tokensCollection = getCollection(req.db, 'tokenMetaData');

        // await checkAndInvalidateTokens(userId, tokensCollection);

        const sessions = await tokensCollection.find({ tokenId: req.tokenId }).toArray();
        console.log(sessions);
        sessions.forEach(async session => {
            await tokensCollection.deleteOne({ _id: new ObjectId(session._id) });
        });
        return res.status(200).json({ message: 'Logout successful' });
    },
)

export default {login, logout};
