const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');

router.get('/categories', skillController.getAllCategories);
router.get('/prerequisites/:skillName', skillController.getPrerequisitePath);
router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillDetails);

module.exports = router;
