const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    // get token
    const token = req.header('x-auth-token');

    if(!token){
        return res.status(401).json({ msg: "No tokan, Authorization denied"})
    }

    try {
        jwt.verify(token, "jwtSecretKey", (error, decoded) => {
            if(error) {
                return res.status(401).json({ msg: "Token is not valid"});
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.error("Something wrong with auth middleware");
        res.status(500).json({msg: "Server Error"});
    }
}