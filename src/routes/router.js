import { Router } from 'express';
import registerRoute from './registerRoutes.js';
import authRoutes from './authRoutes.js'
import propertyRoutes from './propertyRoutes.js';
// import userRoutes from './userRoutes.js';
// import providerRoutes from './providerRoutes.js'
import { verifyToken } from '../app/middlewares/authentication.js';

const router = Router();

const allRoutes = [
    {
        path: '/register',
        route: registerRoute,
        middleware: [],
    },
    {
        path: '/auth',
        route: authRoutes,
        middleware: [],

    },
    {
        path: '/property',
        route: propertyRoutes,
        middleware: [],
    }
]

allRoutes.forEach(route => {
    router.use(route.path, route.route, ...route.middleware);
})

export default router;