// ============================================================================
// SkillSwap - User Controller
// ============================================================================

const graphService = require('../services/graphService');

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await graphService.getAllUsers();
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const profile = await graphService.getUserProfile(id);
    if (!profile) {
      return res.status(404).json({ success: false, message: `User '${id}' not found.` });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

exports.addSkillTaught = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { skillId, proficiency, experienceYears } = req.body;
    if (!skillId) {
      return res.status(400).json({ success: false, message: 'skillId is required.' });
    }
    const updated = await graphService.addSkillTaught(id, skillId, proficiency, experienceYears);
    res.json({ success: true, message: 'Skill added to teaching profile.', data: updated });
  } catch (err) {
    next(err);
  }
};

exports.removeSkillTaught = async (req, res, next) => {
  try {
    const { id, skillId } = req.params;
    const updated = await graphService.removeSkillTaught(id, skillId);
    res.json({ success: true, message: 'Skill removed from teaching profile.', data: updated });
  } catch (err) {
    next(err);
  }
};

exports.addSkillWanted = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { skillId, priority, currentLevel } = req.body;
    if (!skillId) {
      return res.status(400).json({ success: false, message: 'skillId is required.' });
    }
    const updated = await graphService.addSkillWanted(id, skillId, priority, currentLevel);
    res.json({ success: true, message: 'Skill added to learning wishlist.', data: updated });
  } catch (err) {
    next(err);
  }
};

exports.removeSkillWanted = async (req, res, next) => {
  try {
    const { id, skillId } = req.params;
    const updated = await graphService.removeSkillWanted(id, skillId);
    res.json({ success: true, message: 'Skill removed from learning wishlist.', data: updated });
  } catch (err) {
    next(err);
  }
};
