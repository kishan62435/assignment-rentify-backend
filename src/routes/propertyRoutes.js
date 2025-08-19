import { Router } from "express";
import propertyValidations from "../app/validations/propertyValidations.js";
import propertyContoller from "../app/controllers/propertyController.js";
import { userAuth } from "../app/middlewares/authentication.js";
import validate from "../app/middlewares/validate.js";

const router = Router();

router.get('/', propertyContoller.getAllProperties);

router.
    route('/:sellerId')
        .get(validate(propertyValidations.getPropertyBySellerId), propertyContoller.getPropertyBySellerId)
        .post(userAuth('seller'), validate(propertyValidations.createProperty), propertyContoller.createProperty);

router.
    route('/:sellerId/:propertyId')
        .get(validate(propertyValidations.getPropertyById), propertyContoller.getPropertyById)
        .delete(userAuth('seller'), validate(propertyValidations.deleteProperty), propertyContoller.deleteProperty)
        .put(userAuth('seller'), validate(propertyValidations.updateProperty), propertyContoller.updateProperty);





// router.put('/:providerId', sellerValidations.update, sellerController);

export default router;