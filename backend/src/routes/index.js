import { Router } from "express";
import userRouter from "../modules/users/user.routes.js";
import postRouter from "../modules/posts/post.routes.js";

const rootRouter = Router();

// Connect endpoints
rootRouter.use("/auth", userRouter);
rootRouter.use("/", postRouter);

export default rootRouter;
