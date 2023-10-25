const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

authRouter.post("/signup", async(req, res) => {
    const {email, password, first_name, last_name} = req.body;
    try{
        const isExisting = await User.findOne({ email: req.body.email });
        if (isExisting)
        {
            throw new Error("Already have an account with this email. Try another email");
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await User.create({first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: hashPassword });
        const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({ user: newUser, token: token});
    }
    catch (error)
    {
        res.status(500).json(error.message);
    };
});

authRouter.post("/login", async(req, res) => {
    const {email, password, first_name, last_name} = req.body;
    try{
        const user = await User.findOne({ email: req.body.email });
        if (!user)
        {
            throw new Error("Invalid details");
        }
        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if(!comparePass)
        {
            throw new Error("Invalid details");
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json(token);
    }
    catch (error)
    {
        res.status(500).json(error.message);
    };
});

module.exports = authRouter;