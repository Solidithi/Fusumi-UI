import { Aptos, AptosConfig, ClientConfig, Network } from "@aptos-labs/ts-sdk";

interface Args {
  indexerApiUrl: string;
  apiKey: string;
}

// const main = async ({ indexerApiUrl, apiKey }: Args) => {
  const clientConfig: ClientConfig = {
    API_KEY: process.env.APTOS_API_KEY || "",
  };
  const config = new AptosConfig({
    network: Network.TESTNET,
    indexer: process.env.APTOS_INDEXER_URL || "https://api.testnet.aptoslabs.com/v1/graphql",
    clientConfig,
  });
  export const aptos = new Aptos(config);

  // Use getAccountInfo instead of the non-existent getAccountDataByAddress
//   const response = await aptos.account.getAccountInfo({
//     accountAddress: "0x1234567890123456789012345678901234567890123456789012345678901234",
//   });

//   console.log(response);
// };

// main({
//   indexerApiUrl: "https://api.testnet.aptoslabs.com/v1/graphql",
//   apiKey: process.env.APTOS_API_KEY || "",
// });
