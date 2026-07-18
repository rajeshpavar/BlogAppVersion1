import { Hono } from "hono";
import { AuthMiddlleware } from "../middlleware/AuthMiddleware.js";
import { AddPost, deletePost, deletePosts, getPost, getPosts, UpdatePost } from "../controllers/PostControlers.js";


const routes=new Hono();

//post user blog
routes.post("/post",AuthMiddlleware,AddPost)
routes.put("/post",AuthMiddlleware,UpdatePost)

//get users post
routes.get("/post",AuthMiddlleware,getPosts)
routes.get("/post/:id",AuthMiddlleware,getPost)

//delte post
routes.delete("/post",AuthMiddlleware,deletePosts);
routes.delete("/post/:id",AuthMiddlleware,deletePost)

export default routes;