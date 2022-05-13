const jwt = require('jsonwebtoken');
const config = require('config');

//next - just says move on to the next piece of middleware
module.exports = function(req, res, next) {
    //Get the token from the header
    const token = req.header('x-auth-token');

    //check if not token
    if (!token) {
        return res.status(400).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        //take the user out but only have user id so assign that user to request object
        req.user = decoded.user;
        next();

    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }

};