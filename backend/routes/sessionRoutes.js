const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/user/:userId', sessionController.getSessions);
router.post('/schedule', sessionController.createSession);
router.put('/:id/complete', sessionController.completeSession);

module.exports = router;
