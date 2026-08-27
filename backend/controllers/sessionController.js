// ============================================================================
// SkillSwap - Learning Session & Review Controller
// ============================================================================

const graphService = require('../services/graphService');

exports.getSessions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const sessions = await graphService.getSessions(userId);
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (err) {
    next(err);
  }
};

exports.createSession = async (req, res, next) => {
  try {
    const { swapId, teacherId, learnerId, skillId, date, time, mode, meetingLink } = req.body;
    if (!teacherId || !learnerId || !skillId) {
      return res.status(400).json({ success: false, message: 'teacherId, learnerId, and skillId are required.' });
    }

    const session = await graphService.createSession(
      swapId,
      teacherId,
      learnerId,
      skillId,
      date,
      time,
      mode,
      meetingLink
    );
    res.status(201).json({ success: true, message: 'Learning session scheduled!', data: session });
  } catch (err) {
    next(err);
  }
};

exports.completeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const session = await graphService.completeSession(id, rating, comment);
    res.json({ success: true, message: 'Session completed and review submitted!', data: session });
  } catch (err) {
    next(err);
  }
};
