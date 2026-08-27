// ============================================================================
// SkillSwap - Graph Explorer & Pathfinding Controller
// ============================================================================

const graphService = require('../services/graphService');
const { getIsConnected, getConfig } = require('../config/database');

exports.getFullGraph = async (req, res, next) => {
  try {
    const types = req.query.types ? req.query.types.split(',') : [];
    const graph = await graphService.getFullGraph(types);
    res.json({ success: true, data: graph });
  } catch (err) {
    next(err);
  }
};

exports.findPath = async (req, res, next) => {
  try {
    const { source, target } = req.query;
    if (!source || !target) {
      return res.status(400).json({ success: false, message: 'source and target parameters are required.' });
    }
    const path = await graphService.findShortestPath(source, target);
    res.json({ success: true, data: path });
  } catch (err) {
    next(err);
  }
};

exports.getDatabaseHealth = async (req, res, next) => {
  try {
    const isConnected = getIsConnected();
    const config = getConfig();
    res.json({
      success: true,
      database: {
        connected: isConnected,
        mode: isConnected ? 'COGNODB_CLOUD' : 'IN_MEMORY_FALLBACK',
        status: isConnected ? 'OPERATIONAL' : 'FALLBACK_ACTIVE',
        endpoint: config.uri || 'In-Memory Graph Store',
        user: config.username || 'cognodb'
      }
    });
  } catch (err) {
    next(err);
  }
};
