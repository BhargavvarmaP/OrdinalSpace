import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';

export interface InscriptionParams {
  content: string;
  contentType: string;
  fee: number;
  address: string;
}

export interface BRC20MintParams {
  tick: string;
  amount: number;
  fee: number;
  address: string;
}

const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;

export const inscribeContent = async ({
  content,
  contentType,
  fee,
  address,
}: InscriptionParams) => {
  try {
    const network = process.env.NEXT_PUBLIC_BITCOIN_NETWORK === 'mainnet' ? MAINNET : TESTNET;
    
    // Create inscription transaction
    const inscriptionData = Buffer.from(content).toString('hex');
    const script = bitcoin.script.compile([
      bitcoin.opcodes.OP_FALSE,
      bitcoin.opcodes.OP_IF,
      Buffer.from('ord'),
      Buffer.from('01', 'hex'),
      Buffer.from(contentType),
      Buffer.from('0001', 'hex'),
      Buffer.from(inscriptionData, 'hex'),
      bitcoin.opcodes.OP_ENDIF
    ]);

    // Get UTXOs for the address
    const utxos = await getAddressUTXOs(address);
    
    // Create and sign transaction
    const psbt = new bitcoin.Psbt({ network });
    
    // Add inputs and outputs
    // This is a simplified version - in production, you'd need proper UTXO management
    utxos.forEach((utxo: { txid: any; vout: any; scriptPubKey: WithImplicitCoercion<string> | { [Symbol.toPrimitive](hint: "string"): string; }; value: any; }) => {
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: Buffer.from(utxo.scriptPubKey, 'hex'),
          value: utxo.value,
        },
      });
    });

    psbt.addOutput({
      script: script,
      value: 546, // Minimum dust value
    });

    return psbt;
  } catch (error) {
    console.error('Error creating inscription:', error);
    throw error;
  }
};

export const mintBRC20 = async ({
  tick,
  amount,
  fee,
  address,
}: BRC20MintParams) => {
  try {
    const mintInscription = JSON.stringify({
      p: 'brc-20',
      op: 'mint',
      tick: tick,
      amt: amount.toString(),
    });

    return await inscribeContent({
      content: mintInscription,
      contentType: 'application/json',
      fee,
      address,
    });
  } catch (error) {
    console.error('Error minting BRC20:', error);
    throw error;
  }
};

async function getAddressUTXOs(address: string) {
  const network = process.env.NEXT_PUBLIC_BITCOIN_NETWORK === 'mainnet' 
    ? 'https://blockstream.info/api'
    : 'https://blockstream.info/testnet/api';

  const response = await axios.get(`${network}/address/${address}/utxo`);
  return response.data;
}