// Import needed libraries
import fs from 'fs';
import { ethers } from 'ethers';
import { Multicall } from 'ethereum-multicall';
import gaugeAbi from "./abi/gauge.json" assert { type: "json" };


// Add all the needed gauges here
const gaugeList = [
    "0xcB2c2AF6c3E88b4a89aa2aae1D7C8120EEe9Ad0e",
    "0x3FB2975E00B3dbB97E8315a5ACbFF6B38026FDf3",
    "0x57AB3b673878C3fEaB7f8FF434C40Ab004408c4c",
    "0xCB664132622f29943f67FA56CCfD1e24CC8B4995",
    "0x462253b8f74b72304c145db0e4eebd326b22ca39",
    "0xd662908ada2ea1916b3318327a97eb18ad588b5d",
    "0xb87ec044152c49e52f7c429b2b9dbacb7ea8fb15",
    "0xf9f46ef781b9c7b76e8b505226d5e0e0e7fe2f04",
    "0x1e212e054d74ed136256fc5a5dddb4867c6e003f",
    "0xf74175ace638e612a0a3b09e6be89795ff48e06d",
    "0xd5be6a05b45aed524730b6d1cc05f59b021f6c87",
    "0x415f30505368fa1db82feea02eb778be04e75907",
    "0x9582c4adacb3bce56fea3e590f05c3ca2fb9c477",
    "0x740ba8aa0052e07b925908b380248cb03f3de5cb",
    "0x03ffc218c7a9306d21193565cbdc4378952faa8c",
    "0x86f8d7ced9a8f5563c1198466968b02238e05917",
    "0xd6e48cc0597a1ee12a8beeb88e22bfdb81777164",
    "0x4c1227ecc3f99a3e510db26fba72f7a1cbf50586",
    "0x6339ef8df0c2d3d3e7ee697e241666a916b81587",
    "0x95285ea6ff14f80a2fd3989a6bab993bd6b5fa13",
    "0xce5f24b7a95e9cba7df4b54e911b4a3dc8cdaf6f",
    "0x555766f3da968ecbefa690ffd49a2ac02f47aa5f",
    "0xf2ddf89c04d702369ab9ef8399edb99a76e951ce",
    "0x55f9ba282c39793db29c68f8f113fc97d23a6445",
    "0x1879075f1c055564cb968905ac404a5a01a1699a",
    "0xfbb5b8f2f9b7a4d21ff44dc724c1fb7b531a6612",
    "0x4620d46b4db7fb04a01a75ffed228bc027c9a899",
    "0x48e4c7eba2e18c8771db2f4ba77e8ff6c3bd39a1",
    "0xccc69bdeea2143def4279676e5d80a33e58174a0",
    "0x455279344f84a496615dc0ffa0511d2e19ec19d8",
    "0x02246583870b36be0fef2819e1d3a771d6c07546",
    "0xdfc7adfa664b08767b735de28f9e84cd30492aee",
    "0x6f98da2d5098604239c07875c6b7fd583bc520b9",
    "0xda0dd1798be66e17d5ab1dc476302b56689c2db4",
    "0xd4b22fedca85e684919955061fdf353b9d38389b",
    "0xaeac6dcd12cc0be74c8f99efe4bb5205a1f9a608",
    "0xe786df7076afeecc3facd841ed4ad20d0f04cf19",
    "0xd10c17d82053dd0ab65851a9a93a0abe0c4f4794",
    "0x7ca5b0a2910b33e9759dc7ddb0413949071d7575",
    "0xbc89cd85491d81c6ad2954e6d0362ee29fca8f53",
    "0x18c45c10a0f41bc3ed8d6324c687335179a40b28",
    "0x9f57569eaa61d427deeebac8d9546a745160391c",
    "0xa6f106d5acfc6f7ac5d4ab84c3d7a8dae658345f",
    "0x06b30d5f2341c2fb3f6b48b109685997022bd272",
    "0x903da6213a5a12b61c821598154efad98c3b20e4",
    "0xfb18127c1471131468a1aad4785c19678e521d86",
    "0x266ce172a1180134cf6c7836c516bd6a58b1f619",
    "0x663fc22e92f26c377ddf3c859b560c4732ee639a",
    "0xeebc06d495c96e57542a6d829184a907a02ef602",
    "0x5980d25b4947594c26255c0bf301193ab64ba803",
    "0x834c459bf7d7a9209849bdcd2af84fee11e14dc5",
    "0x7970489a543fb237abab63d62524d8a5ce165b86",
    "0xaa386ef96a910ee2f9cbef7b139e99a88df3b2ba",
    "0xa47d0837f84fb2d1aa08077d10d10101316a959d",
    "0xc7a770de69479beeeef22b2c9851760bac3630da",
    "0xbfcf63294ad7105dea65aa58f8ae5be2d9d0952a",
    "0xa90996896660decc6e997655e065b23788857849",
    "0x8fa728f393588e8d8dd1ca397e9a710e53fa553a",
    "0xbe266d68ce3ddfab366bb866f4353b6fc42ba43c",
    "0xaea6c312f4b3e04d752946d329693f7293bc2e6d",
    "0xb81465ac19b9a57158a79754bdaa91c60fda91ff",
    "0x8c1dff7b6c20240c31f4f5bdfbc09ec6ff788d7a",
    "0x12dcd9e8d1577b5e4f066d8e7d404404ef045342",
    "0x6d10ed2cf043e6fcf51a0e7b4c2af3fa06695707",
    "0x72d36d0ead377425bd6db66fe334a42fdcebff28",
    "0x5ac6886edd18ed0ad01c0b0910660637c551fbd6",
    "0xad96e10123fa34a01cf2314c42d75150849c9295",
    "0x4767841d4cc3567a2a7a8f55e08b03a9deb0bfd5",
    "0x5a8fa46ebb404494d718786e55c4e043337b10bf",
    "0x2b917214c5d6f057fbdaf9a3aae201e9f484fdae",
    "0x2932a86df44fe8d2a706d8e9c5d51c24883423f5",
    "0x009acd89535dabc270c93f9b39d3232105fef453",
    "0xfa49b2a5d9e77f6748bf05801aa22356d514137b",
    "0x6d3328f0333f6fb0b2fac87cf5a0ffa7e77beb60",
    "0xe5d5aa1bbe72f68df42432813485ca1fc998de32",
    "0x46521db0d31a62a2cbf8d1a7cdc6bbbbc441a1fc",
    "0xc25836ad05f14b7161638edc67fd9c65b19f0c5a",
    "0x941c2acdb6b85574ffc44419c2aa237a9e67be03",
    "0x4fb13b55d6535584841dbbdb14edc0258f7ac414",
    "0x3ee0bd06d004c25273339c5ad91e1443523dc2df",
    "0x9d4d981d8a9066f5db8532a5816543de8819d4a8",
    "0x824f13f1a2f29cfeea81154b46c0fc820677a637",
    "0x60355587a8d4aa67c2e64060ab36e566b9bcc000",
    "0x3c0ffff15ea30c35d7a85b85c0782d6c94e1d238",
    "0x182b723a58739a9c974cfdb385ceadb237453c28",
    "0xa0c08c0aede65a0306f7dd042d2560da174c91fc",
    "0x05255c5bd33672b9fea4129c13274d1e6193312d",
    "0xd9277b0d007464eff133622ec0d42081c93cef02",
    "0x4329c8f09725c0e3b6884c1dab1771bce17934f9",
    "0x90bb609649e0451e5ad952683d64bd2d1f245840",
    "0x4fd86ce7ecea88f7e0aa78dc12625996fb3a04bc",
    "0xe8060ad8971450e624d5289a10017dd30f5da85f",
    "0x8605dc0c339a2e7e85eea043bd29d42da2c6d784",
    "0xdc69d4cb5b86388fff0b51885677e258883534ae",
    "0x66915f81deafcfba171aeaa914c76a607437dd4a",
    "0x72e158d38dbd50a483501c24f792bdaaa3e7d55c",
    "0x16c2bee6f55dab7f494dba643ff52ef2d47fba36",
    "0xdb7cbbb1d5d5124f86e92001c9dfdc068c05801d",
    "0xcfc25170633581bf896cb6cdee170e3e3aa59503",
    "0xfb860600f1be1f1c72a89b2ef5caf345aff7d39d",
    "0xc2075702490f0426e84e00d8b328119027813ac5",
    "0x0c26be8617d41c3e3d7faf045edf2abbd596a427",
    "0x15bb164f9827de760174d3d3dad6816ef50de13c",
    "0x279f11f8e2825dbe0b00f6776376601ac948d868",
    "0xc1c5b8aafe653592627b54b9527c7e98326e83ff",
    "0x319e268f0a4c85d404734ee7958857f5891506d7",
    "0xf7b9c402c4d6c2edba04a7a515b53d11b1e9b2cc",
    "0x1c77fb5486545810679d53e325d5bcf6c6a45081",
    "0x95069889df0bcdf15bc3182c1a4d6b20631f3b46",
    "0xa6ff75281eaca4cd5feeb333e8e15558208295e5",
    "0x15d380de3ccf0b42aa65b10b3aab73199799beb3",
    "0xab1927160ec7414c6fa71763e2a9f3d107c126dd",
    "0xa9a9bc60fc80478059a83f516d5215185eec2fc0",
    "0x37efc3f05d659b30a83cf0b07522c9d08513ca9d",
    "0xc5cfada84e902ad92dd40194f0883ad49639b023",
    "0xda7f9dd286577cc338047b040c289463743a474e",
    "0x4c18e409dc8619bfb6a1cb56d114c3f592e0ae79",
    "0x2db0e83599a91b508ac268a6197b8b14f5e72840",
    "0x05ca5c01629a8e5845f12ea3a03ff7331932233a",
    "0x1779aeb087c5bdbe48749ab03575f5f25d1deeaf",
    "0x2fa53e8fa5fadb81f4332c8ece39fe62ea2f919e",
    "0x36c66bc294fef4e94b3e40a1801d0ab0085fe96e",
    "0x38039dd47636154273b287f74c432cac83da97e2",
    "0x99fb76f75501039089aac8f20f487bf84e51d76f",
    "0xe1d520b1263d6be5678568bd699c84f7f9086023",
    "0x63d9f3ab7d0c528797a12a0684e50c397e9e79dc",
    "0x1ba86c33509013c937344f6e231da2e63ea45197",
    "0xeff437a56a22d7dd86c1202a308536ed8c7da7c1",
    "0x3a748a2f4765bdfb119cb7143b884db7594a68c3",
    "0x1750a3a3d80a3f5333bbe9c4695b0fad41061ab1",
    "0xb6d7c2bda5a907832d4556ae5f7ba800ff084c2a",
    "0xf5194c3325202f456c95c1cf0ca36f8475c1949f",
    "0x762648808ef8b25c6d92270b1c84ec97df3bed6b",
    "0xfd4d8a17df4c27c1dd245d153ccf4499e806c87d",
    "0x9b8519a9a00100720ccdc8a120fbed319ca47a14",
    "0x389fc079a15354e9cbce8258433cc0f85b755a42",
    "0xb3783f527b7704deed4993f7c1c779e426a04368",
    "0xd8b712d29381748db89c36bca0138d7c75866ddf",
    "0x4792b8845e4d7e18e104b535d81b6904d72915a4",
    "0xb518f5e3242393d4ec792bd3f44946a3b98d0e48",
    "0xb7a3c519889a916c5ecb54101e69ecf11de60d0b",
    "0xd5f2e6612e41be48461fdba20061e3c778fe6ec4",
    "0x0a13654e7846fbbd6fbc9f409aa453739bbadb74",
    "0x5f626c30ec1215f4edcc9982265e8b1f411d1352",
    "0x11137b10c210b579405c21a07489e28f3c040ab1",
    "0x98ff4ee7524c501f582c48b828277d2b42bbc894",
    "0x8df6fdae05c9405853dd4cf2809d5dc2b5e77b0c",
    "0x06f691180f643b35e3644a2296a4097e1f577d0d",
    "0x15f52286c0ff1d7a7ddbc9e300dd66628d46d4e6",
    "0xcb8883d1d8c560003489df43b30612aabb8013bb",
    "0x4b960396011a914b4cccc3b33dfee83a97a9d766",
    "0x2eb49a3eff789d7b2286bf17667acbf12d882c17",
    "0x172a5af37f69c69cc59e748d090a70615830a5dd",
    "0xc5ae4b5f86332e70f3205a8151ee9ed9f71e0797",
    "0x25f0ce4e2f8dba112d9b115710ac297f816087cd",
    "0xc3e9c79681c0c23d5a9a5a732daa52ebe7dff714",
    "0xb5efa93d5d23642f970af41a1ea9a26f19cbd2eb",
    "0xd7d147c6bb90a718c3de8c0568f9b560c79fa416",
    "0x65415bd1f00656c5a84f445278cd195426de66d5",
    "0x6aba93e10147f86744bb9a50238d25f49ed4f342",
    "0x681ee77c66c43b80298c6cc5a1611e69293dab81",
    "0xbb1b19495b8fe7c402427479b9ac14886cbbaaee",
    "0xd1426c391a7cbe9decd302ac9c44e65c3505d1f0",
    "0x20759f567bb3ecdb55c817c9a1d13076ab215edc",
    "0x82edd50a204d86d90def4dedc4671e9a21145d5e",
    "0x40371aad2a24ed841316ef30938881440fd4426c",
    "0x18006c6a7955bf6db72de34089b975f733601660",
    "0x8b397084699cc64e429f610f81fac13bf061ef55",
    "0x0e2f214b8f5d0cca011a8298bb907fb62f535160",
    "0xda690c2ea49a058a9966c69f46a05bfc225939f4",
    "0x875ce7e0565b4c8852ca2a9608f27b7213a90786",
    "0x89664d561e79ca22fd2ea4076b3e5def0b219c15",
    "0xcb7ceb005dce5743026cddad2364d74f594b95a4",
    "0x28216318d85b2d6d8c2cb38eed08001d9348803b",
    "0xb07d00e0ee9b1b2eb9f1b483924155af7af0c8fa",
    "0x66ec719045bbd62db5ebb11184c18237d3cc2e62",
    "0xb1f2cdec61db658f091671f5f199635aef202cac",
    "0x705350c4bcd35c9441419ddd5d2f097d7a55410f",
    "0xf20bd4d5a4112d5f9c64adf53726f3ef1b7d0d61",
    "0x8ad7e0e6edc61bc48ca0dd07f9021c249044ed30",
    "0xcf79921d99b99fee3dcf1a4657fcda95195b46d1",
    "0x4dc4a289a8e33600d8bd4cf5f6313e43a37adec7",
    "0x805aef679b1379ee1d24c52158e7f56098d199d9",
    "0x77ef5d544ff6c739e7e10a549f64dd08055538d1",
    "0xecb860e54e33fea8fab5b076734e2591d1a9eba4",
    "0x784342e983e9283a7108f20fca21995534b3fe65",
    "0x4b6911e1ae9519640d417ace509b9928d2f8377b",
    "0x821529bb07c83803c9cc7763e5974386e9efedc7",
    "0x8133e6b0b2420bba10574a6668ea275f5e7ed253",
    "0x95d16646311fde101eb9f897fe06ac881b7db802",
    "0xf6d7087d4ae4dcf85956d743406e63cda74d99ad",
    "0x0ec3d1f5d737593ff4aedb8e22eb33a1886ddb9a",
    "0x29284d30bcb70e86a6c3f84cbc4de0ce16b0f1ca",
    "0x6828bcf74279ee32f2723ec536c22c51eed383c6",
    "0xacc9f5cedc631180a2ad4c945377930fcfcc782f",
    "0x359fd5d6417ae3d8d6497d9b2e7a890798262ba4",
    "0xf865fdd6a5f307f398a94dc40687995cfaa77bc9",
    "0x65ca7dc5cb661fc58de57b1e1af404649a27ad35",
    "0x9f330db38caaae5b61b410e2f0aad63fff2109d8",
    "0x34883134a39b206a451c2d3b0e7cac44be4d9181",
    "0xd5d3efc90ffb38987005fdea303b68306aa5c624",
    "0xb8b9dfcb48614fa873ccec72c79d728d39ec9a5c",
    "0xc2b1df84112619d190193e48148000e3990bf627",
    "0x9af13a7b1f1bbf1a2b05c6fbf23ac23a9e573b4e",
    "0xf98450b5602fa59cc66e1379dffb6fddc724cfc4",
    "0xc95bdf13a08a547e4dd9f29b00ab7ff08c5d093d",
    "0x055be5ddb7a925bfef3417fc157f53ca77ca7222",
    "0x6955a55416a06839309018a8b0cb72c4ddc11f15",
    "0xdefd8fdd20e0f34115c7018ccfb655796f6b2168",
    "0xb0f5d00e5916c8b8981e99191a1458704b587b2b",
    "0x3b7020743bc2a4ca9eaf9d0722d42e20d6935855",
    "0x1cb6134a152c8c61016c4691a31137f23b66f770",
    "0xbdca4f610e7101cc172e2135ba025737b99abd30",
    "0x6d787113f23bed1d5e1530402b3f364d0a6e5af3",
    "0x1cebdb0856dd985fae9b8fea2262469360b8a3a6",
    "0x7e1444ba99dcdffe8fbdb42c02f0005d14f13be1",
    "0x08380a4999be1a958e2abba07968d703c7a3027c",
    "0xf668e6d326945d499e5b35e7cd2e82acfbcfe6f0",
    "0x6070fbd4e608ee5391189e7205d70cc4a274c017",
    "0x346c7bb1a7a6a30c8e81c14e90fc2f0fbddc54d8",
    "0xa8ea11465a1375bf42463c3b613dfc54248b9c7b",
    "0x1b3e14157ed33f60668f2103bcd5db39a1573e5b",
    "0xb721cc32160ab0da2614cc6ab16ed822aeebc101",
    "0x8f162742a7bcdb87eb52d83c687e43356055a68b",
    "0x64e3c23bfc40722d3b649844055f1d51c1ac041d",
    "0x69fb7c45726cfe2badee8317005d3f94be838840",
    "0xfa712ee4788c042e2b7bb55e6cb8ec569c4530c1",
    "0x6a69ffd1353fa129f7f9932bb68fa7be88f3888a"
]

// Users addresses (can be used for lockers too)
const addressesList = [
    "0x989AEb4d175e16225E39E87d0D97A3360524AD80",
    "0x52f541764E6e90eeBc5c21Ff570De0e2D63766B6",
    "0x52f541764E6e90eeBc5c21Ff570De0e2D63766B6"
]

// Timestamp to use for calling the method "getCappedRelativeWeight" on the gauge
// Use 0 to get the current value, otherwise use a timestamp in the past
const timestamp = 0;

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
    const workingBalancefCall = addressesList.map((address) => {
        return { reference: "workingBlances: " + address, methodName: 'working_balances', methodParameters: [address] }
    })
    let ts = timestamp == 0 ? Math.floor(Date.now() / 1000) : timestamp;
    return {
        reference: gauge,
        contractAddress: gauge,
        abi: gaugeAbi,
        calls: [
            // Call for Gauge Name
            { reference: 'name', methodName: 'name' },
            // Cal for Total Supply
            { reference: 'totalSupply', methodName: 'totalSupply' },
            // Call for Working Supply
            { reference: 'workingSupply', methodName: 'working_supply' },
            // 
            { reference: 'getCappedRelativeWeight', methodName: 'getCappedRelativeWeight', methodParameters: [ts] },
            // Call for user balances
            ...balanceOfCall,
            // Call for user working balances
            ...workingBalancefCall
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

// Function to format the results
function format(value, method) {
    switch (value.type) {
        case "BigNumber":
            if (method == "getCappedRelativeWeight") return parseFloat(ethers.utils.formatUnits(value, 0));
            else return parseFloat(ethers.utils.formatEther(value));
        default:
            return value;
    }
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

    // Initialize the object
    objectResults[name] = {};
    // Loop through the results and add them to the object
    result.callsReturnContext.forEach((call) => {
        objectResults[name][call.reference] = format(call.returnValues[0] || 0, call.methodName);
    });
    objectResults[name].address = key;

});

// Write the object to a JSON file
fs.writeFile('data.json', JSON.stringify(objectResults), 'utf8', () => { });
