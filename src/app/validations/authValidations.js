import Joi from 'joi';

const login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        ).required(),
      }),
};



const authValidations = {
    login
};

export default authValidations;
