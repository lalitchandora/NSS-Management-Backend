// routes/certificate.route.js
const express = require('express');
const router = express.Router();
const { issueCertificate } = require('../services/certificate.service');

router.post('/issue-certificate/:userId', async (req, res) => {
    try {
        await issueCertificate(req.params.userId);
        res.status(200).send('Certificate issued successfully.');
    } catch (error) {
        console.error('Error in certificate route:', error);
        res.status(500).send(`Error issuing certificate: ${error.message}`);
    }
});

module.exports = router;