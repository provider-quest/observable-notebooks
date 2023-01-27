// https://observablehq.com/@jimpick/download-data-button-with-wasm-support@50
function _1(DOM,button,data,md)
{
  const div = DOM.element('div');
  const csvBtn = button(data, 'fips.csv');
  const jsonBtn = button(data, 'fips.json');
  const csvText = md`# Download data button (with WASM support)

The <code>button</code> function takes two positional arguments:

1. **Required** - An array of the data to download as a CSV or a JSON file, or a UInt8Array for a WASM file, or a string for plain text files
2. The name of the file to be downloaded, defaults to <code>data.csv</code>

For example, this code will create the following button
<code><pre>
button(data, 'fips.csv')
</pre></code>
`;
  const jsonText = md`And if you use a filename that ends in <code>.json</code>, then the button will download a JSON document instead of a CSV.

<code><pre>
button(data, 'fips.json')
</pre></code>`;

  div.appendChild(csvText);
  div.appendChild(csvBtn);
  div.appendChild(jsonText);
  div.appendChild(jsonBtn);

  return div;
}


function _data(){return(
[
  {
    fips: "01",
    abbreviation: "AL",
    name: "Alabama"
  },
  {
    fips: "02",
    abbreviation: "AK",
    name: "Alaska"
  },
  {
    fips: "03",
    abbreviation: "AS",
    name: "American Samoa"
  },
  {
    fips: "04",
    abbreviation: "AZ",
    name: "Arizona"
  },
  {
    fips: "05",
    abbreviation: "AR",
    name: "Arkansas"
  },
  {
    fips: "06",
    abbreviation: "CA",
    name: "California"
  },
  {
    fips: "07",
    abbreviation: "CZ",
    name: "Canal Zone"
  },
  {
    fips: "08",
    abbreviation: "CO",
    name: "Colorado"
  },
  {
    fips: "09",
    abbreviation: "CT",
    name: "Connecticut"
  },
  {
    fips: "10",
    abbreviation: "DE",
    name: "Delaware"
  },
  {
    fips: "11",
    abbreviation: "DC",
    name: "District Of Columbia"
  },
  {
    fips: "12",
    abbreviation: "FL",
    name: "Florida"
  },
  {
    fips: "13",
    abbreviation: "GA",
    name: "Georgia"
  },
  {
    fips: "14",
    abbreviation: "GU",
    name: "Guam"
  },
  {
    fips: "15",
    abbreviation: "HI",
    name: "Hawaii"
  },
  {
    fips: "16",
    abbreviation: "ID",
    name: "Idaho"
  },
  {
    fips: "17",
    abbreviation: "IL",
    name: "Illinois"
  },
  {
    fips: "18",
    abbreviation: "IN",
    name: "Indiana"
  },
  {
    fips: "19",
    abbreviation: "IA",
    name: "Iowa"
  },
  {
    fips: "20",
    abbreviation: "KS",
    name: "Kansas"
  },
  {
    fips: "21",
    abbreviation: "KY",
    name: "Kentucky"
  },
  {
    fips: "22",
    abbreviation: "LA",
    name: "Louisiana"
  },
  {
    fips: "23",
    abbreviation: "ME",
    name: "Maine"
  },
  {
    fips: "24",
    abbreviation: "MD",
    name: "Maryland"
  },
  {
    fips: "25",
    abbreviation: "MA",
    name: "Massachusetts"
  },
  {
    fips: "26",
    abbreviation: "MI",
    name: "Michigan"
  },
  {
    fips: "27",
    abbreviation: "MN",
    name: "Minnesota"
  },
  {
    fips: "28",
    abbreviation: "MS",
    name: "Mississippi"
  },
  {
    fips: "29",
    abbreviation: "MO",
    name: "Missouri"
  },
  {
    fips: "30",
    abbreviation: "MT",
    name: "Montana"
  },
  {
    fips: "31",
    abbreviation: "NE",
    name: "Nebraska"
  },
  {
    fips: "32",
    abbreviation: "NV",
    name: "Nevada"
  },
  {
    fips: "33",
    abbreviation: "NH",
    name: "New Hampshire"
  },
  {
    fips: "34",
    abbreviation: "NJ",
    name: "New Jersey"
  },
  {
    fips: "35",
    abbreviation: "NM",
    name: "New Mexico"
  },
  {
    fips: "36",
    abbreviation: "NY",
    name: "New York"
  },
  {
    fips: "37",
    abbreviation: "NC",
    name: "North Carolina"
  },
  {
    fips: "38",
    abbreviation: "ND",
    name: "North Dakota"
  },
  {
    fips: "39",
    abbreviation: "OH",
    name: "Ohio"
  },
  {
    fips: "40",
    abbreviation: "OK",
    name: "Oklahoma"
  },
  {
    fips: "41",
    abbreviation: "OR",
    name: "Oregon"
  },
  {
    fips: "42",
    abbreviation: "PA",
    name: "Pennsylvania"
  },
  {
    fips: "43",
    abbreviation: "PR",
    name: "Puerto Rico"
  },
  {
    fips: "44",
    abbreviation: "RI",
    name: "Rhode Island"
  },
  {
    fips: "45",
    abbreviation: "SC",
    name: "South Carolina"
  },
  {
    fips: "46",
    abbreviation: "SD",
    name: "South Dakota"
  },
  {
    fips: "47",
    abbreviation: "TN",
    name: "Tennessee"
  },
  {
    fips: "48",
    abbreviation: "TX",
    name: "Texas"
  },
  {
    fips: "49",
    abbreviation: "UT",
    name: "Utah"
  },
  {
    fips: "50",
    abbreviation: "VT",
    name: "Vermont"
  },
  {
    fips: "51",
    abbreviation: "VA",
    name: "Virginia"
  },
  {
    fips: "52",
    abbreviation: "VI",
    name: "Virgin Islands"
  },
  {
    fips: "53",
    abbreviation: "WA",
    name: "Washington"
  },
  {
    fips: "54",
    abbreviation: "WV",
    name: "West Virginia"
  },
  {
    fips: "55",
    abbreviation: "WI",
    name: "Wisconsin"
  },
  {
    fips: "56",
    abbreviation: "WY",
    name: "Wyoming"
  }
]
)}

function _button(d3,DOM){return(
(data, filename = 'data.csv') => {
  if (!data) throw new Error('Array of data required as first argument');

  let downloadData;
  if (filename.includes('.wasm')) {
    downloadData = new Blob(data, { type: "application/wasm" });
  } else if (filename.includes('.csv')) {
    downloadData = new Blob([d3.csvFormat(data)], { type: "text/csv" });
  } else if (filename.includes('.json')) {
    downloadData = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
  } else {
    downloadData = new Blob([data], {
      type: "text/plain"
    });
  }

  const size = (downloadData.size / 1024).toFixed(0);
  const button = DOM.download(
    downloadData,
    filename,
    `Download ${filename} (~${size} KB)`
  );
  return button;
}
)}

function _d3(require){return(
require('d3')
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["DOM","button","data","md"], _1);
  main.variable(observer("data")).define("data", _data);
  main.variable(observer("button")).define("button", ["d3","DOM"], _button);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
