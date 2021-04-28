const jwt = require('jsonwebtoken');
const secret = require('crypto').randomBytes(64).toString('hex');


function authenticateJwt(req, res, next) {
    const authHeader = req.headers['x-vamf-jwt'];
    const token = authHeader.split(" ")[1];
    if (authHeader === null) {
        let error = new Error('Unauthorized!');
        error.status = 401;
        throw error; }
    jwt.verify(token, secret, (err, model) => {
        if (err) { throw err; }
        req.model = model;
        next();
    });
}

function checkPermission(req, res, next) {
    let roles = req.model.roles;
    if (!roles.includes('Admin') && !roles.includes('Practitioner')) {
        let error = new Error('Only Admin and Practitioner allowed!');
        error.status = 401;
        throw error; }
    next();
}

function createToken(jwtModel) {
    const token = jwt.sign(jwtModel, secret);
    return token;
}

module.exports.authenticateJwt = authenticateJwt;
module.exports.checkPermission = checkPermission;
module.exports.createToken = createToken;