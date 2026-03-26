const jwt = require("jsonwebtoken");

const config = require("../utils/config");
const result = require("../utils/result");

function authUser(req, res, next) {
  // for ever incoming request this middleware will be called
  const allAllowedUrls = ["/user/login", "/user/register"];
  if (allAllowedUrls.includes(req.url)) next();
  else {
    const token = req.headers.token;
    console.log("token", token);

    if (!token) res.send(result.createResult("Token is missing"));
    else {
      try {
        const payload = jwt.verify(token, config.secret);
        console.log("payload: ", payload);

        //req.headers.payload = payload
        req.headers.email = payload.email;
        req.headers.role = payload.role;

        return next();
        //authorization()
      } catch (ex) {
        console.log("ex", ex);

        return res.send(result.createResult("Token is Invalid"));
      }
    }
  }
}

function checkAuthorization(req, res, next) {
  const role = req.headers.role;
  console.log("current user role: ", role);

  if (role === "admin") {
    return next();
  }
  return res.send(result.createResult("UnAuthorized Access!"));
}

module.exports = { authUser, checkAuthorization };
