const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');

router.get('/explore', graphController.getFullGraph);
router.get('/path', graphController.findPath);
router.get('/health', graphController.getDatabaseHealth);

module.exports = router;
