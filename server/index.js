const express = require("express");

const {
  toHex,
  hexToBytes,
  utf8ToBytes
} = require('ethereum-cryptography/utils');

const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');
const { keccak256 } = require('ethereum-cryptography/keccak.js');

const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const longKey1 = '04b379a6714e561bbdff0378e49a4' +
                 'e738e1cbfdbb445fd6f03324d61ce' +
                 '2ee38d2dbe80726ec420a0905b9cb' +
                 'b9036a3bdb077497111c710161357' +
                 'd9b266ac517bc4';

const longKey2 = '0431d1cd92557fab2e521c74e69d0' +
                 '709a9410dbea94c259dbf37504035' +
                 'a0b3e4ea6c43b4ec07d1335555443' +
                 '65260732438146ef4cae754116e16' +
                 'eec0a60c6b8beb';

const longKey3 = '04063ef2f3daf3b612d5aa23dbb10' +
                 'd439473460ea91343d9834e711ea4' +
                 '541c6819d3c40a93e566df954b98f' +
                 'c9e3273debc0be2302001b3b5cdcb' +
                 'c9fa392d0b95ed';

const balances = {
  [longKey1] : 100,
  [longKey2]: 50,
  [longKey3]: 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {

  
  const { 
    sender,
    recipient,
    amount,
    signature,
    msg
   } = req.body;



  const msgList = [];
  let i = 0;  

  while (msg[i] !== undefined) {
    
    msgList.push(msg[i]);
    i++;
  }
  const msgArray = new Uint8Array(msgList);
  const msgHash = keccak256(msgArray);
  
  const sigParse = JSON.parse(signature);
  const sigR = BigInt(sigParse.r);
  const sigS = BigInt(sigParse.s);
  
  if (! secp256k1.verify({r: sigR, s: sigS}, msgHash, sender)) {
    res.status(400).send({ message: "invalid signature!" });
    return;
  }



  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
