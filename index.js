// Import needed libraries
import fs from 'fs';
import { ethers } from 'ethers';
import { Multicall } from 'ethereum-multicall';
import gaugeAbi from "./abi/gauge.json" assert { type: "json" };

// Add all the needed gauges here
const gaugeList = [
    "0xDeFd8FdD20e0f34115C7018CCfb655796F6B2168",
    "0x60355587a8d4aa67c2e64060ab36e566b9bcc000"
]
////////////////////////////////////////////////////////////////
/// --- Nothing to change below this line!!
////////////////////////////////////////////////////////////////


// Create a provider for the Ethereum mainnet, using public Llama RPC node
let provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com");

// Convex veCRV Locker
const CONVEX = "0x989AEb4d175e16225E39E87d0D97A3360524AD80";
// StakeDAO veCRV Locker
const STAKEDAO = "0x52f541764E6e90eeBc5c21Ff570De0e2D63766B6";


// Create a new instance of the multicall object
const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

// Create a contract call context for each gauge
const contractCallContext = gaugeList.map((gauge) => {
    return {
        reference: gauge,
        contractAddress: gauge,
        abi: gaugeAbi,
        calls: [
            // Cal for Total Supply
            { reference: 'totalSupplyCall', methodName: 'totalSupply' },
            // Call for Convex veCRV Locker Balance
            { reference: 'balanceOfConvexCall', methodName: 'balanceOf', methodParameters: [CONVEX] },
            // Call for StakeDAO veCRV Locker Balance
            { reference: 'balanceOfStakeDAOCall', methodName: 'balanceOf', methodParameters: [STAKEDAO] },
            // Call for Working Supply
            { reference: 'workingSupplyCall', methodName: 'working_supply' },
            // Call for Gauge Name
            { reference: 'nameCall', methodName: 'name' }
        ]
    }
}
);

// Execute the multicall
const results = await multicall.call(contractCallContext);

// Remove useless words from the Gauge name 
let wordsToRemove = ["Curve.fi", "Gauge", "Deposit"];

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
    let result = results.results[key];
    objectResults[removeWords(result.callsReturnContext[4].returnValues[0])] = {
        totalSupply: parseFloat(ethers.utils.formatEther(result.callsReturnContext[0].returnValues[0])).toFixed(2),
        balanceOfConvex: parseFloat(ethers.utils.formatEther(result.callsReturnContext[1].returnValues[0])).toFixed(2),
        balanceOfStakeDAO: parseFloat(ethers.utils.formatEther(result.callsReturnContext[2].returnValues[0])).toFixed(2),
        workingSupply: parseFloat(ethers.utils.formatEther(result.callsReturnContext[3].returnValues[0])).toFixed(2),
        address: key
    }
});

// Write the object to a JSON file
fs.writeFile('data.json', JSON.stringify(objectResults), 'utf8', () => { });
