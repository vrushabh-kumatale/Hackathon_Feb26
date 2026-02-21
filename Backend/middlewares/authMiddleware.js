
const jwt = require("jsonwebtoken");
const config = require("../config");
const { errorResponse } = require("../utils/apiResponse");

function authorization(req, res, next) {

    // Routes allowed without token
    const publicRoutes = [
        "/user/login",
        "/user/register",
        
    ];

    if (publicRoutes.includes(req.originalUrl)) {
        return next();
    }

    const token = req.headers.token;

    if (!token) {
        return res.send(errorResponse("Token is Missing"));
    }

    try {
        const payload = jwt.verify(token, config.secret);

        // Store user info in request
        req.user = {
            email: payload.email,
            role: payload.role
        };

        return next();
        
    } catch (error) {
        return res.send(errorResponse("Invalid Token"));
    }
}

// Optional – for admin-only routes
function checkAuthorization(request, response, next) {
    if (request.user && request.user.role === "admin") {
        return next();
    }
    return response.send(errorResponse("Unauthorized Access Admin Only"));
}

module.exports = { authorization, checkAuthorization };
