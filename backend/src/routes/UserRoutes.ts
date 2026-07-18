import { Hono } from "hono";
import { UserSignin, UserSingup } from "../controllers/UserControllers.js";


const route=new Hono();

// user Routes 
route.post("/user/signup",UserSingup)
route.post("/user/signin",UserSignin)

//Post Routes



export default route;