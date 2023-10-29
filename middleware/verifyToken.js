const jwt = require("jsonwebtoken")

const verifyToken = async(req, res, next) => {
    if(!req.headers.authorization)
    {
        return res.status(403).json({message: "Not authorized, No token!"})
    }
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
    const token =  req.headers.authorization.split(" ")[1]
    // console.log("Received Token:", token);

    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
        if (err)
        {
            return res.status(403).json({message: "Expired or Wrong token!"});
        }
        else
        {
            req.user = data;
            next()
        }
    })
    }
    else
    {
        return res.status(403).json({message: "Not authorized, No token!"})
    }
}

module.exports = verifyToken