const express = require("express");
const verifyToken = require("../middleware/verifyToken")
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const User = require("../models/user");

userRouter.get("/find/:userId", async(req,res) => {
    try{
        const user = await User.findById(req.params.userid)
        if(!user)
        {
            throw new Error("No user found");
        }
        return res.status(200).json(user)
    }
    catch (error){
        return res.status(500).json(error.message)
    }
})

userRouter.get("/findAll/", async(req, res) => {
    try{
        const users = await User.find(req.params.userid)
        if(!users)
        {
            throw new Error("No user");
        }
        const formatUsers = users.map((user) => {
            return {first_name: user.first_name, last_name: user.last_name, email: user.email, id: user._id}
        })
        return res.status(200).json(formatUsers)
    }
    catch (error){
        return res.status(500).json(error.message)
    }
})

userRouter.put("/updateUser/:userId", async(req, res) => {
    if(req.params.userId === req.user.id)
    {
        try{
            if(req.body.password)
            {
                req.body.password = await bcrypt.hash(req.body.password, 10)
            }
            const updateUser = await User.findByIdAndUpdate(req.params.userId, {$set: req.body}, {new: true})
        }
        catch (error)
        {
            return res.status(500).json(error.message);
        }
    }
    else
    {
        return res.status(403).json({message: "You can only update your own profile!"})
    }
})

userRouter.delete("/deleteUser/:userId", async(req, res) => {
    if(req.params.userId === req.user.id)
    {
        try
        {
            await User.findByIdAndDelete(req.params.userId)
            return res.status(200).json({message: "User successfully deleted"})
        }
        catch (error)
        {
            return res.status(500).json(error.message);

        }
    }
    else
    {
        return res.status(403).json({message: "You can only delete your own profile!"})
    }
})

module.exports = userRouter