// ============================================================================
// SkillSwap - Swap Request Controller
// ============================================================================

const graphService = require('../services/graphService');

exports.getSwapRequests = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const requests = await graphService.getSwapRequests(userId);
    res.json({ success: true, count: requests.length, data: requests });
  } catch (err) {
    next(err);
  }
};

exports.sendSwapRequest = async (req, res, next) => {
  try {
    const { senderId, receiverId, offeredSkillId, wantedSkillId, message } = req.body;
    if (!senderId || !receiverId || !offeredSkillId || !wantedSkillId) {
      return res.status(400).json({
        success: false,
        message: 'senderId, receiverId, offeredSkillId, and wantedSkillId are required.'
      });
    }

    const newSwap = await graphService.sendSwapRequest(
      senderId,
      receiverId,
      offeredSkillId,
      wantedSkillId,
      message
    );
    res.status(201).json({ success: true, message: 'Skill swap request sent successfully!', data: newSwap });
  } catch (err) {
    next(err);
  }
};

exports.respondSwapRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACCEPTED or REJECTED
    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be ACCEPTED or REJECTED.' });
    }

    const updated = await graphService.respondSwapRequest(id, status);
    res.json({ success: true, message: `Swap request ${status.toLowerCase()}!`, data: updated });
  } catch (err) {
    next(err);
  }
};
