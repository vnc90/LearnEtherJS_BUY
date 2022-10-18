import { ethers, Wallet }  from "ethers"
import * as fs from 'fs';
import { get } from "http";
import {ABI_FACTORY, ABI_MINIMUM, ABI_PAIR, ABI_ROUNTER,ADD_ROUNTER,ADD_FACTORY,BNB, USDC, USDT, BUSD} from "./ABI.js"
let PRIVATEKEY = '532e9f22cc162df0eac45efb7be291d35710c6b0b5af9638903d1ce04059797d'
PRIVATEKEY = fs.readFileSync('./driver.secrec').toString().trim()
//setup to buy
let TOKEN_ADDRESS = '0x9aab0a9b3a2f7cf669f1385c48e0a063b93834bb'
const AMOUT_BNB_BUY = 0.001 // BNB buy
const SLIPPAGE_BUY = 5 //5%
const GAS_PRICE = 5 // Wei
const GAS_LIMIT = 1000000
// global vari
TOKEN_ADDRESS = ethers.utils.getAddress(TOKEN_ADDRESS)
const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org')
const wallet = new ethers.Wallet(PRIVATEKEY, provider)
const YOUR_ADDRESS = wallet.address
const contractRounter = new ethers.Contract(ADD_ROUNTER, ABI_ROUNTER, provider)
const contractToken = new ethers.Contract(TOKEN_ADDRESS, ABI_MINIMUM, provider )
const contractFactory = new ethers.Contract(ADD_FACTORY, ABI_FACTORY, provider)

//funtion 
const getInforToken = async (contractToken) => {
    const token = {
        name : await contractToken.functions.name(),
        symbol : await contractToken.functions.symbol(),
        decimal : await contractToken.functions.decimals(),

    }
    return token
}
const getPairInfor = async (contractFactory)  => {
    const contractBNB = new ethers.Contract(BNB, ABI_MINIMUM, provider)
    const contractUSDT = new ethers.Contract(USDT, ABI_MINIMUM, provider)
    const contractBUSD = new ethers.Contract(BUSD, ABI_MINIMUM, provider)
    const contractUSDC = new ethers.Contract(USDC, ABI_MINIMUM, provider)
    const pairBNB = await contractFactory.getPair(TOKEN_ADDRESS, BNB)
    const valuePairBNB = await contractBNB.balanceOf(pairBNB)
    console.log(valuePairBNB);
    const valuePairBNBatUSDT = (await contractRounter.getAmountsOut(valuePairBNB, [BNB,USDT]))[1]
    console.log(valuePairBNBatUSDT);
    const pairUSDT = await contractFactory.getPair(TOKEN_ADDRESS, USDT)
    const valuePairUSDT = await contractUSDT.balanceOf(pairUSDT)
    const pairBUSD = await contractFactory.getPair(TOKEN_ADDRESS, BUSD)
    const valuePairBUSD = await contractBUSD.balanceOf(pairBUSD)
    const pairUSDC = await contractFactory.getPair(TOKEN_ADDRESS, USDC)
    const valuePairUSDC = await contractUSDC.balanceOf(pairUSDC)

    
}
//main
const main = async () => {
    getPairInfor(contractFactory)

}


main()
