import { SorobanRpc, TransactionBuilder, Networks } from "@stellar/stellar-sdk";

const rpcUrl = process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || "https://soroban-testnet.stellar.org";
export const server = new SorobanRpc.Server(rpcUrl);
