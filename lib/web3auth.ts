import { Web3Auth } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID!;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1", // Ethereum Mainnet
  rpcTarget: "https://rpc.ankr.com/eth",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
};

export const web3auth = new Web3Auth({
  clientId,
  chainConfig,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  uiConfig: {
    appName: "Fantasy Horse League",
    mode: "dark",
    logoLight: "https://web3auth.io/images/web3auth-logo.svg",
    logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
    defaultLanguage: "en",
    theme: {
      primary: "#0ea5e9",
    },
  },
});

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "optional",
  },
  adapterSettings: {
    whiteLabel: {
      appName: "Fantasy Horse League",
      appUrl: "https://fantasy-horse-league.vercel.app",
      logoLight: "https://web3auth.io/images/web3auth-logo.svg",
      logoDark: "https://web3auth.io/images/web3auth-logo---Dark.svg",
      defaultLanguage: "en",
      mode: "dark",
      theme: {
        primary: "#0ea5e9",
      },
    },
  },
});

web3auth.configureAdapter(openloginAdapter);

export const initWeb3Auth = async () => {
  try {
    await web3auth.initModal();
    return web3auth;
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
    throw error;
  }
};
