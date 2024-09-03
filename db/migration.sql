CREATE TABLE Clients (
  client_id UUID PRIMARY KEY,
  balance_quote DECIMAL
);

CREATE TABLE PlatformBalance (
  balance_id SERIAL PRIMARY KEY,
  balance_tokens DECIMAL,
  balance_sol DECIMAL
);

CREATE TABLE Transactions (
  transaction_id UUID PRIMARY KEY,
  user_id UUID,
  asset_id UUID,
  transaction_type VARCHAR(50),
  position_type VARCHAR(50),
  amount_token DECIMAL,
  quote_amount DECIMAL,
  status VARCHAR(50),
  date TIMESTAMP,
  dex_transaction_id VARCHAR(255)
);
