const express = require('express');
const tokenMiddleware = require('../middlewares/tokenMiddleware');
const router = express.Router();

router.post('/login', (req, res) => {
    let model = {
        authenticated: req.body.authenticated,
        iss: req.body.iss,
        facility: req.body.facility,
        roles: req.body.roles
    }
    let token = tokenMiddleware.createToken(model);
    res.send(token);
})

module.exports = router;


