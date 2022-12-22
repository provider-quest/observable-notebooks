import define1 from "./5cf93b57a7444002@282.js";
import define2 from "./a957eb792b00ff81@406.js";
import define3 from "./c4e4a355c53d2a1a@111.js";
import define4 from "./450051d7f1174df8@254.js";
import define5 from "./a7998f028cfdb429@175.js";

function _1(md){return(
md`# Zoomable Sunburst [Provider.Quest]`
)}

function _2(md,quickMenu){return(
md`${quickMenu}`
)}

function _3(md){return(
md`Based on [@d3/zoomable-sunburst](https://observablehq.com/@d3/zoomable-sunburst). Click on an arc to "zoom in". Click in the middle to "zoom out".`
)}

function _dataSource(Inputs,defaultDataSource){return(
Inputs.radio([
  "Quality Adjusted Power",
  "Provider Count",
  "28-Day Published Deals: Count*",
  "28-Day Published Deals: Data Size",
  "28-Day Published Deals: Lifetime Value",
  "7-Day Published Deals: Count*",
  "7-Day Published Deals: Data Size",
  "7-Day Published Deals: Lifetime Value",
  "1-Day Published Deals: Count*",
  "1-Day Published Deals: Data Size",
  "1-Day Published Deals: Lifetime Value"
], {label: "Data Source:", value: defaultDataSource})
)}

function _options(Inputs,defaultHideNoRegion,defaultUseSyntheticRegions){return(
Inputs.checkbox(
  ['Hide "No Region"', 'Use Synthetic Regions'],
  {
    label: "Options:",
    value: [
      defaultHideNoRegion ? 'Hide "No Region"' : null,
      defaultUseSyntheticRegions ? 'Use Synthetic Regions' : null
    ]
  }
)
)}

function _6(md){return(
md`**Note:** * As some providers are geo-located into multiple regions, these numbers may be overestimates due to double counts. In the future, we will perform some extra queries for accurate aggregated stats.`
)}

function _sliderRaw(Scrubber,d3,numberOfDays,defaultDateIndex){return(
Scrubber(d3.range(numberOfDays + 1), {
  delay: 1000,
  loop: false,
  autoplay: false,
  initial: defaultDateIndex
})
)}

function _slider(html,$0,debounce,Event)
{
  const element = html`0.9s slider debounce delay`
  element.value = $0.value
  const debounced = debounce($0, 900)
  async function run () {
    for await (const value of debounced) {
      element.value = value
      element.dispatchEvent(new Event("input", {bubbles: true}))
    }
  }
  run()
  return element
}


function _9(dateFns,timeScale,slider,md,dateToEpoch,permalink)
{
  const selectedDate = dateFns.roundToNearestMinutes(timeScale.invert(slider), { nearestTo: 30 })
  return md`Showing data for ${selectedDate.toISOString().substr(0, 10)} (Epoch ${dateToEpoch(selectedDate)}). ${permalink}`
}


function _chart(dateFns,timeScale,$0,partition,data,d3,width,color,arc,radius,$1,dataSource,bytes)
{
  const selectedDate = dateFns.roundToNearestMinutes(timeScale.invert($0.value), { nearestTo: 30 });
  let root = partition(data, selectedDate);
  let clickedArc = root;

  root.each(d => d.current = d);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "10px sans-serif");

  const node = svg.node();
  
  const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

  const path = g.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr("d", d => arc(d.current))
      .attr("data-code", d => getCode(d));

  path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

  path.append("title")
      .text(getTitle);

  const label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name);

  const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

  const parentLabel = g.append("g")
      .attr("id", "parentLabel")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .attr("dy", "0.35em")

  drawParentLabel(root)

  function drawParentLabel(d) {
    const group = g.select("#parentLabel")
      .selectAll("g")
      .data(d.descendants().slice(0,1), d => d.data.longCode)
      .join("g");
    group.append("text")
      .text(d.data.name === 'root' ? 'Entire network' : d.data.name);
    group.append("text")
      .attr("y", "15")
      .text(getFormattedValue(d));
  }

  function clicked(_, p) {
    parent.datum(p.parent || root);
    drawParentLabel(p);
      
    $1.value = getCode(p);
    $1.dispatchEvent(new CustomEvent("input"));
    clickedArc = p;

    root.each(d => d.target = {
      x0: Math.max(0, p.x0 !== p.x1 ? Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0)) : 1) * 2 * Math.PI,
      x1: Math.max(0, p.x0 !== p.x1 ? Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0)) : 1) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
      .filter(function(d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attrTween("d", d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));
  }
  
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    if (isNaN(x)) {
      console.error('Jim isNaN', x, d.x0, d.x1, d)
    }
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  function getTitle(d) {
    return `${getCode(d)}\n${getFormattedValue(d)}`;
  }

  function getFormattedValue(d) {
    if (dataSource === 'Quality Adjusted Power' || (dataSource && dataSource.match(/Data Size/))) {
      return bytes(d.value, { mode: 'binary' })
    } else if (dataSource && dataSource.match(/Lifetime Value/)) {
      return d3.format(",.2f")(d.value) + ' FIL';
    } else {
      return d3.format(",d")(d.value);
    }    
  }

  function getCode(d) {
    const ancestors = d.ancestors();
    return ancestors.slice(0, ancestors.length - 1).map(d => d.data.code).reverse().join("-");
  }

  if ($1.value) {
    setTimeout(() => {
      const focus = d3.select(`path[data-code="${$1.value}"]`);
      if (focus) {
        clicked(null, focus.datum());
      }
    }, 500);
  }

  return Object.assign(node, {
    update(sliderValue) {
      const selectedDate = dateFns.roundToNearestMinutes(timeScale.invert(sliderValue), { nearestTo: 30 });
      const newRoot = partition(data, selectedDate);

      const newValues = new Map();
      const newSizes = new Map();
      const clickedArcAncestors = clickedArc.ancestors();
      const clickedArcKey = clickedArcAncestors
        .slice(0, clickedArcAncestors.length - 1).map(d => d.data.code).reverse().join("-");
      newRoot.each(d => {
        if (d.data && d.data.longCode) {
          newValues.set(d.data.longCode, d.value);
          newSizes.set(d.data.longCode, {
            x0: d.x0,
            x1: d.x1,
            y0: d.y0,
            y1: d.y1
          });
        }
      });
      root.each(d => {
        if (d.data && d.data.longCode) {
          const newValue = newValues.get(d.data.longCode);
          if (newValue !== null) {
            d.value = newValue;
          }
          const newSize = newSizes.get(d.data.longCode);
          if (newSize) {
            if (!clickedArcKey) {
              d.target = newSize;
            } else {
              const clickedSize = newSizes.get(clickedArcKey);
              d.target = {
                x0: Math.max(0, clickedSize.x0 !== clickedSize.x1 ? Math.min(1, (newSize.x0 - clickedSize.x0) / (clickedSize.x1 - clickedSize.x0)) : 1) * 2 * Math.PI,
                x1: Math.max(0, clickedSize.x0 !== clickedSize.x1 ? Math.min(1, (newSize.x1 - clickedSize.x0) / (clickedSize.x1 - clickedSize.x0)) : 1) * 2 * Math.PI,
                y0: Math.max(0, newSize.y0 - clickedArc.depth),
                y1: Math.max(0, newSize.y1 - clickedArc.depth)
              };
            }
          }
        }
      });

      const t = g.transition().duration(400);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          })
          .filter(function(d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          })
          .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
          .attrTween("d", d => () => arc(d.current));

      path.selectAll("title").remove();
      path.append("title").text(getTitle);

      parent.transition(t)
          .tween("data", d => {
            const i = d3.interpolate(d.current, d.target);
            return t => d.current = i(t);
          });
      
      label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
        .attr("fill-opacity", d => +labelVisible(d.target))
        .attrTween("transform", d => () => labelTransform(d.current));

      g.select("#parentLabel g").remove();
      drawParentLabel(clickedArc);
    }
  })
}


function _11(md){return(
md`## Raw Data for Selected Date and Data Source`
)}

function _12(md){return(
md`**Tip:** You can download the data as a CSV or a JSON file if you click on the "Kebab" (three dots) that appears if you hover to the left of the header column.`
)}

function _13(Inputs,selectedData){return(
Inputs.table(selectedData)
)}

function _14(chart,slider){return(
chart.update(slider)
)}

function _chartFocus(Inputs,defaultChartFocus){return(
Inputs.text({ value: defaultChartFocus })
)}

function _data(_,regionHierarchyReport,options)
{
  const data = _.cloneDeep(regionHierarchyReport.regionHierarchy)
  if (options.includes('Hide "No Region"')) {
    data.children = data.children.filter(({ code }) => code !== 'none')
  }
  return data
}


function _selectedDate(dateFns,timeScale,slider){return(
dateFns.roundToNearestMinutes(timeScale.invert(slider), { nearestTo: 30 })
)}

function _18(filteredRegionData,selectedDate){return(
filteredRegionData(selectedDate)
)}

function _19(filteredDailyDealsByRegion,selectedDate){return(
filteredDailyDealsByRegion(selectedDate)
)}

function _20(selectedDate){return(
selectedDate
)}

function _selectedData(partition,data,selectedDate)
{
  const selectedRows = []
  const partionedData = partition(data, selectedDate)
  partionedData.eachBefore(node => {
    selectedRows.push({
      longCode: node.data.longCode,
      name: node.data.name,
      value: node.value
    })
  })
  return selectedRows
}


function _partition(d3,filteredRegionData,filteredDailyDealsByRegion,dataSource){return(
(data, selectedDate) => {
  const root = d3.hierarchy(data)
      .each(node => {
        const codes = []
        for (const ancestor of node.ancestors()) {
          if (ancestor.data.code) {
            codes.unshift(ancestor.data.code)
          }
        }
        node.data.longCode = codes.length > 0 ? codes.join('-') : 'all'
      })
      // .sum(d => d.value)
      .sum(d => {
        if (!d.longCode) return 0
        const row = filteredRegionData(selectedDate).get(d.longCode)
        const dealsRow = filteredDailyDealsByRegion(selectedDate).get(d.longCode)
        if (dataSource === 'Quality Adjusted Power') {
          return row && row.qualityAdjPower
        } else if (dataSource === 'Provider Count') {
          return row && row.minerCount
        } else if (dataSource === '28-Day Published Deals: Count*') {
          return dealsRow && dealsRow.twentyEightDayDealCount
        } else if (dataSource === '28-Day Published Deals: Data Size') {
          return dealsRow && dealsRow.twentyEightDayDataSize
        } else if (dataSource === '28-Day Published Deals: Lifetime Value') {
          return dealsRow && dealsRow.twentyEightDayLifetimeValue
        } else if (dataSource === '7-Day Published Deals: Count*') {
          return dealsRow && dealsRow.sevenDayDealCount
        } else if (dataSource === '7-Day Published Deals: Data Size') {
          return dealsRow && dealsRow.sevenDayDataSize
        } else if (dataSource === '7-Day Published Deals: Lifetime Value') {
          return dealsRow && dealsRow.sevenDayLifetimeValue
        } else if (dataSource === '1-Day Published Deals: Count*') {
          return dealsRow && dealsRow.count
        } else if (dataSource === '1-Day Published Deals: Data Size') {
          return dealsRow && dealsRow['sum(pieceSizeDouble)']
        } else if (dataSource === '1-Day Published Deals: Lifetime Value') {
          return dealsRow && dealsRow['sum(lifetimeValue)']
        } else {
          return 1
        }
      })
      .sort((a, b) => b.value - a.value);
  const sizes = d3.partition()
      .size([2 * Math.PI, root.height + 1])
    (root);
  return sizes;
}
)}

function _color(d3,data){return(
d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))
)}

function _width(){return(
932
)}

function _radius(width){return(
width / 6
)}

function _arc(d3,radius){return(
d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1))
)}

function _27(md){return(
md`## Data`
)}

async function _regionHierarchyReport(geoIpLookupsBucketUrl){return(
(await fetch(`${geoIpLookupsBucketUrl}/region-hierarchy-latest.json`)).json()
)}

async function _minerPowerByRegionReport(useSyntheticRegions,minerPowerDailyAverageLatestBucketUrl)
{
  const file = useSyntheticRegions ? 'provider-power-by-synthetic-region' : 'miner-power-by-region'
  return (await fetch(`${minerPowerDailyAverageLatestBucketUrl}/${file}.json`)).json()
}


function _rows(minerPowerByRegionReport,d3){return(
minerPowerByRegionReport.rows.map(row => ({ ...row, date: d3.isoParse(row.date) }))
)}

function _33(md){return(
md`See: [@lorenries/encoding-a-date-range-onto-a-slider-with-d3](@https://observablehq.com/@lorenries/encoding-a-date-range-onto-a-slider-with-d3)`
)}

function _numberOfDays(d3,startDate,endDate){return(
d3.timeDay.count(startDate, endDate)
)}

function _timeScale(d3,startDate,endDate,numberOfDays){return(
d3.scaleUtc()
  .domain([startDate, endDate])
  .range([0, numberOfDays])
)}

function _36(startDate){return(
startDate.toISOString()
)}

function _37(endDate){return(
endDate.toISOString()
)}

function _filteredRows(rows,dateFns){return(
selectedDate => rows
  .filter(({ date }) => dateFns.isEqual(date, selectedDate))
  .map(row => ({
    region: row.region,
    minerCount: row['sum(splitCount)'],
    rawBytePower: row['sum(rawBytePower)'],
    rawBytePowerKiB: row['sum(rawBytePower)'] / 1024,
    rawBytePowerMiB: row['sum(rawBytePower)'] / 1024 ** 2,
    rawBytePowerGiB: row['sum(rawBytePower)'] / 1024 ** 3,
    rawBytePowerTiB: row['sum(rawBytePower)'] / 1024 ** 4,
    rawBytePowerPiB: row['sum(rawBytePower)'] / 1024 ** 5,
    rawBytePowerEiB: row['sum(rawBytePower)'] / 1024 ** 6,
    qualityAdjPower: row['sum(qualityAdjPower)'],
    qualityAdjPowerKiB: row['sum(qualityAdjPower)'] / 1024,
    qualityAdjPowerMiB: row['sum(qualityAdjPower)'] / 1024 ** 2,
    qualityAdjPowerGiB: row['sum(qualityAdjPower)'] / 1024 ** 3,
    qualityAdjPowerTiB: row['sum(qualityAdjPower)'] / 1024 ** 4,
    qualityAdjPowerPiB: row['sum(qualityAdjPower)'] / 1024 ** 5,
    qualityAdjPowerEiB: row['sum(qualityAdjPower)'] / 1024 ** 6,
  }))
)}

function _filteredRegionData(d3,filteredRows){return(
selectedDate => d3.index(filteredRows(selectedDate), d => d.region)
)}

async function _dailyDealsByRegion(useSyntheticRegions,dealsBucketUrl,d3)
{
  const file = useSyntheticRegions ? 'daily-deals-by-synthetic-region' : 'daily-deals-by-region'
  const deals = await (await fetch(`${dealsBucketUrl}/${file}.json`)).json()
  return deals.map(({ date, ...rest }) => ({ date: d3.isoParse(date), ...rest }))
}


function _44(dailyDealsByRegion){return(
JSON.stringify(dailyDealsByRegion[0])
)}

function _endDates(rows,minerPowerByRegionReport,dailyDealsByRegion){return(
[rows[minerPowerByRegionReport.rows.length - 1].date, dailyDealsByRegion[dailyDealsByRegion.length - 1].date]
)}

function _endDate(dateFns,endDates){return(
dateFns.min(endDates)
)}

function _dailyDealsByRegionIndexed(d3,dailyDealsByRegion){return(
d3.index(dailyDealsByRegion, d => d.region, d => d.date)
)}

function _dailyDealsByRegionWith7DaySums(d3,dailyDealsByRegion,agnosticAddDays,dailyDealsByRegionIndexed)
{
  const rows = []
  const [minDate, maxDate] = d3.extent(dailyDealsByRegion.map(d => d.date))
  for (let targetDate = minDate; targetDate <= maxDate; targetDate = agnosticAddDays(targetDate, 1)) {
    const sevenDayDateRange = d3.utcDay.range(
      agnosticAddDays(targetDate, -6),
      agnosticAddDays(targetDate, 1)
    )
    const twentyEightDayDateRange = d3.utcDay.range(
      agnosticAddDays(targetDate, -27),
      agnosticAddDays(targetDate, 1)
    )

    for (const region of dailyDealsByRegionIndexed.keys()) {
      let sevenDayDealCount = 0
      let sevenDayDataSize = 0
      let sevenDayLifetimeValue = 0
      let twentyEightDayDealCount = 0
      let twentyEightDayDataSize = 0
      let twentyEightDayLifetimeValue = 0
      const dateIndex = dailyDealsByRegionIndexed.get(region)
      const row = getRow(dateIndex, region, targetDate)
      for (const date of sevenDayDateRange) {
        const pastDateRow = getRow(dateIndex, region, date)
        sevenDayDealCount += pastDateRow.count
        sevenDayDataSize += pastDateRow['sum(pieceSizeDouble)']
        sevenDayLifetimeValue += pastDateRow['sum(lifetimeValue)']
      }
      for (const date of twentyEightDayDateRange) {
        const pastDateRow = getRow(dateIndex, region, date)
        twentyEightDayDealCount += pastDateRow.count
        twentyEightDayDataSize += pastDateRow['sum(pieceSizeDouble)']
        twentyEightDayLifetimeValue += pastDateRow['sum(lifetimeValue)']
      }
      rows.push({
        ...row,
        sevenDayDealCount,
        sevenDayDataSize,
        sevenDayLifetimeValue,
        twentyEightDayDealCount,
        twentyEightDayDataSize,
        twentyEightDayLifetimeValue
      })
    }
  }
  return rows

  function getRow (dateIndex, region, date) {
    if (dateIndex.get(date)) {
      return {
        count: 0,
        'sum(pieceSizeDouble)': 0,
        'sum(lifetimeValue)': 0,
        ...dateIndex.get(date)
      }
    } else {
      return {
        date,
        region,
        count: 0,
        'sum(pieceSizeDouble)': 0,
        'sum(lifetimeValue)': 0
      }
    }
  }
}


function _firstDateAfterGenesis(epochToDate){return(
epochToDate(240)
)}

function _startDate(dataSource,firstDateAfterGenesis,dailyDealsByRegion)
{
  if (dataSource === 'Quality Adjusted Power') return firstDateAfterGenesis
  if (dataSource === 'Provider Count') return firstDateAfterGenesis
  return dailyDealsByRegion[0].date
}


function _filteredDailyDealsByRegion(d3,dailyDealsByRegionWith7DaySums,dateFns){return(
selectedDate => d3.index(dailyDealsByRegionWith7DaySums.filter(({ date }) => dateFns.isEqual(date, selectedDate)), d => d.region)
)}

function _52(md){return(
md`## Imports`
)}

function _d3(require){return(
require("d3@6")
)}

async function _bytes(){return(
(await import('https://unpkg.com/@jimpick/bytes-iec@3.1.0-2?module')).default
)}

function _dateFns(require){return(
require('https://bundle.run/date-fns@2.22.1')
)}

function _61(md){return(
md`## Permalink support`
)}

function _params(URLSearchParams,location){return(
[...(new URLSearchParams(location.search.substring(1))).entries()].reduce((acc, [key, value]) => ({ [key]: value, ...acc }), {})
)}

function _defaultDataSource(params){return(
(params.datasource && params.datasource.replace('Deals: Count', 'Deals: Count*')) || 'Quality Adjusted Power'
)}

function _defaultHideNoRegion(params){return(
'hidenoregion' in params
)}

function _65(params){return(
params
)}

function _defaultDateIndex(params,agnosticDifferenceInDays,d3,startDate,numberOfDays){return(
params.date ? agnosticDifferenceInDays(d3.isoParse(params.date), startDate) : numberOfDays
)}

function _67(startDate){return(
startDate
)}

function _defaultChartFocus(params){return(
params.chartfocus
)}

function _defaultUseSyntheticRegions(params){return(
params.synthetic != undefined ? (params.synthetic == 'true') : true
)}

function _useSyntheticRegions(options){return(
options.includes('Use Synthetic Regions')
)}

function _permalink(dateFns,timeScale,slider,dataSource,chartFocus,useSyntheticRegions,options)
{
  const selectedDate = dateFns.roundToNearestMinutes(timeScale.invert(slider), { nearestTo: 30 })
  let url = `${document.baseURI.replace(/\?.*/,'')}?` +   
    `datasource=${encodeURIComponent(dataSource.replace('*', ''))}&` +
    `date=${selectedDate.toISOString().substr(0, 10)}&` +
    `chartfocus=${chartFocus}&` +
    `synthetic=${useSyntheticRegions}`
  if (options.includes('Hide "No Region"')) {
    url += '&hidenoregion'
  }
  return `[Permalink](${url})`
}


function _72(md){return(
md`## Backups`
)}

function _74(backups){return(
backups()
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md","quickMenu"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer("viewof dataSource")).define("viewof dataSource", ["Inputs","defaultDataSource"], _dataSource);
  main.variable(observer("dataSource")).define("dataSource", ["Generators", "viewof dataSource"], (G, _) => G.input(_));
  main.variable(observer("viewof options")).define("viewof options", ["Inputs","defaultHideNoRegion","defaultUseSyntheticRegions"], _options);
  main.variable(observer("options")).define("options", ["Generators", "viewof options"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("viewof sliderRaw")).define("viewof sliderRaw", ["Scrubber","d3","numberOfDays","defaultDateIndex"], _sliderRaw);
  main.variable(observer("sliderRaw")).define("sliderRaw", ["Generators", "viewof sliderRaw"], (G, _) => G.input(_));
  main.variable(observer("viewof slider")).define("viewof slider", ["html","viewof sliderRaw","debounce","Event"], _slider);
  main.variable(observer("slider")).define("slider", ["Generators", "viewof slider"], (G, _) => G.input(_));
  main.variable(observer()).define(["dateFns","timeScale","slider","md","dateToEpoch","permalink"], _9);
  main.variable(observer("chart")).define("chart", ["dateFns","timeScale","viewof slider","partition","data","d3","width","color","arc","radius","viewof chartFocus","dataSource","bytes"], _chart);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["Inputs","selectedData"], _13);
  main.variable(observer()).define(["chart","slider"], _14);
  main.variable(observer("viewof chartFocus")).define("viewof chartFocus", ["Inputs","defaultChartFocus"], _chartFocus);
  main.variable(observer("chartFocus")).define("chartFocus", ["Generators", "viewof chartFocus"], (G, _) => G.input(_));
  main.variable(observer("data")).define("data", ["_","regionHierarchyReport","options"], _data);
  main.variable(observer("selectedDate")).define("selectedDate", ["dateFns","timeScale","slider"], _selectedDate);
  main.variable(observer()).define(["filteredRegionData","selectedDate"], _18);
  main.variable(observer()).define(["filteredDailyDealsByRegion","selectedDate"], _19);
  main.variable(observer()).define(["selectedDate"], _20);
  main.variable(observer("selectedData")).define("selectedData", ["partition","data","selectedDate"], _selectedData);
  main.variable(observer("partition")).define("partition", ["d3","filteredRegionData","filteredDailyDealsByRegion","dataSource"], _partition);
  main.variable(observer("color")).define("color", ["d3","data"], _color);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("arc")).define("arc", ["d3","radius"], _arc);
  main.variable(observer()).define(["md"], _27);
  const child1 = runtime.module(define1);
  main.import("geoIpLookupsBucketUrl", child1);
  main.variable(observer("regionHierarchyReport")).define("regionHierarchyReport", ["geoIpLookupsBucketUrl"], _regionHierarchyReport);
  const child2 = runtime.module(define1);
  main.import("minerPowerDailyAverageLatestBucketUrl", child2);
  main.variable(observer("minerPowerByRegionReport")).define("minerPowerByRegionReport", ["useSyntheticRegions","minerPowerDailyAverageLatestBucketUrl"], _minerPowerByRegionReport);
  main.variable(observer("rows")).define("rows", ["minerPowerByRegionReport","d3"], _rows);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer("numberOfDays")).define("numberOfDays", ["d3","startDate","endDate"], _numberOfDays);
  main.variable(observer("timeScale")).define("timeScale", ["d3","startDate","endDate","numberOfDays"], _timeScale);
  main.variable(observer()).define(["startDate"], _36);
  main.variable(observer()).define(["endDate"], _37);
  main.variable(observer("filteredRows")).define("filteredRows", ["rows","dateFns"], _filteredRows);
  main.variable(observer("filteredRegionData")).define("filteredRegionData", ["d3","filteredRows"], _filteredRegionData);
  const child3 = runtime.module(define1);
  main.import("dealsBucketUrl", child3);
  main.variable(observer("dailyDealsByRegion")).define("dailyDealsByRegion", ["useSyntheticRegions","dealsBucketUrl","d3"], _dailyDealsByRegion);
  main.variable(observer()).define(["dailyDealsByRegion"], _44);
  main.variable(observer("endDates")).define("endDates", ["rows","minerPowerByRegionReport","dailyDealsByRegion"], _endDates);
  main.variable(observer("endDate")).define("endDate", ["dateFns","endDates"], _endDate);
  main.variable(observer("dailyDealsByRegionIndexed")).define("dailyDealsByRegionIndexed", ["d3","dailyDealsByRegion"], _dailyDealsByRegionIndexed);
  main.variable(observer("dailyDealsByRegionWith7DaySums")).define("dailyDealsByRegionWith7DaySums", ["d3","dailyDealsByRegion","agnosticAddDays","dailyDealsByRegionIndexed"], _dailyDealsByRegionWith7DaySums);
  main.variable(observer("firstDateAfterGenesis")).define("firstDateAfterGenesis", ["epochToDate"], _firstDateAfterGenesis);
  main.variable(observer("startDate")).define("startDate", ["dataSource","firstDateAfterGenesis","dailyDealsByRegion"], _startDate);
  main.variable(observer("filteredDailyDealsByRegion")).define("filteredDailyDealsByRegion", ["d3","dailyDealsByRegionWith7DaySums","dateFns"], _filteredDailyDealsByRegion);
  main.variable(observer()).define(["md"], _52);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child4 = runtime.module(define2);
  main.import("dateToEpoch", child4);
  main.import("epochToDate", child4);
  main.variable(observer("bytes")).define("bytes", _bytes);
  main.variable(observer("dateFns")).define("dateFns", ["require"], _dateFns);
  const child5 = runtime.module(define3);
  main.import("agnosticAddDays", child5);
  main.import("agnosticDifferenceInDays", child5);
  const child6 = runtime.module(define4);
  main.import("Scrubber", child6);
  const child7 = runtime.module(define3);
  main.import("quickMenu", child7);
  const child8 = runtime.module(define5);
  main.import("debounce", child8);
  main.variable(observer()).define(["md"], _61);
  main.variable(observer("params")).define("params", ["URLSearchParams","location"], _params);
  main.variable(observer("defaultDataSource")).define("defaultDataSource", ["params"], _defaultDataSource);
  main.variable(observer("defaultHideNoRegion")).define("defaultHideNoRegion", ["params"], _defaultHideNoRegion);
  main.variable(observer()).define(["params"], _65);
  main.variable(observer("defaultDateIndex")).define("defaultDateIndex", ["params","agnosticDifferenceInDays","d3","startDate","numberOfDays"], _defaultDateIndex);
  main.variable(observer()).define(["startDate"], _67);
  main.variable(observer("defaultChartFocus")).define("defaultChartFocus", ["params"], _defaultChartFocus);
  main.variable(observer("defaultUseSyntheticRegions")).define("defaultUseSyntheticRegions", ["params"], _defaultUseSyntheticRegions);
  main.variable(observer("useSyntheticRegions")).define("useSyntheticRegions", ["options"], _useSyntheticRegions);
  main.variable(observer("permalink")).define("permalink", ["dateFns","timeScale","slider","dataSource","chartFocus","useSyntheticRegions","options"], _permalink);
  main.variable(observer()).define(["md"], _72);
  const child9 = runtime.module(define3);
  main.import("backups", child9);
  main.import("backupNowButton", child9);
  main.variable(observer()).define(["backups"], _74);
  return main;
}
