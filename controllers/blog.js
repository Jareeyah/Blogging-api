const express = require("express");
const blogRouter = express.Router();
const Blog = require("../models/blog");
const verifyToken = require("../middleware/verifyToken");
const User = require("../models/user");

blogRouter.get("/getAll", async(req, res) => {
    try{
        const author = req.body.author
        const tags = req.body.tags
        if (author){
            const authorExist = await User.findOne({ author })
        if (!authorExist)
        {
            return res.status(401).json({ status: "Error", message: "Author does not exist!" })
        }
        const q = await Blog.find({ author }).sort({ read_count: -1, reading_time: -1, timestamps: -1 })
        return res.status(200).json({ status: "success", msg: "Blogs gotten by author", data: q });
    }
    else if (tags) {
        const q = await Blog.find({ $in: { tags: tags } }).sort({ read_count: -1,reading_time: -1, timestamps: -1 });
        return res.status(200).json({ status: "success", msg: "Blogs gotten by tags", data: q });
    }
    //add reading time
        const blog = await Blog.find().sort({ read_count: -1 });
        return res.status(200).json(blog);
    }
    catch (error)
    {
        return res.status(500).json(error.message)
    }
})

blogRouter.post("/find", async(req, res) => {
    try{
        const blogId = req.body.id
        const blogs = await Blog.findOne({ _id: blogId });
        return res.status(200).json(blogs);
    }
    catch (error)
    {
        return res.status(500).json(error.message)
    }
})

blogRouter.post("/", verifyToken, async(req, res) => {
    try{
        const blog = await Blog.create({...req.body, author: req.user.id }) //userId: req.body.Id,
        return res.status(200).json(blog)
    }
    catch (error)
    {
        return res.status(500).json(error.message)
    }
})

blogRouter.put("/updateBlog", verifyToken, async(req, res) => {
    try{
        const blog = await Blog.findById(req.body.id)
        if(blog.userId !== req.user.Id){
            throw new Error("You can only update your own posts")
        }
        const updateBlog = await Blog.findByIdAndUpdate(req.body.id, {$set: req.body}, {new: true})
        return res.status(200).json(updateBlog)
    }
    catch (error){
        return res.status(403).json(error.message)
    }
})

blogRouter.delete("/deleteBlog", verifyToken, async(req, res) => {
    try{
        const blog = await Blog.findById(req.body.id)
        console.log(blog);
        if(blog.userId !== req.user.Id){
            throw new Error("You can only delete your own posts")
        }
        const deleteBlog = await Blog.findByIdAndDelete(req.body.id)
        return res.status(200).json({message: "Blog successfully deleted"})
    }
    catch (error) {
        return res.status(403).json(error.message)
    }
})

blogRouter.get("/getUserBlog", verifyToken, async(req, res) => {
    try{
        const userId = req.user.id
        const q = await Blog.findOne({ author: userId })
        return res.status(200).json({status: "success", message: "gotten user blog", data: q })

    }
    catch (error) {
        return res.status(403).json(error.message)
    }
})

blogRouter.post("/getSingleBlog", async(req, res) => {
    try{
        const blogId = req.body.blogId
        await Blog.updateOne({ _id: blogId }, { read_count: + 1 })
        const q = await Blog.findOne({ _id: blogId })
        return res.status(200).json({status: "success", message: "gotten single blog", data: q})
    }
    catch (error){
        return res.status(403).json(error.message)
    }
})

module.exports = blogRouter;
