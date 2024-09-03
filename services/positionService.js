const pool = require('../config/db');
const { getTokenPrice, performDexTransaction } = require('../utils/raydium');

const openLongPosition = async (amount_token, asset_id, user_id) => {
  // Client balance check
  const clientBalanceResult = await pool.query('SELECT balance_quote FROM Clients WHERE client_id = $1', [user_id]);
  const clientBalance = clientBalanceResult.rows[0].balance_quote;
  const tokenPrice = await getTokenPrice(asset_id);

  const totalCost = amount_token * tokenPrice;

  if (clientBalance < totalCost) {
    throw new Error('Insufficient balance');
  }

  // Client balance renewal
  await pool.query('UPDATE Clients SET balance_quote = balance_quote - $1 WHERE client_id = $2', [totalCost, user_id]);

  // Interaction with Raydium
  const dexTransactionId = await performDexTransaction(amount_token, 'buy', asset_id);

  // Platform balance renewal
  await pool.query('UPDATE PlatformBalance SET balance_tokens = balance_tokens + $1, balance_sol = balance_sol - $2 WHERE balance_id = $3', [amount_token, totalCost, 'platform-id']);

  // Record transactionи
  await pool.query('INSERT INTO Transactions (transaction_id, user_id, asset_id, transaction_type, position_type, amount_token, quote_amount, status, date, dex_transaction_id) VALUES (uuid_generate_v4(), $1, $2, \'open_position\', \'long\', $3, $4, \'successful\', NOW(), $5)', [user_id, asset_id, amount_token, totalCost, dexTransactionId]);

  return { message: 'Long position opened successfully' };
};

const closeLongPosition = async (amount_token, asset_id, user_id) => {
  // Obtaining data on position
  const positionResult = await pool.query('SELECT amount_token FROM Transactions WHERE user_id = $1 AND asset_id = $2 AND position_type = \'long\' AND transaction_type = \'open_position\'', [user_id, asset_id]);
  const openAmount = positionResult.rows[0].amount_token;

  if (amount_token > openAmount) {
    throw new Error('Not enough tokens to close');
  }

  // Obtaining Data on Position
  const tokenPrice = await getTokenPrice(asset_id);
  const totalRevenue = amount_token * tokenPrice;

  // Interaction with Raydium
  const dexTransactionId = await performDexTransaction(amount_token, 'sell', asset_id);

  // Client and platform balance renewal
  await pool.query('UPDATE Clients SET balance_quote = balance_quote + $1 WHERE client_id = $2', [totalRevenue, user_id]);
  await pool.query('UPDATE PlatformBalance SET balance_tokens = balance_tokens - $1, balance_sol = balance_sol + $2 WHERE balance_id = $3', [amount_token, totalRevenue, 'platform-id']);

  // Transaction recording
  await pool.query('INSERT INTO Transactions (transaction_id, user_id, asset_id, transaction_type, position_type, amount_token, quote_amount, status, date, dex_transaction_id) VALUES (uuid_generate_v4(), $1, $2, \'close_position\', \'long\', $3, $4, \'successful\', NOW(), $5)', [user_id, asset_id, amount_token, totalRevenue, dexTransactionId]);

  return { message: 'Long position closed successfully' };
};

module.exports = { openLongPosition, closeLongPosition };
