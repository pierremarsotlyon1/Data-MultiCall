// Import needed libraries
import fs from 'fs';
import { ethers, utils, BigNumber } from 'ethers';
import { Multicall } from 'ethereum-multicall';
import BaseReward from "./abi/BaseReward.json" assert { type: "json" };


// Add all the needed gauges here
const gaugeList = [
    "0xa2e9633e5211a09a580d1b0410d58ae339196421" // comp/wstETH
]

// Users addresses (can be used for lockers too)
const addressesList = [
    "0x36cc7B13029B5DEe4034745FB4F24034f3F2ffc6",
    "0x1E7267fA2628d66538822Fc44f0EDb62b07272A4",
    "0xc0a893145aD461AF44241A7DB5bb99B8998e7d2c",
    "0x014E61311e4DD2364CF6c0868C9978C5887deca8",
    "0xc407e861f5a16256534B0c92fDD8220A35831840",
    "0xAE0BAF66E8f5Bb87A6fd54066e469cDfE93212Ec",
    "0x45EC6a657aD37845Dc1D2C3Ac653721D3037bF41",
    "0x8a8743AFC23769d5B27Fb22af510DA3147BB9A55",
    "0xfA2d501dEA12306281b9FBccC93bcbBe38Ef0A4e",
    "0x9e9f535Da358Bf4f9cDc10A3D690DCF981956F68",
    "0x8b781a032c0FF967d2786A66afB1dbd5128FC382",
    "0x90bE067d924d86d4E2CfbDf7b1698A1F665cb61B",
    "0x50EcfCc005A10537FfacF02466690A0d00145e47",
    "0x0A7B24CcA8E5b9379535649493feE3c2b0F61dC5",
    "0x11EeF043a0908F209ce53ac289a0Fec2e82ce45D",
];

// RPC node to use for the Ethereum mainnet
const rpcNode = "https://eth.llamarpc.com";

////////////////////////////////////////////////////////////////
/// --- Nothing to change below this line!!
////////////////////////////////////////////////////////////////

// Create a provider for the Ethereum mainnet, using public Llama RPC node
let provider = new ethers.providers.JsonRpcProvider(rpcNode);

// Create a new instance of the multicall object
const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

// Create a contract call context for each gauge
const contractCallContext = gaugeList.map((gauge) => {
    // Create a contract call context for each address
    const balanceOfCall = addressesList.map((address) => {
        return { reference: "blanceOf: " + address, methodName: 'balanceOf', methodParameters: [address] }
    })
    return {
        reference: gauge,
        contractAddress: gauge,
        abi: BaseReward,
        calls: [
            // Call for Gauge Name
            { reference: 'name', methodName: 'name' },
            // Cal for Total Supply
            { reference: 'totalSupply', methodName: 'totalSupply' },
            // Call for user balances
            ...balanceOfCall,
        ]
    }
}
);

// Execute the multicall
const results = await multicall.call(contractCallContext);

// Remove useless words from the Gauge name 
let wordsToRemove = ["Gauge", "Deposit"];

// Function to remove words from a string
function removeWords(text) {
    let words = text.split(" ");
    let newWords = words.filter(word => !wordsToRemove.includes(word));
    let newText = newWords.join(" ");
    return newText;

}

// Create an empyt object with the results
let objectResults = {};

// Loop through the results and add them to the object
Object.keys(results.results).forEach((key) => {
    // cache result
    let result = results.results[key];
    // cache name
    let name = result.callsReturnContext[0].returnValues[0];
    name = !!name?.length ? removeWords(name) : key;

    let totalSupply = parseFloat(utils.formatUnits(BigNumber.from(result.callsReturnContext[1].returnValues[0])));

    objectResults[name] = [];

    for (let i = 0; i < addressesList.length; i++) {
        const balanceOf = parseFloat(utils.formatUnits(BigNumber.from(result.callsReturnContext[i + 2].returnValues[0]), 18));

        const percentage = balanceOf * 100 / totalSupply;
        if (percentage === 0) {
            continue;
        }

        objectResults[name].push({
            address: addressesList[i],
            percentage,
        })
    }
});

// Write the object to a JSON file
fs.writeFile('data.json', JSON.stringify(objectResults), 'utf8', () => { });
