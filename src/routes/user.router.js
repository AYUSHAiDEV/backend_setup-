import {Router} from "express"
import {resgisteruser} from "../controllers/user.controller"
const router = Router()

router.route("/register").post(resgisteruser)

export default router
