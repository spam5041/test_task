# TEST Platform API

## Description

API for managing long positions on a financial platform with support for tokens trade via Dex Raydium.


API

Opening a long position
URL: /Open-Position
Method: Post
Request body:

{
  "amount_token": 1.0,
  "asset_id": "asset-id",
  "user_id": "user-id"
}


Answer:

{
  "message": "Long position opened successfully"
}



Closing a long position
URL: /Close-Position
Method: Post
Request body:

{
  "amount_token": 1.0,
  "asset_id": "asset-id",
  "user_id": "user-id"
}

Anser:

{
  "message": "Long position closed successfully"
}
