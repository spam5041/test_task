const { openLongPosition, closeLongPosition } = require('../services/positionService');

test('should open long position successfully', async () => {
  const result = await openLongPosition(1.0, 'asset-id', 'user-id');
  expect(result.message).toBe('Long position opened successfully');
});

test('should close long position successfully', async () => {
  const result = await closeLongPosition(1.0, 'asset-id', 'user-id');
  expect(result.message).toBe('Long position closed successfully');
});
