import { Router } from 'express';
import {
    createTweet,
    getAllTweets,

} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/").get(getAllTweets);
router.use(verifyJWT).post("/",createTweet)



export default router