const { secp256k1 } = require('ethereum-cryptography/secp256k1.js');
const { getRandomBytesSync } = require('ethereum-cryptography/random.js');
const { toHex } = require('ethereum-cryptography/utils.js');

const privateKey = getRandomBytesSync(32);
const publicKey = secp256k1.getPublicKey(privateKey, false);

console.log('\nPrivate Key: ' + toHex(privateKey));
console.log('Public Key: ' + toHex(publicKey) + '\n');

/* keys generated:

Private Key: b66ddae116db2e1c8134a14454fe171cbe8d42c4fec76b9f298ba100ca81acc9
Public Key: 04b379a6714e561bbdff0378e49a4e738e1cbfdbb445fd6f03324d61ce2ee38d2dbe80726ec420a0905b9cbb9036a3bdb077497111c710161357d9b266ac517bc4
-----------------------------------

Private Key: 2609afb981a769a691c8f68c255c8bac89c10774b37533f94709f7e1226928a6
Public Key: 0431d1cd92557fab2e521c74e69d0709a9410dbea94c259dbf37504035a0b3e4ea6c43b4ec07d133555544365260732438146ef4cae754116e16eec0a60c6b8beb

-----------------------------------

Private Key: adb722cc787d377296f1c3e79d8b3b1de2e5c459ad4f44441d10837762354bc8
Public Key: 04063ef2f3daf3b612d5aa23dbb10d439473460ea91343d9834e711ea4541c6819d3c40a93e566df954b98fc9e3273debc0be2302001b3b5cdcbc9fa392d0b95ed

*/
