import express from 'express';
import authController from '../app/controllers/authController.js';
import authValidations from '../app/validations/authValidations.js';
import validate from '../app/middlewares/validate.js';
import { userAuth } from '../app/middlewares/authentication.js';

const router = express.Router();

router.post('/login', validate(authValidations.login), authController.login);
router.get('/logout', userAuth(), authController.logout);

export default router;