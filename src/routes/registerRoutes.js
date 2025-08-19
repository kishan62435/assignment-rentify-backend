import { Router } from 'express';
import registerController from '../app/controllers/registerController.js';
import validate from '../app/middlewares/validate.js';
import registerValidation from '../app/validations/registerValidations.js';

const router = Router();

router.post('/',validate(registerValidation), registerController);



export default router;
