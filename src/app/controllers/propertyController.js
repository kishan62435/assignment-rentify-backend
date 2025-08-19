import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/apiError.js";
import { getCollection } from "../middlewares/putConnection.js";
import { ObjectId } from "bson";

const getAllProperties = catchAsync(async (req, res) => {
    const propertyCollection = getCollection(req.db, "properties");
    const properties = await propertyCollection.find({}).toArray();
    res.send({success: true, items: properties});
});

const getPropertyBySellerId = catchAsync(async (req, res) => {
    const propertyCollection = getCollection(req.db, "properties");
    const properties = await propertyCollection
        .find({ sellerId: req.params.sellerId })
        .toArray();
    res.send(properties);
});

const getPropertyById = catchAsync(async (req, res) => {
    const propertyCollection = getCollection(req.db, "properties");
    const property = await propertyCollection.findOne({
        _id: new ObjectId(req.params.propertyId),
    });
    res.send(property);
});

const createProperty = catchAsync(async (req, res) => {
    const propertyCollection = getCollection(req.db, "properties");
    const propertyData = req.body;
    propertyData.sellerId = req.params.sellerId;
    const property = await propertyCollection.insertOne(propertyData);
    res.send(property);
});

const updateProperty = catchAsync(async (req, res) => {
    const propertyCollection = getCollection(req.db, "properties");
    const property = await propertyCollection.findOne({_id: new ObjectId(req.params.propertyId)});

    if (!property) {
        throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
    }

    if(property.sellerId !== req.params.sellerId){
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const updateProperty = await propertyCollection.updateOne(
        { _id: new ObjectId(req.params.propertyId) },
        { $set: req.body }
    );
    res.send(updateProperty);
});

const deleteProperty = catchAsync(async (req, res) => {
    const propertyCollection = getCollection(req.db, "properties");

    const property = await propertyCollection.findOne({_id: new ObjectId(req.params.propertyId)});

    if (!property) {
        throw new ApiError(httpStatus.NOT_FOUND, "Property not found");
    }

    if(property.sellerId !== req.params.sellerId){
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const deleteProperty = await propertyCollection.deleteOne({
        _id: new ObjectId(req.params.propertyId),
    });
    res.send(deleteProperty);
});

const propertyContoller = {
    getAllProperties,
    getPropertyBySellerId,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
};

export default propertyContoller;