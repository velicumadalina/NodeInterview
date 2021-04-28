'use strict';
const express = require('express');
const tokenMiddleware = require('../middlewares/tokenMiddleware');
let csvToJson = require('../services/csvToJsonService');
let enteredIds = [];
const router = express.Router();

router.post('/', tokenMiddleware.authenticateJwt, tokenMiddleware.checkPermission, handlePractitionerPostRequest);

function handlePractitionerPostRequest(req, res) {
    if (req.header('Content-Type') === 'text/csv') {
        var data = new Buffer.from('');
        req.on('data', function (chunk) {
            data = Buffer.concat([data, chunk]);
        });
        req.on('end', function () {
        req.rawBody = data;
        handleInformationFromCsv(req, res);
        });
    }
    else {
        handleInformationFromJson(req, res);
    } 
}

function handleInformationFromJson(req, res) {
    handleJsonErrors(req,res);
    enteredIds.push(req.body.id);
    if (req.body.active) {
        res.json({ name: req.body.name, facility: getFacilitiesInHeader(req.model.facility, req.body.facility) });
    }
}

function getFacilitiesInHeader(headerFacilities, jsonFacilities){
    let facilities = [];
    for(let jFacility of jsonFacilities){
        if(headerFacilities.includes(jFacility.value)){
            facilities.push(jFacility);
        }
    }
    return facilities;
}

function handleInformationFromCsv(req, res) {
    let practitionersJson = csvToJson.convertCsvStringToJson(req.rawBody.toString());
    let practitioners = createArrayOfPractitioners(practitionersJson, req, res);
    if(practitioners === -1){
        return res.status(400).json(
            {error:{status:400,message: "A Practitioner has multiple IDs"}})}
    let practitionersAndHospitals = [];
    for (let practitioner of practitioners) {
        let practitionerInfo = `${practitioner.name}: ${practitioner.hospitals.join(',')}`;
        practitionersAndHospitals.push(practitionerInfo);
    }
    res.send(practitionersAndHospitals.join('\n'));

}

function checkDoctorExists(doctorsJson, doctorName) {
    for (let doctor of doctorsJson) {
        if (doctor.name === doctorName) {
            return true;
        }
    }
    return false;
}

function createArrayOfPractitioners(practitionersJson, req, res) {
    let practitioners = [];
    let facilitiesFromHeader = req.model.facility;
    for (let practitioner of practitionersJson) {
        let practitionerName = `${practitioner.FamilyName} ${practitioner.GivenName}`;
        let hospital = practitioner.NameId;
        if (practitioner.Active.toLowerCase() === 'true') {
            if (facilitiesFromHeader.includes(practitioner.FacilityId)) {
                if (checkDoctorExists(practitioners, practitionerName)) {

                    if (practitioner.ID === practitioners.find(p => p.name === practitionerName).id) {
                        practitioners.find(p => p.name === practitionerName).hospitals.push(hospital);
                    } else {
                        return -1;
                    }
                } else {
                    let temp = {
                        id: practitioner.ID,
                        name: practitionerName,
                        hospitals: [hospital]
                    }
                    practitioners.push(temp);
                }
            }
        }
    }
    return practitioners;
}

function handleJsonErrors(req, res) {
    if (!req.body.id || isNaN(parseInt(req.body.id))) {
        throwError('The ID field is required', 400);
    }
    if (req.body.resourceType !== 'Practitioner') {
        throwError('Not a practitioner!', 400);
    }
    if (!req.body.active) {
        throwError('No active practitioners', 400);
    }
    if (enteredIds.includes(req.body.id)) {
        throwError('ID ALREADY ENTERED!', 400);
    }
}

function throwError(message, status) {
    let error = new Error(message);
    error.status = status;
    throw error;
}

module.exports = router;