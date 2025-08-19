import Joi from "joi";

const getPropertyBySellerId = {
    params: Joi.object({
        sellerId: Joi.string().required()
    })
}

const getPropertyById = {
    params: Joi.object({
        sellerId: Joi.string().required(),
        propertyId: Joi.string().required()
    })
}


const createProperty ={
    params: Joi.object({
        sellerId: Joi.string().required()
    }),
    body: Joi.object({
        property_details: Joi.object().keys({
            property_type: Joi.string().valid("apartment", "house").required(),
            location: Joi.object().keys({
                address: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                zip_code: Joi.string().required(),
                landmarks: Joi.array().required()
            }),
            size: Joi.object().keys({
                square_footage: Joi.number().required(),
                bedrooms: Joi.number().required(),
                bathrooms: Joi.number().required()
            }),
            condition: Joi.string().required(),
            furnishing: Joi.string().required(),
            amenities: Joi.object().keys({
                in_unit: Joi.array().required(),
                building: Joi.array().required(),
                outdoor: Joi.array().required()
            }),
        }).required(),
        rental_terms: Joi.object().keys({
            rent_amount: Joi.number().required(),
            lease_duration: Joi.string().required(),
            security_deposit: Joi.number().required(),
            utilities_included: Joi.array().required(),
            utilities_tenant_responsible: Joi.array().required(),
            parking: Joi.object().keys({
                available: Joi.boolean().required(),
                cost: Joi.number().required(),
                included_in_rent: Joi.boolean().required()
            }),
        }),
        seller_information: Joi.object().keys({
            contact_name: Joi.string().required(),
            phone_number: Joi.string().required(),
            email: Joi.string().required()
        }),
        move_in_date: Joi.date().required()
    })
}

const updateProperty = {
    params: Joi.object({
        sellerId: Joi.string().required(),
        propertyId: Joi.string().required()
    }),
    body: Joi.object({
        property_details: Joi.object().keys({
            property_type: Joi.string().valid("apartment", "house").required(),
            location: Joi.object().keys({
                address: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().required(),
                zip_code: Joi.string().required(),
                landmarks: Joi.array().required()
            }),
            size: Joi.object().keys({
                square_footage: Joi.number().required(),
                bedrooms: Joi.number().required(),
                bathrooms: Joi.number().required()
            }),
            condition: Joi.string().required(),
            furnishing: Joi.string().required(),
            amenities: Joi.object().keys({
                in_unit: Joi.array().required(),
                building: Joi.array().required(),
                outdoor: Joi.array().required()
            }),
        }).required(),
        rental_terms: Joi.object().keys({
            rent_amount: Joi.number().required(),
            lease_duration: Joi.string().required(),
            security_deposit: Joi.number().required(),
            utilities_included: Joi.array().required(),
            utilities_tenant_responsible: Joi.array().required(),
            parking: Joi.object().keys({
                available: Joi.boolean().required(),
                cost: Joi.number().required(),
                included_in_rent: Joi.boolean().required()
            }),
        }),
        seller_information: Joi.object().keys({
            contact_name: Joi.string().required(),
            phone_number: Joi.string().required(),
            email: Joi.string().required()
        }),
        move_in_date: Joi.date().required()
    })
}

const deleteProperty = {
    params: Joi.object({
        propertyId: Joi.string().required(),
        sellerId: Joi.string().required()
    }),
}

const propertyValidations = {
    getPropertyBySellerId,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty
};

export default propertyValidations;