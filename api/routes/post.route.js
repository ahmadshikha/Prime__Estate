import express from "express";
import {verifyToken} from "../middleware/verifyToken.js";
import { addPost, deletePost, getPost, getPosts, getPostsByUserId, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/get/:userId", getPostsByUserId);
router.post("/", verifyToken, addPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);

export default router;
