'use strict';
const express = require('express');

const router = express();

router.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/dashboard.html');
})

module.exports = router;