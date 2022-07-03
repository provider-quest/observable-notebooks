// https://observablehq.com/@d3/d3-hierarchy@856
function _1(md){return(
md`# d3.hierarchy

A [d3.hierarchy](https://github.com/d3/d3-hierarchy/blob/master/README.md#hierarchy) is a nested data structure representing a tree: each node has one parent node (*node*.parent), except for the root; likewise, each node has one or more child nodes (*node*.children), except for the leaves. In addition, each node can have associated data (*node*.data) to store whatever additional fields you like.

A d3.hierarchy is purely an abstract data structure. That is: it’s for working with hierarchical data. To visualize a hierarchy, you’ll want one of d3-hierarchy’s layouts, such as the [tidy tree](/@d3/tidy-tree), [treemap](/@d3/treemap) or [sunburst](/@d3/sunburst). See the [d3-hierarchy collection](/collection/@d3/d3-hierarchy) for more.

If your data is already in a hierarchical format, such as nested JSON, you can pass it directly to d3.hierarchy.`
)}

function _familyChart(graph,family){return(
graph(family, {label: d => d.data.name})
)}

function _family(d3){return(
d3.hierarchy({
  name: "root",
  children: [
    {name: "child #1"},
    {
      name: "child #2",
      children: [
        {name: "grandchild #1"},
        {name: "grandchild #2"},
        {name: "grandchild #3"}
      ]
    }
  ]
})
)}

function _4(md){return(
md`This convention matches the Document Object Model ([*element*.children](https://developer.mozilla.org/en-US/docs/Web/API/ParentNode/children)), so you can pass a DOM element to d3.hierarchy, which is a neat party trick. Here is a visualization of the DOM of the visualization of the family tree above. *Meta!*`
)}

function _5(graph,d3,familyChart){return(
graph(d3.hierarchy(familyChart), {label: d => d.data.tagName})
)}

function _6(d3,familyChart){return(
d3.hierarchy(familyChart)
)}

function _7(md){return(
md`If your nested data uses a different property name for its array of children, you can specify a children accessor function as the second argument to d3.hierarchy. Or, you can even adapt other nested data structures, such as nested arrays. Children must be specified as an iterable.`
)}

function _8(graph,arrays){return(
graph(arrays, ({label: d => d.children ? "" : d.data}))
)}

function _arrays(d3){return(
d3.hierarchy([
  [
    "leaf #1",
    [
      "leaf #2",
      "leaf #3",
      "leaf #4"
    ]
  ]
], d => Array.isArray(d) ? d : undefined)
)}

function _10(md){return(
md`Here’s another fancy example that recursively splits a string.`
)}

function _11(graph,parsed){return(
graph(parsed, {marginLeft: 200, label: d => d.data})
)}

function _parsed(d3){return(
d3.hierarchy(
  "This is not proper parsing. But certainly fun!",
  id => {
    for (const split of [/[^\w\s]/, /\s/]) {
      const children = id && id.split(split).filter(id => id.length > 0);
      if (children.length > 1) return children;
    }
  }
)
)}

function _13(md){return(
md`If you have tabular data, such as from comma-separated values (CSV), you can arrange it into a hierarchy using [d3.stratify](/@d3/d3-stratify). Each input object *d* represents a node in the tree, and must have a unique identifier and a parent identifier (by default, *d*.id and *d*.parentId respectively).`
)}

function _14(graph,chaos){return(
graph(chaos)
)}

function _chaos(d3){return(
d3.stratify()([
  {id: "Chaos"},
  {id: "Gaia", parentId: "Chaos"},
  {id: "Eros", parentId: "Chaos"},
  {id: "Erebus", parentId: "Chaos"},
  {id: "Tartarus", parentId: "Chaos"},
  {id: "Mountains", parentId: "Gaia"},
  {id: "Pontus", parentId: "Gaia"},
  {id: "Uranus", parentId: "Gaia"}
])
)}

function _16(md){return(
md`Both d3.stratify and d3.hierarchy return instances of d3.hierarchy, and thus support the same methods.`
)}

function _17(chaos,d3){return(
chaos instanceof d3.hierarchy
)}

function _18(md){return(
md`Each node wraps the input data; you can access the input data using *node*.data.`
)}

function _19(chaos){return(
chaos.data
)}

function _20(md){return(
md`Each node also exposes its computed position in the tree. The *node*.depth is zero for the root node, and increasing by one for each descendant generation.`
)}

function _21(graph,chaos){return(
graph(chaos, {label: d => `depth ${d.depth}`})
)}

function _22(md){return(
md`And likewise the *node*.height is zero for leaf nodes, and the greatest distance from any descendant leaf for internal nodes.`
)}

function _23(graph,chaos){return(
graph(chaos, {label: d => `height ${d.height}`})
)}

function _24(md){return(
md`To access the children of a node, you can use the *node*.children array. Each of these is an instance of d3.hierarchy, too.`
)}

function _gaia(chaos){return(
chaos.children[0]
)}

function _pontus(chaos){return(
chaos.children[0].children[1]
)}

function _tartarus(chaos){return(
chaos.children[3]
)}

function _28(md){return(
md`Leaf nodes don’t have an empty *node*.children: instead, the array is undefined. (By consequence, an empty children array is not allowed in the current API.)`
)}

function _29(tartarus){return(
tartarus.children
)}

function _30(md){return(
md`Of course, accessing children by index quickly gets tricky, so d3.hierarchy offers various methods to navigate the tree. Here’s a quick overview of what’s available.`
)}

function _31(md){return(
md`[*node*.ancestors](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_ancestors) returns an array of ancestor nodes: the given *node*, the *node*’s parent, grandparent, and so on up to the root.`
)}

function _32(gaia,graph,chaos)
{
  const highlight = new Set(gaia.ancestors());
  return graph(chaos, {highlight: d => highlight.has(d)});
}


function _33(gaia){return(
gaia.ancestors()
)}

function _34(pontus,graph,chaos)
{
  const highlight = new Set(pontus.ancestors());
  return graph(chaos, {highlight: d => highlight.has(d)});
}


function _35(pontus){return(
pontus.ancestors()
)}

function _36(md){return(
md`[*node*.descendants](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_descendants) returns an array of descendant nodes: the given *node*, then each child, and each child’s child, and so on.`
)}

function _37(gaia,graph,chaos)
{
  const highlight = new Set(gaia.descendants());
  return graph(chaos, {highlight: d => highlight.has(d)});
}


function _38(gaia){return(
gaia.descendants()
)}

function _39(md){return(
md`[*node*.leaves](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_leaves) returns an array of descendant nodes of the given *node* that don’t have children (including possibly the *node* itself).`
)}

function _40(gaia,graph,chaos)
{
  const highlight = new Set(gaia.leaves());
  return graph(chaos, {highlight: d => highlight.has(d)});
}


function _41(gaia){return(
gaia.leaves()
)}

function _42(md){return(
md`[*node*.path](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_path) computes the path from the given source *node*, up the tree to the least common ancestor, and back down to the given *target* node, returning an array of the traversed nodes in order (including *node* and *target*).`
)}

function _43(tartarus,pontus,graph,chaos)
{
  const highlight = new Set(tartarus.path(pontus));
  return graph(chaos, {highlight: d => highlight.has(d)});
}


function _44(tartarus,pontus){return(
tartarus.path(pontus)
)}

function _45(md){return(
md`[*node*.links](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_links) returns an array of objects representing the given *node*’s descendants’ links. Each *link* object’s *link*.target is a child and *link*.source is its parent. This representation is also used by [d3-force](https://github.com/d3/d3-force/blob/master/README.md#links), which makes it easier to create [force-directed trees](/@d3/force-directed-tree). (You can use *node*.descendants, described above, to compute the array of nodes for the force layout.)`
)}

function _46(gaia){return(
gaia.links()
)}

function _47(md){return(
md`Lastly, [*node*.copy](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_copy) returns a copy of the given *node* and its descendants, returning a new detached subtree. (The depth and height of each returned node are relative to the new root.)`
)}

function _48(graph,gaia){return(
graph(gaia.copy())
)}

function _49(gaia){return(
gaia.copy()
)}

function _50(md){return(
md`More methods for traversing a hierarchy are described in the second part of this notebook, [Visiting a d3.hierarchy](/@d3/visiting-a-d3-hierarchy).`
)}

function _51(md){return(
md`---
## Appendix

Thanks to [Chris Henrick](/@clhenrick) and [Daniel Edler](/@danieledler) for proofreading.`
)}

function _dx(){return(
12
)}

function _dy(){return(
120
)}

function _tree(d3,dx,dy){return(
d3.tree().nodeSize([dx, dy])
)}

function _treeLink(d3){return(
d3.linkHorizontal().x(d => d.y).y(d => d.x)
)}

function _graph(tree,d3,width,dx,treeLink){return(
function graph(root, {
  label = d => d.data.id, 
  highlight = () => false,
  marginLeft = 40
} = {}) {
  root = tree(root);

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, x1 - x0 + dx * 2])
      .style("overflow", "visible");
  
  const g = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("transform", `translate(${marginLeft},${dx - x0})`);
    
  const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
  .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("stroke", d => highlight(d.source) && highlight(d.target) ? "red" : null)
      .attr("stroke-opacity", d => highlight(d.source) && highlight(d.target) ? 1 : null)
      .attr("d", treeLink);
  
  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("fill", d => highlight(d) ? "red" : null)
      .attr("stroke", "white")
      .attr("paint-order", "stroke")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(label);
  
  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("familyChart")).define("familyChart", ["graph","family"], _familyChart);
  main.variable(observer("family")).define("family", ["d3"], _family);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer()).define(["graph","d3","familyChart"], _5);
  main.variable(observer()).define(["d3","familyChart"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer()).define(["graph","arrays"], _8);
  main.variable(observer("arrays")).define("arrays", ["d3"], _arrays);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["graph","parsed"], _11);
  main.variable(observer("parsed")).define("parsed", ["d3"], _parsed);
  main.variable(observer()).define(["md"], _13);
  main.variable(observer()).define(["graph","chaos"], _14);
  main.variable(observer("chaos")).define("chaos", ["d3"], _chaos);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer()).define(["chaos","d3"], _17);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer()).define(["chaos"], _19);
  main.variable(observer()).define(["md"], _20);
  main.variable(observer()).define(["graph","chaos"], _21);
  main.variable(observer()).define(["md"], _22);
  main.variable(observer()).define(["graph","chaos"], _23);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("gaia")).define("gaia", ["chaos"], _gaia);
  main.variable(observer("pontus")).define("pontus", ["chaos"], _pontus);
  main.variable(observer("tartarus")).define("tartarus", ["chaos"], _tartarus);
  main.variable(observer()).define(["md"], _28);
  main.variable(observer()).define(["tartarus"], _29);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer()).define(["md"], _31);
  main.variable(observer()).define(["gaia","graph","chaos"], _32);
  main.variable(observer()).define(["gaia"], _33);
  main.variable(observer()).define(["pontus","graph","chaos"], _34);
  main.variable(observer()).define(["pontus"], _35);
  main.variable(observer()).define(["md"], _36);
  main.variable(observer()).define(["gaia","graph","chaos"], _37);
  main.variable(observer()).define(["gaia"], _38);
  main.variable(observer()).define(["md"], _39);
  main.variable(observer()).define(["gaia","graph","chaos"], _40);
  main.variable(observer()).define(["gaia"], _41);
  main.variable(observer()).define(["md"], _42);
  main.variable(observer()).define(["tartarus","pontus","graph","chaos"], _43);
  main.variable(observer()).define(["tartarus","pontus"], _44);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer()).define(["gaia"], _46);
  main.variable(observer()).define(["md"], _47);
  main.variable(observer()).define(["graph","gaia"], _48);
  main.variable(observer()).define(["gaia"], _49);
  main.variable(observer()).define(["md"], _50);
  main.variable(observer()).define(["md"], _51);
  main.variable(observer("dx")).define("dx", _dx);
  main.variable(observer("dy")).define("dy", _dy);
  main.variable(observer("tree")).define("tree", ["d3","dx","dy"], _tree);
  main.variable(observer("treeLink")).define("treeLink", ["d3"], _treeLink);
  main.variable(observer("graph")).define("graph", ["tree","d3","width","dx","treeLink"], _graph);
  return main;
}
