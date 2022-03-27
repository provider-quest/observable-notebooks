// https://observablehq.com/@observablehq/input-table@846
function _1(md){return(
md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none">Table Input / Observable Inputs</h1><a href="/@observablehq/inputs">Observable Inputs</a> › Table · <a href="https://github.com/observablehq/inputs/blob/main/README.md#table">API</a></div>

# Input: Table

A Table displays tabular data. It’s fast: rows are rendered lazily on scroll. It sorts: click a header to sort, and click again to reverse. And it selects: click a checkbox on any row, and the selected rows are exported as a view value. (And for searching, see the [Search input](/@observablehq/input-search).) For more applied examples, see [Hello, Inputs!](/@observablehq/hello-inputs)`
)}

function _2(md){return(
md`By default, all columns are visible. Only the first dozen rows are initially visible, but you can scroll to see more. Column headers are fixed for readability.`
)}

function _penguins(FileAttachment){return(
FileAttachment("penguins.csv").csv({typed: true})
)}

function _4(Inputs,penguins){return(
Inputs.table(penguins)
)}

function _5(md){return(
md`To show a subset of columns, or to reorder them, pass an array of property names as the *columns* option. By default, columns are inferred from *data*.columns if present, and otherwise by iterating over the data to union the property names.`
)}

function _6(Inputs,penguins){return(
Inputs.table(penguins, {columns: ["species", "culmen_depth_mm", "culmen_length_mm"]})
)}

function _7(md){return(
md`By default, rows are displayed in input order. You can change the order by specifying the name of a column to *sort* by, and optionally the *reverse* option for descending order. The male Gentoo penguins are the largest in this dataset, for example. Undefined values go to the end.`
)}

function _8(Inputs,penguins){return(
Inputs.table(penguins, {sort: "body_mass_g", reverse: true})
)}

function _9(md){return(
md`Tables are [view-compatible](/@observablehq/introduction-to-views): using the viewof operator, you can use a table to select rows and refer to them from other cells, say to chart a subset of the data. Click the checkbox on the left edge of a row to select it, and click the checkbox in the header row to clear the selection. You can shift-click to select a range of rows.`
)}

function _selection(Inputs,penguins){return(
Inputs.table(penguins, {required: false})
)}

function _11(selection){return(
selection
)}

function _12(md){return(
md`If nothing is selected, by default the table’s value is the full dataset. If the *required* option is false, the empty selection will be represented by the empty array instead.`
)}

function _13(md){return(
md`The table component assumes that all values in a given column are the same type, and chooses a suitable formatter based on the first non-null value in each column. Numbers are formatted using [*number*.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString); dates are formatted in ISO8601; undefined and NaN values are empty; everything else is displayed as-is. To override the default formatting, pass *format* options for the desired columns.`
)}

function _14(Inputs,penguins){return(
Inputs.table(penguins, {
  format: {
    culmen_length_mm: x => x.toFixed(1),
    culmen_depth_mm: x => x.toFixed(1),
    sex: x => x === "MALE" ? "M" : x === "FEMALE" ? "F" : ""
  }
})
)}

function _15(md){return(
md`The *format* function can return either a text string or an HTML element. For example, this can be used to render inline visualizations such as bars or [sparklines](/@mbostock/covid-cases-by-state).`
)}

function _16(Inputs,penguins,sparkbar,d3){return(
Inputs.table(penguins, {
  format: {
    culmen_length_mm: sparkbar(d3.max(penguins, d => d.culmen_length_mm)),
    culmen_depth_mm: sparkbar(d3.max(penguins, d => d.culmen_depth_mm)),
    flipper_length_mm: sparkbar(d3.max(penguins, d => d.flipper_length_mm)),
    body_mass_g: sparkbar(d3.max(penguins, d => d.body_mass_g)),
    sex: x => x.toLowerCase()
  }
})
)}

function _sparkbar(htl){return(
function sparkbar(max) {
  return x => htl.html`<div style="
    background: lightblue;
    width: ${100 * x / max}%;
    float: right;
    padding-right: 3px;
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    justify-content: end;">${x.toLocaleString("en")}`
}
)}

function _18(md){return(
md`There’s a similar *width* option if you want to give certain columns specific widths. The table component defaults to a *fixed* layout if there are twelve or fewer columns; this improves performance and avoids reflow when scrolling, but you can switch to an *auto* layout if you prefer sizing columns based on content.`
)}

function _19(md){return(
md`There’s also an *align* option if you want to change the text-alignment of cells. By default, number columns are right-aligned, and everything else is left-aligned.`
)}

function _20(md){return(
md`---

## Appendix`
)}

function _21(md){return(
md`Thanks to [Ilyá Belsky](https://observablehq.com/@oluckyman) for suggestions.`
)}

function _Table(Inputs){return(
Inputs.table
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["penguins.csv",new URL("./files/715db1223e067f00500780077febc6cebbdd90c151d3d78317c802732252052ab0e367039872ab9c77d6ef99e5f55a0724b35ddc898a1c99cb14c31a379af80a",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer("penguins")).define("penguins", ["FileAttachment"], _penguins);
  main.variable(observer()).define(["Inputs","penguins"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["Inputs","penguins"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["Inputs","penguins"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("viewof selection")).define("viewof selection", ["Inputs","penguins"], _selection);
  main.variable(observer("selection")).define("selection", ["Generators", "viewof selection"], (G, _) => G.input(_));
  main.variable(observer()).define(["selection"], _11);
  main.variable(observer()).define(["md"], _12);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["Inputs","penguins"], _14);
  main.variable(observer()).define(["md"], _15);
  main.variable(observer()).define(["Inputs","penguins","sparkbar","d3"], _16);
  main.variable(observer("sparkbar")).define("sparkbar", ["htl"], _sparkbar);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["md"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["md"], _21);
  main.variable(observer("Table")).define("Table", ["Inputs"], _Table);
  return main;
}
