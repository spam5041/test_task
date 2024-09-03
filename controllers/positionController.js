const { openLongPosition, closeLongPosition } = require('../services/positionService');

exports.openPosition = async (req, res) => {
  try {
    const { amount_token, asset_id, user_id } = req.body;
    const result = await openLongPosition(amount_token, asset_id, user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.closePosition = async (req, res) => {
  try {
    const { amount_token, asset_id, user_id } = req.body;
    const result = await closeLongPosition(amount_token, asset_id, user_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
