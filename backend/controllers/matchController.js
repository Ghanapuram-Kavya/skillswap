// ============================================================================
// SkillSwap - Match Controller (2-Way Matching & Multi-Hop Discovery)
// ============================================================================

const graphService = require('../services/graphService');

exports.getOverviewStats = async (req, res, next) => {
  try {
    const userId = req.query.userId || 'usr-kavya';
    const stats = await graphService.getOverviewStats(userId);
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

exports.getMatchesForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const matches = await graphService.findSkillSwapMatches(userId);
    res.json({
      success: true,
      count: matches.length,
      userId,
      data: matches
    });
  } catch (err) {
    next(err);
  }
};

exports.getMultiHopRecommendations = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const recs = await graphService.getMultiHopRecommendations(userId);
    res.json({
      success: true,
      count: recs.length,
      userId,
      data: recs
    });
  } catch (err) {
    next(err);
  }
};
