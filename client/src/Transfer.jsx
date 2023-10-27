import { useState } from "react";
import server from "./server";
import { secp256k1 } from 'ethereum-cryptography/secp256k1.js';
import { keccak256 } from 'ethereum-cryptography/keccak.js';

import {
  hexToBytes,
  toHex,
  utf8ToBytes
} from "ethereum-cryptography/utils";


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const amount = '' + parseInt(sendAmount);
    const msg = utf8ToBytes(recipient + amount);
    const msgHash = keccak256(msg);
    const signature = await secp256k1.sign(msgHash, privateKey);          
    
    const toString = (sign) => {
      for (const key in sign) {
        sign[key] = sign[key].toString();
      }

      return sign;
    }

    const jsonSignature = JSON.stringify(toString(signature));

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient: recipient,
        signature: jsonSignature,
        msg: msg,

      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
