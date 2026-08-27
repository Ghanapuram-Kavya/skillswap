// ============================================================================
// SkillSwap - Centralized Error Handling Middleware
// ============================================================================

function errorHandler(err, req, res, next) {
  console.error('🔥 SkillSwap API Error:', err);

  if (err.name === 'Neo4jError' || err.code?.startsWith('Neo.')) {
    return res.status(503).json({
      success: false,
      errorType: 'DATABASE_ERROR',
      message: 'Unable to connect to SkillSwap graph database on CognoDB Cloud.',
      details: err.message,
      code: err.code
    });
  }

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    errorType: err.name || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occurred while executing graph traversal.',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
