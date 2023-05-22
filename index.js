// Import needed libraries
import fs from 'fs';
import { ethers, utils, BigNumber } from 'ethers';
import { Multicall } from 'ethereum-multicall';
import BaseReward from "./abi/BaseReward.json" assert { type: "json" };
import Booster from "./abi/Booster.json" assert { type: "json" };


// Add all the needed gauges here
const gaugeList = [
    "0x27Fd581E9D0b2690C2f808cd40f7fe667714b575",
    "0x87012b0C3257423fD74a5986F81a0f1954C17a1d",
    "0xD973e86547e810117Db131B94708F429A463535E",
    "0x2fC4506354166e8B9183FBB6A68cd9C5F3Fb9Bc5",
    "0x0312AA8D0BA4a1969Fddb382235870bF55f7f242",
    "0x3F29e69955E5202759208DD0C5E0BA55ff934814",
    "0x183D73dA7adC5011EC3C46e33BB50271e59EC976",
    "0x7Fc115BF013844D6eF988837F7ae6398af153532",
    "0x47c56A900295df5224EC5e6751dC31eb900321D5",
    "0x2e79D6f631177F8E7f08Fbd5110e893e1b1D790A",
    "0x63E3951212cCCAFE3eDC7588FD4D20Ee5e7Ad73f",
    "0xE5f24cD43f77fadF4dB33Dab44EB25774159AC66",
    "0x78a54C8F4eAba82e45cBC20B9454a83CB296e09E",
    "0x57AB3b673878C3fEaB7f8FF434C40Ab004408c4c",
    "0x7C777eEA1dC264e71E567Fcc9B6DdaA9064Eff51",
    "0x46804462f147fF96e9CAFB20cA35A3B2600656DF",
    "0x107A2209883621aFe2968da31C03190e0B2782C2",
    "0x5f2c3422a675860f0e019Ddd78C6fA681bE84bd4",
    "0x190AE1f6EE5c0B7bc193fA9CD9bBe9b335F69C65",
    "0x81C452E84B103555C2Dd2DEc0bFABC0c4d6B3065",
    "0x2C2179abce3413E27BDA6917f60ae37F96D01826",
    "0x4dC35eC8562596ddA6aEe8EceE59a76D4d72b83E",
    "0x75cAceBb5b4a73a530EdcdFdE7cFfbfea44c026E",
    "0x454eb2f12242397688DbfdA241487e67ed80507a",
    "0x4532fBa326D853A03644758B8B7438374F6780dC",
    "0xF17F1E67bc384E43b4acf69cc032AD086f15f262",
    "0x36365dA262dB3965Ba2E1C4411409Bf22508e0A1",
    "0xCd8bB8cEBc794842967849255C234e7b7619A518",
    "0xD9cde95eFeD2d426F2741E2c44De9573116B8F07",
    "0x275dF57d2B23d53e20322b4bb71Bf1dCb21D0A00",
    "0xAf3c3dab54ca15068D09C67D128344916e177cA9",
    "0xf7B0751Fea697cf1A541A5f57D11058a8fB794ee",
    "0x95201B61EF19C867dA0D093DF20021e1a559452c",
    "0x1249c510e066731FF14422500466A7102603da9e",
    "0x39a9E78c3b9b5B47f1f6632BD74890E2430215Cf",
    "0x37eCa8DaaB052E722e3bf8ca861aa4e1C047143b",
    "0x6661136537dfDCA26EEA05c8500502d7D5796E5E",
    "0xc85d90dec1E12eDee418C445b381E7168EB380Ab",
    "0x605eA53472A496c3d483869Fe8F355c12E861e19",
    "0x9AB7B0C7b154f626451c9e8a68dC04f58fb6e5Ce",
    "0x777C45BD0a2AF1dA5fe4a532AD6B207D3CEd8b2d",
    "0x4E3c048BE671852277Ad6ce29Fd5207aA12fabff",
    "0x5F4d57fd9Ca75625e4B7520c71c02948A48595d0",
    "0x4ca6AC0509E6381Ca7CD872a6cdC0Fbf00600Fa1",
    "0xCB664132622f29943f67FA56CCfD1e24CC8B4995",
    "0x942CB1Ed80D3FF8028B3DD726e0E2A9671bc6202",
    "0x21D8dB8a46393FEdE4e91eAfBc0cCf092faCb469",
    "0x5aF3B93Fb82ab8691b82a09CBBae7b8D3eB5Ac11",
    "0x01A9502C11f411b494c62746D37e89d6f7078657",
    "0x79eF6103A513951a3b25743DB509E267685726B7",
    "0xDc2Df969EE5E66236B950F5c4c5f8aBe62035df2",
    "0x10a361766e64D7983a97202ac3a0F4cee06Eb717",
    "0xcD4722B7c24C29e0413BDCd9e51404B4539D14aE",
    "0x8a88C1f44854C61a466aB55614F6A7778473418b",
    "0x2D42910D826e5500579D121596E98A6eb33C0a1b",
    "0xe9866B9dc2c1213433f614CbB22EdAA0FAFF9a66",
    "0x0052688295413b32626D226a205b95cDB337DE86",
    "0x19A13793af96f534F0027b4b6a3eB699647368e7",
    "0x33BcAa8A390e6DcF2f18AE5fDd9e38fD248219eB",
    "0x254f3a52Ba9e0cac4E32B648d129529622D1A46c",
    "0xFd29298041eA355cF7e15652689F2865443C3144",
    "0x29C6361Af40fc1B6585ce0885319511dF4450a8E",
    "0xE629c43BCad1029E12ED51432B9dd3432b656cc9",
    "0x70c6A653e273523FADfB4dF99558737906c230c6",
    "0xFc4541437265945F13368F9F61c19dA427D41A02",
    "0xBC02eF87f4E15EF78A571f3B2aDcC726Fee70d8b",
    "0xDD4Db3ff8A37FE418dB6FF34fC316655528B6bbC",
    "0x91A75880b07d36672f5C8DFE0F2334f086e29D47",
    "0xE879f17910E77c01952b97E4A098B0ED15B6295c",
    "0xC764B55852F8849Ae69923e45ce077A576bF9a8d",
    "0x09AFEc27F5A6201617aAd014CeEa8deb572B0608",
    "0x11Ff498C7c2A29fc4638BF45D9fF995C3297fcA5",
    "0x5612876e6F6cA370d93873FE28c874e89E741fB9",
    "0xe2b680A8d02fbf48C7D9465398C4225d7b7A7f87",
    "0xc2D343E2C9498E905F53C818B88eB8064B42D036",
    "0xd1c070eBc7Ec77f2134b3Ef75283b6C1fb31a157",
    "0x5f838591A5A8048F0E4C4c7fCca8fD9A25BF0590",
    "0xA2a9Ebd6f4dEA4802083F2C8D08066A4e695e64B",
    "0xB5bd58C733948e3d65d86BA9604e06e5dA276FD1",
    "0x8C83370552e6418242594f997306584eABEdef79"
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

const BOOSTER = "0xA57b8d98dAE62B26Ec3bcC4a365338157060B234";
const poolLengthCall = await multicall.call([{
    reference: BOOSTER,
    contractAddress: BOOSTER,
    abi: Booster,
    calls: [
        // Call for Gauge Name
        { reference: 'poolLength', methodName: 'poolLength' },
    ]
}]);

const poolLength = BigNumber.from(poolLengthCall.results[BOOSTER].callsReturnContext[0].returnValues[0]).toNumber();

const poolInfosCall = [];
for (let i = 0; i < poolLength; i++) {
    poolInfosCall.push({
        reference: BOOSTER + i,
        contractAddress: BOOSTER,
        abi: Booster,
        calls: [
            { reference: 'poolInfo', methodName: 'poolInfo', methodParameters: [i] },
        ]
    });
}

const poolInfos = await multicall.call(poolInfosCall);

const mapGaugeCrvRewards = {};
const mapCrvRewardsGauge = {};

for (let i = 0; i < poolLength; i++) {
    const data = poolInfos.results[BOOSTER + i].callsReturnContext[0];
    mapGaugeCrvRewards[data.returnValues[2].toLowerCase()] = data.returnValues[3];
    mapCrvRewardsGauge[data.returnValues[3].toLowerCase()] = data.returnValues[2];
}

// Create a contract call context for each gauge
const contractCallContext = gaugeList.map((gauge) => {
    // Create a contract call context for each address
    const balanceOfCall = addressesList.map((address) => {
        return { reference: "blanceOf: " + address, methodName: 'balanceOf', methodParameters: [address] }
    })

    if (!mapGaugeCrvRewards[gauge.toLowerCase()]) {
        return null;
    }
    const realGauge = mapGaugeCrvRewards[gauge.toLowerCase()];
    return {
        reference: realGauge,
        contractAddress: realGauge,
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
).filter((a) => a !== null);

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
let objectResults = [];

// Loop through the results and add them to the object
Object.keys(results.results).forEach((key) => {
    // cache result
    let result = results.results[key];
    // cache name
    let name = result.callsReturnContext[0].returnValues[0];
    name = !!name?.length ? removeWords(name) : key;

    let totalSupply = parseFloat(utils.formatUnits(BigNumber.from(result.callsReturnContext[1].returnValues[0])));

    const data = [];

    for (let i = 0; i < addressesList.length; i++) {
        const balanceOf = parseFloat(utils.formatUnits(BigNumber.from(result.callsReturnContext[i + 2].returnValues[0]), 18));

        const percentage = balanceOf * 100 / (totalSupply === 0 ? 1 : totalSupply);

        data.push({
            userAddress: addressesList[i],
            percentage,
        });
    }

    objectResults.push({
        name,
        auraVaultAddress: key,
        gaugeAddress: mapCrvRewardsGauge[key.toLowerCase()] || key,
        data,
    });
});

// Write the object to a JSON file
fs.writeFile('data.json', JSON.stringify(objectResults), 'utf8', () => { });
