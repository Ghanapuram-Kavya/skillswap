const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');

router.get('/user/:userId', swapController.getSwapRequests);
router.post('/request', swapController.sendSwapRequest);
router.put('/:id/respond', swapController.respondSwapRequest);

module.exports = router;
