import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp.secp256k1.getPublicKey(privateKey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    const hash_message = keccak256(bytes);
    return hash_message;
  }
  async function signTransaction() {
    emptyMessage=""
    messageHash = hashMessage(emptyMessage);    
    signature = secp.secp256k1.sign(messageHash, privateKey, {recovered: true});
    const publicKey = secp.secp256k1.recoverPublicKey(messageHash, signature, recoveryBit);
    const recoveredAddress = toHex(secp.secp256k1.getPublicKey(publicKey));
    console.log("Recovered Address:", recoveredAddress);
    return signature;
  }
  
  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
      
      <input type="button" className="button" value="Sign Transaction" onClick={signTransaction}/>
    </div>
  );
}

export default Wallet;
