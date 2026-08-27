// ============================================================================
// SkillSwap - Skill Controller
// ============================================================================

const graphService = require('../services/graphService');

exports.getAllSkills = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const skills = await graphService.getAllSkills(category, search);
    res.json({ success: true, count: skills.length, data: skills });
  } catch (err) {
    next(err);
  }
};

exports.getSkillDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await graphService.getSkillDetails(id);
    if (!skill) {
      return res.status(404).json({ success: false, message: `Skill '${id}' not found.` });
    }
    res.json({ success: true, data: skill });
  } catch (err) {
    next(err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await graphService.getAllCategories();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.getPrerequisitePath = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    const path = await graphService.getPrerequisitePath(skillName);
    if (!path) {
      return res.status(404).json({ success: false, message: `Skill '${skillName}' not found.` });
    }
    res.json({ success: true, data: path });
  } catch (err) {
    next(err);
  }
};
