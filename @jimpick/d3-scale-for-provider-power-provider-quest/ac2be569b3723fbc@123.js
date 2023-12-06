import define1 from "./c4e4a355c53d2a1a@112.js";

function _1(md){return(
md`# D3 Scale for Provider Power [Provider.Quest]`
)}

async function _providers(){return(
(await fetch('https://gateway.pinata.cloud/ipfs/QmQ1nX8rDj17qvauk1paPqaoCgvcVZ8cryarfr3tr2XGwP/providers.json')).json()
)}

function _selectedProvider(Inputs,d3,providers){return(
Inputs.select(d3.shuffle(providers))
)}

function _provider(selectedProvider)
{
  // return 'f0688165'
  // return 'f02620'
  return selectedProvider
}


function _6(Inputs,transitionsPretty){return(
Inputs.table(transitionsPretty)
)}

function _dataUrl(provider)
{
  return `https://bafybeiay4ivzjx3uvk7cyx3mp3kvyjnb26xj33nza6bsw54rnhnbgm67ry.ipfs.dweb.link/${provider}.json`
  // return `https://gateway.pinata.cloud/ipfs/QmQ1nX8rDj17qvauk1paPqaoCgvcVZ8cryarfr3tr2XGwP/${provider}.json`
}


async function _powerData(dataUrl){return(
(await fetch(dataUrl)).json()
)}

function _powerDataWithDates(powerData,d3){return(
powerData.map(obj => ({ ...obj, date: d3.isoParse(obj.date) }))
)}

function _maxPower()
{
  return 166253442384265200 // f0688165
  // return powerDataWithDates[powerDataWithDates.length - 1].qualityAdjPower
}


function _powerScale(d3,maxPower){return(
d3.scalePow()
  .exponent(0.25)
  .domain([0, maxPower])
  .range([0, 15])
)}

function _logScale(d3,maxPower){return(
d3.scaleLog()
  .domain([32 * 1024 ** 3, maxPower])
  .range([0, 30])
)}

function _powerLevels(powerDataWithDates,powerScale){return(
powerDataWithDates.map(({ date, qualityAdjPower }) => ({ date, qualityAdjPower, level: Math.round(powerScale(qualityAdjPower)) }))
)}

function _transitions(powerLevels){return(
powerLevels.reduce((acc, record) => {
  const lastLevel = acc.length ? acc[acc.length - 1].level : -1
  const newAcc = [...acc]
  if (record.level > lastLevel) newAcc.push(record)
  return newAcc
}, [])
)}

function _transitionsPretty(transitions,bytes){return(
transitions.map(({ date, qualityAdjPower, level }) => ({ date, level, qualityAdjPower: bytes(qualityAdjPower, { mode: 'binary' }) }))
)}

function _16(md){return(
md`## Imports`
)}

async function _bytes(){return(
(await import('https://unpkg.com/@jimpick/bytes-iec@3.1.0-2?module')).default
)}

function _18(md){return(
md`## Backups`
)}

function _20(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("providers")).define("providers", _providers);
  main.variable(observer("viewof selectedProvider")).define("viewof selectedProvider", ["Inputs","d3","providers"], _selectedProvider);
  main.variable(observer("selectedProvider")).define("selectedProvider", ["Generators", "viewof selectedProvider"], (G, _) => G.input(_));
  main.variable(observer("provider")).define("provider", ["selectedProvider"], _provider);
  main.variable(observer()).define(["Inputs","transitionsPretty"], _6);
  main.variable(observer("dataUrl")).define("dataUrl", ["provider"], _dataUrl);
  main.variable(observer("powerData")).define("powerData", ["dataUrl"], _powerData);
  main.variable(observer("powerDataWithDates")).define("powerDataWithDates", ["powerData","d3"], _powerDataWithDates);
  main.variable(observer("maxPower")).define("maxPower", _maxPower);
  main.variable(observer("powerScale")).define("powerScale", ["d3","maxPower"], _powerScale);
  main.variable(observer("logScale")).define("logScale", ["d3","maxPower"], _logScale);
  main.variable(observer("powerLevels")).define("powerLevels", ["powerDataWithDates","powerScale"], _powerLevels);
  main.variable(observer("transitions")).define("transitions", ["powerLevels"], _transitions);
  main.variable(observer("transitionsPretty")).define("transitionsPretty", ["transitions","bytes"], _transitionsPretty);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.variable(observer()).define(["md"], _18);
  const child1 = runtime.module(define1);
  main.import("backups", child1);
  main.import("backupNowButton", child1);
  main.variable(observer()).define(["backups"], _20);
  return main;
}
