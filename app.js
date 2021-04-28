const express = require('express');
const app = express();
const practitionerRoutes = require('./routes/practitioners');
const createTokenRoutes = require('./routes/createToken');

const fileUpload = require('express-fileupload');
app.use(express.json());
app.use(fileUpload());
app.use('/', practitionerRoutes);
app.use('/', createTokenRoutes);
app.use((req, res, next) => { const error = new Error('not found'); error.status = 404; next(error); });
app.use((error, req, res, next) => { res.status(error.status || 500); res.json({ error: { status: error.status, message: error.message } }) })
module.exports = app;