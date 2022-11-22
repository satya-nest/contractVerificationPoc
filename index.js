const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
//const ethers = require('ethers');
const web3 = new Web3(new Web3.providers.HttpProvider('https://api.avax-test.network/ext/bc/C/rpc'));

const getCode = async (address) => {
    try {
        let receipt = await web3.eth.getTransaction
        (address);
        receipt = receipt.input.slice(2);
        console.log({web3Code : receipt});
        return receipt;
    } catch (error) {
        console.log({ error: error.message });
    }
}
const source = fs.readFileSync('./contracts/hello.sol', 'UTF-8');
//console.log(source);
//console.log(solc.compile(source, 1).contracts[':HelloByHarsh']);

const compilingSolidityCode = async () => {
    const input = {
        language: 'Solidity',
        sources: {
          'test.sol': {
            content: source
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    let contractByteCode;
    for (var contractName in output.contracts['test.sol']) {
            contractByteCode=output.contracts['test.sol'][contractName].evm.bytecode.object
            console.log({compiledCode : contractByteCode});
      }
    return contractByteCode;

}
//getCode('0xcBb5556476270AB115166fE2454570E7C6F55C5f');
// const compilingSolidityCode = async () => {
    
// //    const output=  solc.loadRemoteVersion('v0.8.15+commit.e14f2714', function (err, solcSnapshot) {
// //          if(err){
// //              return err;
// //          }
// //          //console.log(source);
// //           return solcSnapshot.compile(JSON.stringify(input));
// //       })
// //       console.log(output);
// const output = solc.loadRemoteVersion('v0.8.15+commit.e14f2714',function(err,solcSnapshot) {
//     if(err){
//         console.log({ error : err})
//     }
//     else{
//         return JSON.parse(solcSnapshot.compile(JSON.stringify(input)))
//     }
// })
// console.log({ compiled : output });
// }

// compilingSolidityCode();

const compareAndVerify = async () => {
    const codeOnChain = await getCode('0x5a343cb7e3ac2192500b5ae6271e922fa3c0f8e9e18df79ae2de90e4f34801ce');
    const codeCompiled = await compilingSolidityCode();
    if( codeOnChain.valueOf() ==codeCompiled.valueOf() ) {
        //  console.log(codeOnChain.length);
        // console.log(codeCompiled.length);
        console.log({codeOnChain : codeOnChain});
        console.log({codeCompiled : codeCompiled});
        console.log('contract is verified');
        return true;
    }
    else {
         console.log(codeOnChain.length);
        console.log(codeCompiled.length);
        console.log( typeof codeCompiled);
        console.log(typeof codeOnChain);
        for(let i=0;i<codeOnChain.length;i++){
            if(codeOnChain[i]!=codeCompiled[i]){
                console.log(i,codeOnChain[i],codeCompiled[i]);
            }
        }
        // console.log({codeOnChain : codeOnChain});
        // console.log({codeCompiled : codeCompiled});
        console.log('contract is not verified');
        return false;
    }
}

compareAndVerify();