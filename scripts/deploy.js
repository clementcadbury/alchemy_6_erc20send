// const ethers = require('ethers'); //  ethers is given by hardhat with parameters from hardhat.config.js
// require('dotenv').config();

const _IERC20 = require('@openzeppelin/contracts/build/contracts/IERC20');
const IERC20 = new ethers.Interface(_IERC20.abi);

const targetABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"","type":"address"}],"name":"Winner","type":"event"},{"inputs":[{"internalType":"address","name":"erc20","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"drop","outputs":[],"stateMutability":"nonpayable","type":"function"}];

async function main() {

  console.log("Ethers version : " + ethers.version);

  const [wallet] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", wallet.address);
  const weiAmount = (await ethers.provider.getBalance(wallet.address)).toString();
  console.log("Account balance:", (await ethers.formatEther(weiAmount)));

  /*const Token = await ethers.getContractFactory("CadburyToken");
  const token = await Token.deploy();
  const tokenAddress = token.target;*/

  const tokenAddress = "0xA72Ea9E52F561a89eFc36949C204A5484D00AA64";

  // call approve for rubbish token
  const tokenContract = new ethers.Contract(tokenAddress,IERC20,wallet);
  const spender = "0x873289a1aD6Cf024B927bd13bd183B264d274c68";
  const amount = ethers.parseUnits("10","ether");
  const tx1 = await tokenContract.approve(spender,amount);
  await tx1.wait();

  console.log("Approved");

  const targetContract = new ethers.Contract(spender,targetABI,wallet);
  const tx2 = await targetContract.drop(tokenAddress,amount);
  await tx2.wait();

  console.log("targeted");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
});