import TronWeb from 'tronweb'
//import crypto from 'crypto'

var privateKey = 'a1b346c801ec455db8de5e50fbb74c0f0eafd8a4054880de0d585e95b5dd4a19';
//console.log("Private Key", privateKey);

const TRON_PROVIDER = process.env.NEXT_PUBLIC_TRON_PROVIDER

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(TRON_PROVIDER);
const solidityNode = new HttpProvider(TRON_PROVIDER);
const eventServer = new HttpProvider(TRON_PROVIDER);
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
if("production" == process.env.NODE_ENV){
    tronWeb.setHeader({"TRON-PRO-API-KEY": process.env.NEXT_PUBLIC_TRON_API_KEY});
}

export default tronWeb