# StellarGive CLI Examples

## 1. Overview
This directory contains example scripts demonstrating how developers can interact with the StellarGive smart contracts programmatically from Node.js. 

These examples are intended for:
- **Learning**: Understanding Soroban RPC interactions and Stellar SDK usage.
- **Automation**: Scripting bulk operations or integration tests.
- **Integration Testing**: Verifying contract functionality against a live testnet.
- **Developer Onboarding**: Getting new contributors up to speed with the project's invocation patterns.

The primary script is `donate-cli.js`, which securely interacts with the contract on the testnet to fetch campaign data and execute a donation.

## 2. Prerequisites
- **Node.js**: v18.x or v20.x recommended
- **Stellar Testnet Account**: You must have a generated and funded keypair on the Stellar testnet.

## 3. Install Dependencies
This script utilizes the same `@stellar/stellar-sdk` used in the frontend. You can install the necessary dependencies from the `examples` directory:

```bash
npm init -y
npm install @stellar/stellar-sdk dotenv
```

## 4. Environment Setup
Copy the `.env.example` file to `.env` in this folder:

```bash
cp .env.example .env
```

Open `.env` and fill in the values:
```env
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NETWORK_PASSPHRASE=Test SDF Network ; September 2015
DONOR_SECRET_KEY=S... # Your private key (starts with S)
CONTRACT_ID=C...      # The deployed StellarGive contract ID
```

**Variables Explained:**
- `SOROBAN_RPC_URL`: The endpoint to communicate with the Stellar network. Defaults to the testnet.
- `NETWORK_PASSPHRASE`: Ensures your transaction is routed to the correct network.
- `DONOR_SECRET_KEY`: The private key of the account initiating the donation (used to sign the transaction). **Never commit your secret keys!**
- `CONTRACT_ID`: The ID of the Soroban smart contract you want to interact with.

## 5. Funding Testnet Account
You will need a testnet account with XLM (for transaction fees) and the supported tokens (for the donation amount).

1. **Get your public address** associated with your `DONOR_SECRET_KEY`. (It starts with `G...`)
2. **Fund via Friendbot**:
   Run the following curl command to fund your account with 10,000 testnet XLM.
   ```bash
   curl "https://friendbot.stellar.org?addr=YOUR_PUBLIC_ADDRESS"
   ```
   *Expected Result*: A JSON response indicating success.

*(Note: Depending on the contract configuration, you may also need to mint the specific testnet asset that the campaign accepts.)*

## 6. Running the Script
Run the script by passing three arguments: the campaign ID, the amount in stroops, and the token contract ID.

**Stroops Note:** 
In Stellar, 1 token = 10,000,000 stroops. To donate 1 XLM/USDC (assuming 7 decimals), you would pass `10000000`.

**Examples:**

*Donate 10 tokens to Campaign ID 1:*
```bash
node donate-cli.js 1 100000000 CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

*Donate 0.5 tokens to Campaign ID 5:*
```bash
node donate-cli.js 5 5000000 CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC
```

## 7. Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `DONOR_SECRET_KEY... must be set` | Missing environment variables | Ensure your `.env` file exists and contains valid values for the secret and contract. |
| `Simulation failed` | Multiple potential causes | 1) The account lacks sufficient XLM for the fee. <br> 2) The account lacks sufficient tokens to donate. <br> 3) The token contract ID is incorrect. |
| `Network confirmation status: FAILED` | Invalid Signature or Passphrase | Ensure `NETWORK_PASSPHRASE` matches the network you're trying to reach (Testnet). |
| `Campaign might not exist` | Invalid Campaign ID | Run a read check; ensure the `campaign_id` provided actually exists on this deployed contract. |
| `RPC unavailable` or Network Error | Soroban Testnet RPC is down/rate-limited | Retry your request. If issues persist, check the Stellar status dashboard. |
| `Error: <amount> must be positive` | Amount parsed as `<= 0` | Provide a valid integer amount in stroops. |
