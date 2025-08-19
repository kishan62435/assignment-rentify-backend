import { Router } from "express";
import validate from "../app/middlewares/validate";

const router = Router();

router.
    route("/:sellerId")
    .get(validate)