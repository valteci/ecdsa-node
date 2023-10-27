import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { toHex } from 'ethereum-cryptography/utils.js'

function Wallet({ 
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,  
  }) {

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
  }

  async function generatePublicKey() {        
    
    try { 
      const address = toHex(
        secp256k1.getPublicKey(privateKey, false)
      );
  
      setAddress(address);        
      
      if (address) {
        const {
          data: { balance },
        } = await server.get(`balance/${address}`);
        setBalance(balance);
      } else {
        setBalance(0);
      }

    } catch(err) {
      alert(err.message);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input id="privateKey" placeholder="Type your private key" onChange={onChange}></input>
      </label>

      <label>
        Public Key
        <input value={address}></input>
      </label>

      <button className="button" onClick={generatePublicKey}>
        Generate Public Key & Refresh Balance
      </button>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
