import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/apiError.js";
import { getCollection } from "../middlewares/putConnection.js";

const register = catchAsync(async (req, res) => {
  const userData = req.body;
  const trimmedEmail = userData.email.toLowerCase().trim();

  const userCollection = getCollection(req.db, "users");

  const existingUser = await userCollection.findOne({
    email: userData.email,
    userType: userData.userType,
  });

  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${email} is already registered! Please Login`);
  }

  const user = userCollection.insertOne(userData);
  res.send({ success: "User registered successfully" });
});

export default register;
