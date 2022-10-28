/* jshint esversion: 11 */
import "./App.css";
import React, { useState } from "react";
import { getEthereumProvider } from "@argent/login";
import * as zksync from "zksync-web3";

function App() {
  const [message, setMessage] = useState();

  // reference: https://docs.argent.xyz/#getting-started-with-vanilla-javascript
  const sign = async () => {
    const ethereumProvider = await getEthereumProvider({
      chainId: 280,
      rpcUrl: "https://zksync2-testnet.zksync.dev",
    });
    await ethereumProvider.enable();
    const provider = new zksync.Web3Provider(ethereumProvider);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const message = "Tevaera Test Message";

    // signature received after signing the message on the Argent App
    const signature = await signer.signMessage(message);

    return {
      address,
      message,
      signature,
    };
  };

  // reference: https://v2-docs.zksync.io/dev/developer-guides/transactions/aa.html#verifying-aa-signatures-within-our-sdk
  const verifySig = async (address, message, signature) => {
    const zkSyncProvider = new zksync.Provider(
      "https://zksync2-testnet.zksync.dev"
    );
    const isValid = await zksync.utils.isMessageSignatureCorrect(
      zkSyncProvider,
      address,
      message,
      signature
    );

    return isValid;
  };

  const handleClick = async () => {
    try {
      const { address, message, signature } = await sign();
      const isValid = await verifySig(address, message, signature);

      if (isValid)
        setMessage({ success: "Signature validated successfully (-_-)" });
      else setMessage({ error: "Signature validation failed!" });
    } catch (error) {
      setMessage({ error });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="btn wallet-step-items"
          onClick={() => {
            handleClick();
          }}
        >
          Login with Argent
        </button>
        <p>{JSON.stringify(message)}</p>
      </header>
    </div>
  );
}

export default App;
