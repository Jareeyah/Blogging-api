const express = require("express");
const blogRouter = express.Router();
const Blog = require("../models/blog");
const verifyToken = require("../middleware/verifyToken")

blogRouter.get("/getAll", async(req, res) => {
    try{
        const blog = await Blog.find({});
        return res.status(200).json(blog);
    }
    catch (error)
    {
        return res.status(500).json(error.message)
    }
})

blogRouter.get("/find/:id", async(req, res) => {
    try{
        const blogs = await Blog.findById(req.params.id);
        return res.status(200).json(blogs);
    }
    catch (error)
    {
        return res.status(500).json(error.message)
    }
})

blogRouter.post("/", verifyToken, async(req, res) => {
    try{
        const blog = await Blog.create({...req.body, userId: req.body.Id})
        return res.status(201).json(blog)
    }
    catch (error)
    {
        return res.status(500).json(error.message)
    }
})

blogRouter.put("/updateBlog/:id", verifyToken, async(req, res) => {
    try{
        const blog = await Blog.findById(req.params.id)
        if(blog.userId !== req.user.Id){
            throw new Error("You can only update your own posts")
        }
        const updateBlog = await Blog.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
        return res.status(200).json(updateBlog)
    }
    catch (error){
        return res.status(403).json(error.message)
    }
})

blogRouter.delete("/deleteBlog/:id", verifyToken, async(req, res) => {
    try{
        const blog = await Blog.findById(req.params.id)
        if(blog.userId !== req.user.Id){
            throw new Error("You can only delete your own posts")
        }
        const deleteBlog = await Blog.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "Blog successfully deleted"})
    }
    catch (error){
        return res.status(403).json(error.message)
    }
})

module.exports = blogRouter;
