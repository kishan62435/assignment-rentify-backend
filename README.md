# Rentify Backend

Backend for a simple property rental marketplace built with Node.js, Express, and MongoDB. It provides registration, authentication with JWT, and CRUD endpoints for properties scoped to seller accounts.

## Features

- Authentication with JWT (single active session per user via token metadata)
- Registration for users with role: BUYER or SELLER
- Property CRUD:
  - Public: list all properties, get by seller, get by id
  - Seller-authenticated: create, update, delete own properties
- Request validation with Joi
- Centralized error handling with consistent error responses
- MongoDB native driver with connection middleware

## Tech Stack

- Node.js, Express
- MongoDB (native driver)
- JWT (`jsonwebtoken`), `uuid`
- Validation: `joi`
- Misc: `cors`, `dotenv`, `http-status`, `ms`

## Project Structure

```
src/
  app/
    app.js
    controllers/
      authController.js
      propertyController.js
      registerController.js
    helpers/
      jwtHelper.js
      helperMethods.js
      responses.js
    middlewares/
      authentication.js
      errorHandler.js
      putConnection.js
      validate.js
    services/
      tokenService.js
    utils/
      ApiError.js
      catchAsync.js
      pick.js
    validations/
      authValidations.js
      propertyValidations.js
      registerValidations.js
  config/
    config.js
    environment.js
  database/
    connection.js
  routes/
    authRoutes.js
    propertyRoutes.js
    registerRoutes.js
    router.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB instance (Atlas or local)

### Install

```
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
# Server
PORT=3000
NODE_ENV=development

# Mongo
MONGO_URI_DEV=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
MONGO_URI_PROD=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority

# JWT
JWT_SECRET_DEV=your-dev-secret
JWT_SECRET_PROD=your-prod-secret
```

Notes:

- The app connects using the URI according to `NODE_ENV`, but currently reads JWT settings from the development config in code.
- The database name used by the app is `rentify` (set in `putConnection.js`). Ensure your URI allows access to this database.

### Run

```
npm run serve
```

Server starts on `http://localhost:3000` by default.

## Authentication

- Obtain a JWT via `POST /api/auth/login`.
- Send the token in the `Authorization` header as the raw token (no `Bearer` prefix expected by current middleware).
- Single-session: logging in invalidates prior sessions for the same user.

## API Reference

Base URL: `/api`

### Auth

- POST `/auth/login`
  - Body:
    ```json
    {
      "email": "user@example.com",
      "password": "StrongP@ssw0rd"
    }
    ```
  - Response: `{ success: true, data: { token, user } }`

- GET `/auth/logout`
  - Headers: `Authorization: <token>`
  - Response: `{ message: "Logout successful" }`

### Registration

- POST `/register`
  - Body (validated):
    ```json
    {
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "password": "StrongP@ssw0rd",
      "phoneNumber": "9876543210",
      "userType": "BUYER" // or "SELLER"
    }
    ```
  - Response: `{ "success": "User registered successfully" }`

### Properties

Collection resides in MongoDB collection `properties`.

- GET `/property`
  - List all properties

- GET `/property/:sellerId`
  - List properties for a seller

- GET `/property/:sellerId/:propertyId`
  - Get property by id (ObjectId string)

- POST `/property/:sellerId` (seller-auth required)
  - Headers: `Authorization: <token>`
  - Body (validated, abbreviated example):
    ```json
    {
      "property_details": {
        "property_type": "apartment",
        "location": {
          "address": "123 Main St",
          "city": "NYC",
          "state": "NY",
          "zip_code": "10001",
          "landmarks": ["Park"]
        },
        "size": { "square_footage": 800, "bedrooms": 2, "bathrooms": 1 },
        "condition": "good",
        "furnishing": "semi",
        "amenities": { "in_unit": [], "building": [], "outdoor": [] }
      },
      "rental_terms": {
        "rent_amount": 1500,
        "lease_duration": "12m",
        "security_deposit": 1500,
        "utilities_included": [],
        "utilities_tenant_responsible": [],
        "parking": { "available": true, "cost": 100, "included_in_rent": false }
      },
      "seller_information": {
        "contact_name": "Jane Seller",
        "phone_number": "9876543210",
        "email": "seller@example.com"
      },
      "move_in_date": "2025-09-01"
    }
    ```

- PUT `/property/:sellerId/:propertyId` (seller-auth required)
  - Headers: `Authorization: <token>`
  - Body: same shape as create; updates document fields

- DELETE `/property/:sellerId/:propertyId` (seller-auth required)
  - Headers: `Authorization: <token>`

Authorization notes:

- Seller tokens must belong to the `:sellerId` in the route; otherwise the request is rejected.

## Error Handling

Errors follow a consistent shape:

```json
{
  "code": 400,
  "message": "Validation error message",
  "stack": "..." // included only in development
}
```

## Environment Details

- `NODE_ENV` controls which Mongo URI is used. Error responses include stacks in development.
- Current code references JWT secret and expiry from the development config in `jwtHelper` and `authentication` middleware.

## Known Limitations (for now)

- Passwords are compared in plain text (no hashing)
- JWT config hard-coded to development branch of config
- Duplicate mounting of auth routes via `/api/auth` appears in both `app.js` and `routes/router.js`
- No tests; limited input sanitation beyond schema validation
- Minimal authorization checks beyond seller match for property mutations

## Local Development Tips

- Use a tool like Insomnia/Postman to test endpoints
- Ensure `Authorization` header sends raw token string
- Seed `users` and `properties` collections as needed

## Context

This repository was created as part of a job application assignment with a tight timebox (about 3–4 hours) to implement both backend and frontend. It is intentionally minimal and not production-hardened. Given more time, I would add password hashing, better role/permission modeling, production-ready JWT handling, comprehensive tests, and CI/CD.


## License

ISC