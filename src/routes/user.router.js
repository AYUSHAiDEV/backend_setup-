import {Router} from "express"
import {registeruser,loginuser,logoutuser,refreshaccesstoken} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import {verifyjwt} from "../middlewares/authmiddleware.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxcount:1
        },
        {
            name:"coverimage",
            maxcount:1
        }
    ]),
    registeruser
)

router.route("/login").post(
    loginuser
)

router.route("/logout").post(
    verifyjwt,
    logoutuser
)

router.route("/refresh-token").post(refreshaccesstoken)


export default router
