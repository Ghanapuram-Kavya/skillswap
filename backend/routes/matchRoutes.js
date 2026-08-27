const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/stats', matchController.getOverviewStats);
router.get('/:userId', matchController.getMatchesForUser);
router.get('/:userId/recommendations', matchController.getMultiHopRecommendations);

module.exports = router;
