import { Router } from 'express';
import { validationResult } from 'express-validator';
import { getUserById, createUser } from '../app/controllers/userController.js';
import validations from '../app/helpers/validations.js';

const router = Router();


router.get('/:userId',
    [
        ...validations.stringValidation('userId', 'User Id', {minLength:24, maxLength:24})
    ],
    async(req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({errors:'Invalid Id!'});
        }

        try {
            const user = await getUserById(req.db, req.params.userId)
            if(!user){
                throw Object.assign(new Error('User not found'), {
                    status: 404 // Custom status code indicating conflict
                }); 
            }
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
);


/**
 * Create a new user
 * 
 * @route POST /users
 * @body {string} provider_id.required - The id of the provider
 * @body {string} first_name.required - The first name of the user
 * @body {string} last_name.required - The last name of the user
 * @body {array} addresses.required - The address of the user
 * @body {string} addresses.*.required - The individual address of the user
 * @body {string} mobile.required - The mobile number of the user
 * @body {string} email.required - The email id of the user
 * @body {string} user_name.required - The username of the user
 * @body {string} password.required - The password of the user
 * @body {string} user_type.required - The type of the user
 * @body {number} status.required - The status of the user
 * @response {object} 201 - The newly created user
 * @response {object} 400 - Error response if the request is invalid
 */
router.post('/', 
    [
        ...validations.stringValidation('provider_id', 'Provider Id', {minLength: 24, maxLength: 24}),
        ...validations.stringValidation('first_name', 'First Name', {minLength: 2}),
        ...validations.stringValidation('last_name', 'Last Name', {minLength: 2}),
        ...validations.arrayValidation('addresses', 'Address', {minLength: 1}),
        ...validations.stringValidation('addresses.*', 'Address', {minLength: 5}),
        ...validations.mobileNumberValidation('mobile', 'Mobile no.'),
        ...validations.emailValidation('email', 'Email'),
        ...validations.stringValidation('user_name', 'User Name', {minLength: 3}),
        ...validations.alphanumericStringValidation('password', 'Password', {isPassword: true}),
        ...validations.stringValidation('user_type', 'User Type', {minLength: 3}),
        ...validations.numericValidation('status', 'Status', {maxValue:1}),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        if(req.body.user_type !== 'admin' && req.body.user_type !== 'delivery_man'){
            return res.status(400).json({ errors: 'Invalid user type' });
        }

        try {
            const newUser = await createUser(req.db, req.body);
            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * Route to update a user by its userId.
 * Only valid fields are updated and other fields are ignored.
 * Valid fields are first_name, last_name, addresses, user_type, status.
 * 
 * @route PUT /api/users/:userId
 * @body {string} userId.required - The id of the user to be updated
 * @body {string} first_name - The first name of the user
 * @body {string} last_name - The last name of the user
 * @body {array} addresses - The array of addresses of the user
 * @body {string} addresses.* - The individual address of the user
 * @body {string} user_type - The type of the user
 * @body {number} status - The status of the user
 * @response {object} 201 - The updated user
 * @response {object} 400 - Error response if the request is invalid
 */
router.put('/:userId',
    [
        ...validations.stringValidation('userId', 'User Id', {minLength:24, maxLength:24}),
        ...validations.stringValidation('first_name', 'First Name', {minLength: 2}),
        ...validations.stringValidation('last_name', 'Last Name', {minLength: 2}),
        ...validations.arrayValidation('addresses', 'Address', {minLength: 1}),
        ...validations.stringValidation('addresses.*', 'Address', {minLength: 5}),
        ...validations.stringValidation('user_type', 'User Type', {minLength: 3}),
        ...validations.numericValidation('status', 'Status', {maxValue:1}),
    ],
    async(req, res, next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const validFields = ['first_name', 'last_name', 'addresses', 'user_type', 'status'];

        deleteKeysExcept(req.body, validFields);
        try {

            const updatedUser = await updateUser(req.db, req.params.userId, req.body);
            res.status(201).json(updatedUser);
        } catch (error) {
            next(error);
        }
    }
);


/**
 * Route to delete a user by its userId.
 * 
 * @route POST /api/users/:userId
 * @body {string} userId.required - The id of the user to be deleted
 * @response {object} 200 - The deleted user
 * @response {object} 400 - Error response if the request is invalid
 * @response {object} 404 - Error response if the user is not found
 */
router.post('/:userId',
    [
        ...validations.stringValidation('userId', 'User Id', {minLength:24, maxLength:24}),
    ],
    async(req, res, next) => {
        const errors = validationResult(req);
        
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const deleteUser = await deleteUserById(req.db, req.params.userId);
            if(!deleteUser){
                return res.status(404).json({
                    status: 404 // Custom status code indicating user not found
                }); 
            }
            res.status(200).json(deleteUser);
        } catch (error) {
            next(error);
        }
    }
);

// Other routes...

export default router;