const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserProfile);
router.post('/:id/skills/taught', userController.addSkillTaught);
router.delete('/:id/skills/taught/:skillId', userController.removeSkillTaught);
router.post('/:id/skills/wanted', userController.addSkillWanted);
router.delete('/:id/skills/wanted/:skillId', userController.removeSkillWanted);

module.exports = router;
