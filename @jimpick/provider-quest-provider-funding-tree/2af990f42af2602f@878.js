// https://observablehq.com/@jimpick/provider-quest-funding-tree-test-cases@878
import define1 from "./8830e2b8532e91c3@857.js";
import define2 from "./13063df7b34879ca@853.js";
import define3 from "./5432439324f2c616@258.js";

function _1(md){return(
md`# Internal: Provider Funding Tree Test Cases [Provider.Quest]`
)}

function _selected(Inputs,targets,params){return(
Inputs.select(targets, {label: 'Select a subtree', format: x => x.id, value: targets.find(t => t.id === (params.subtree ? params.subtree : 'f021251'))})
)}

function _3(md,permalink){return(
md`${permalink}`
)}

function _path(getPath,targetPath){return(
getPath(targetPath)
)}

function _showDelegates(Inputs){return(
Inputs.toggle({ label: 'Show delegates', value: false })
)}

function _tree(getTree,fundingTree,path,selected){return(
getTree(fundingTree, path.path, {
  displayDepth: selected.displayDepth ? selected.displayDepth : 8,
  minXAdjust: selected.minXAdjust ? selected.minXAdjust : 50,
  dx: selected.dx ? selected.dx : 20,
  width: selected.width ? selected.width : 640
})
)}

function _7(md,selectedNode){return(
md`### Selected: ${selectedNode.data.id}`
)}

function _8(firstAncestorWithRegions,selectedNode,powerFromNode,md,bytes)
{
  const ancestor = firstAncestorWithRegions(selectedNode)
  const totalPower = powerFromNode(ancestor)
  return md`First ancestor with region data: ${ancestor && ancestor.data.id} 
    (${bytes(totalPower, { mode: 'binary' })})`
}


function _matchedDelegate(matchDelegate,selectedNode){return(
matchDelegate(selectedNode)
)}

function _10(md){return(
md`Possible delegates:`
)}

function _11(Inputs,delegates,bytes){return(
Inputs.table(delegates, {
  format: {
    qualityAdjPower: p => bytes(p, { mode: 'binary' }),
    scaledPower: p => bytes(p, { mode: 'binary' })
  },
  rows: 30
})
)}

function _delegates(getDelegates,selectedNode){return(
getDelegates(selectedNode)
)}

function _totalScaledPower(bytes,delegates){return(
bytes(
  delegates.reduce((acc, { scaledPower }) => acc + scaledPower, 0),
  { mode: 'binary' }
)
)}

function _selectedNode(tree,$0)
{
  tree
  return $0.selectedNode.data
}


function _targetPath(fundingTree,selected){return(
fundingTree.find(d => d.data.id === selected.id).ancestors().map(d => d.data.id).reverse().slice(1).join('/')
)}

function _16(md){return(
md`## Selected Subtrees`
)}

function _targets(){return(
[
  { id: 'f021251' },
  { id: 'f01019' },
  { id: 'f01038' },
  { id: 'f01062', displayDepth: 8, minXAdjust: 0, width: 1000 },
  { id: 'f035300' },
  { id: 'f03637' },
  { id: 'f023836' },
  { id: 'f084877', displayDepth: 9 },
  { id: 'f035474' }
]
)}

function _18(md){return(
md`# Delegation Functions`
)}

function _childrenWithRegions(){return(
function childrenWithRegions (node) {
  return node.leaves().filter(d => d.data.regions)
}
)}

function _firstAncestorWithRegions(childrenWithRegions){return(
function firstAncestorWithRegions (node) {
  for (const ancestor of node.ancestors()) {
    if (childrenWithRegions(ancestor).length > 0) {
      return ancestor
    }
  }
  return null
}
)}

function _fillFactor(getFillFactor){return(
function fillFactor (topAncestor, provider) {
  // console.log(`fillFactor ancestor: ${topAncestor.data.id} ` +
  //             `SP: ${provider.data.id}`)
  if (topAncestor === provider) {
    return 1
  }
  let factor = 1
  const ancestors = provider.ancestors().slice(1)
  for (const ancestor of ancestors) {
    const ancestorFillFactor = getFillFactor(ancestor)
    factor = factor * ancestorFillFactor
    // console.log(`   Ancestor: ${ancestor.data.id} ${ancestorFillFactor.toFixed(2)} ${factor.toFixed(2)}`)
    if (ancestor === topAncestor) break
  }
  return factor
}
)}

function _coverage(){return(
function coverage (node) {
  let total = 0
  let withRegion = 0

  if (node.children) {
    for (const child of node.children) {
      const [branchTotal, branchWithRegion] = coverage(child)
      total += branchTotal
      withRegion += branchWithRegion
    }
  } else {
    total += node.data.qualityAdjPower
    if (node.data.regions) {
      withRegion += node.data.qualityAdjPower
    }
  }
  return [total, withRegion]
}
)}

function _powerFromNode(){return(
function powerFromNode (node) {
  let totalPower = 0
  for (const provider of node.leaves()) {
    totalPower += provider.data.qualityAdjPower
  }
  return totalPower
}
)}

function _getPartitions(coverage){return(
function getPartitions (node) {
  const rows = []
  if (node.children) {
    for (const child of node.children) {
      const [totalPower, coveredPower] = coverage(child)
      rows.push({
        id: child.data.id,
        totalPower,
        coveredPower
      })
    }
  }
  return rows
}
)}

function _getFillFactor(getPartitions){return(
function getFillFactor (node) {
  const partitions = getPartitions(node)
  const totalPower = partitions.reduce(
    (acc, {totalPower, coveredPower}) => acc + totalPower, 0
  )
  const coveredTotalPower = partitions.reduce(
    (acc, {totalPower, coveredPower}) => coveredPower ? acc + totalPower : acc, 0
  )
  const fillFactor = totalPower / coveredTotalPower
  return fillFactor
}
)}

function _getDelegates(firstAncestorWithRegions,childrenWithRegions,fillFactor){return(
function getDelegates (node) {
  const ancestor = firstAncestorWithRegions(node)
  const delegates = childrenWithRegions(ancestor)
    .map(d => {
      const f = fillFactor(ancestor, d)
      return {
        regions: d.data.regions.join(','),
        id: d.data.miner_id,
        qualityAdjPower: d.data.qualityAdjPower,
        fillFactor: f,
        scaledPower: d.data.qualityAdjPower * f
      }
    })
    .sort((a, b) => {
      const regionComp = a.regions.localeCompare(b.regions)
      if (regionComp) return regionComp
      return Number(a.id.slice(1)) - Number(b.id.slice(1))
    })
  return delegates
}
)}

function _hashProviderId(){return(
async function hashProviderId (id) {
  const encoder = new TextEncoder()
  const data = encoder.encode(id)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hash2Bytes = new Uint8Array(hash.slice(0,2))
  return hash2Bytes[0] * 256 + hash2Bytes[1]
}
)}

function _matchDelegate(getDelegates,hashProviderId){return(
async function matchDelegate (node) {
  const delegates = getDelegates(node)
  const totalScaledPower = delegates.reduce((acc, { scaledPower }) => acc + scaledPower, 0)
  const hash = await hashProviderId(node.data.id)
  let powerPosition = (hash / 255.0 / 255.0) * totalScaledPower
  let lastId
  for (const { id, scaledPower } of delegates) {
    lastId = id
    powerPosition -= scaledPower
    if (powerPosition < 0) break
  }
  return lastId
}
)}

function _getTreeWithDelegates(matchDelegate){return(
async function getTreeWithDelegates (tree) {
  for (const provider of tree.leaves()) {
    if (!provider.data.regions) {
      const delegateId = await matchDelegate(provider)
      console.log(`J: ${provider.data.id} => ${delegateId}`)
      provider.data.delegateId = delegateId
    }
  }
  return tree
}
)}

function _30(md){return(
md`# Visualization Functions`
)}

function _getPath(md){return(
function getPath (pathStr) {
  const base = 'https://observablehq.com/@jimpick/provider-funding-tree-inspector'
  const links = []
  links.push(
    `[root](${base})`
  )
  let path = []
  if (pathStr) {
    path = pathStr.split('/')
    for (const i in path) {
      const pathPart = path[i]
      const subPath = path.slice(0, Number(i) + 1).join('/')
      links.push(`[${pathPart}](${base}?path=${subPath})`)
    }
  }
  const result = md`## Path: ${links.join(' / ')}`
  result.pathStr = pathStr
  result.path = path
  return result
}
)}

function _getTree(selectPath,topOfTree,getTreeWithDelegates,Tree2,d3,bytes,showDelegates){return(
async function getTree (tree, path, { displayDepth = 3, minXAdjust = 100, dx = 10 }) {
  const selectedSubtree = selectPath(tree, path)
  const prunedTree = topOfTree(selectedSubtree, displayDepth)
  const prunedTreeWithDelegates = await getTreeWithDelegates(prunedTree)
  
  return Tree2(prunedTreeWithDelegates, {
    padding: 5,
    minXAdjust,
    widthAdjust: 0,
    dx,
    tree: d3.tree,
    sort: (a, b) => {
      Number(a.data.id.slice(1)) - Number(b.data.id.slice(1))
    },
    label: d => {
      const regions = d.data.children && d.data.children.regions.sort()
      return (
        (d.data.miner_id ?
         `SP: ${d.data.miner_id} - ${bytes(d.data.qualityAdjPower, { mode: 'binary' })}` : d.data.id) +
        (d.data.regions ?
         ` - ${d.data.regions.join(', ')}` : '') +
        (d.data.children ?
         ` ... ${d.data.children.count} SPs, ` +
         `${bytes(d.data.children.qualityAdjPower, { mode: 'binary' })}, ` +
         `${regions.length > 0 ? regions.join(', ') : 'No regions'}` +
         ` - ${(d.data.children.coveredCount / d.data.children.count * 100).toFixed(1)}%`
        : '')
      )
    },
    delegateLabel: d => {
      return (showDelegates && d.data.delegateId ? ` ⇨ ${d.data.delegateId} - ` +
         prunedTreeWithDelegates
          .find(d2 => d2.data.id === d.data.delegateId)
          .data.regions.join(', ')
         : '')
    },
    /*
    link: d => {
    */
    //  let url = `${document.baseURI.replace(/\?.*/,'')}`
    /*  if (d.depth === 0) {
        const oldPath = params.path ? params.path.split('/') : []
        const newPath = oldPath.slice(0, oldPath.length - 1)
        if (newPath.length > 0) {
          url += `?path=${newPath.join('/')}`
        }
      } else {
        url += `?path=` + (params.path ? `${params.path}/` : '') + 
          d.ancestors().map(d => d.data.id).reverse().slice(1).join('/')
      }
      return url
    },
    linkTarget: '_top'
    */
  })
}
)}

function _fundingTreeData(FileAttachment){return(
FileAttachment("funder-tree.json").json()
)}

function _stratify(d3){return(
d3.stratify()
    .id(d => d["address"])
    .parentId(d => d["funded_from"])
)}

function _fundingTree(stratify,fundingTreeData){return(
stratify(fundingTreeData)
)}

function _37(fundingTree){return(
fundingTree.children
)}

function _selectPath(){return(
function selectPath (tree, path) {
  let subTree = tree
  if (!path) {
    return tree
  }

  nextSubtree: for (const pathElement of path) {
    for (const childNode of subTree.children) {
      if (childNode.data.id === pathElement) {
        subTree = childNode
        continue nextSubtree
      }
    }
    return null
  }
  return subTree.copy()
}
)}

function _topOfTree(stratify){return(
function (tree, levels) {
  const nodeData = []
  for (const descendant of tree) {
    if (descendant.depth < levels) {
      const data = {...descendant.data}
      if (descendant.depth === 0) {
        delete data.funded_from
      }
      if (descendant.depth === levels - 1
         && descendant.children) {
        const regions = new Set()
        let coveredCount = 0
        for (const provider of descendant.leaves()) {
          if (provider.data.regions && provider.data.regions.length > 0) {
            coveredCount++
            for (const region of provider.data.regions) {
              regions.add(region)
            }
          }
        }
        data.children = {
          count: descendant.count().value,
          coveredCount,
          qualityAdjPower: descendant.sum(d => d.qualityAdjPower).value,
          regions: [...regions]
        }
      }
      nodeData.push(data)
    }
  }
  return stratify(nodeData)
}
)}

function _40(md){return(
md`## Imports and Data`
)}

async function _bytes(){return(
(await import('https://unpkg.com/@jimpick/bytes-iec@3.1.0-2?module')).default
)}

function _45(md){return(
md`Modified from \`@d3/tree\``
)}

function _Tree2(d3){return(
function Tree2(data, { // data is either tabular (array of objects) or hierarchy (nested objects)
  path, // as an alternative to id and parentId, returns an array identifier, imputing internal nodes
  id = Array.isArray(data) ? d => d.id : null, // if tabular data, given a d in data, returns a unique identifier (string)
  parentId = Array.isArray(data) ? d => d.parentId : null, // if tabular data, given a node d, returns its parent’s identifier
  children, // if hierarchical data, given a d in data, returns its children
  tree = d3.tree, // layout algorithm (typically d3.tree or d3.cluster)
  sort, // how to sort nodes prior to layout (e.g., (a, b) => d3.descending(a.height, b.height))
  label, // given a node d, returns the display name
  delegateLabel,
  title, // given a node d, returns its hover text
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links (if any)
  width = 640, // outer width, in pixels
  height, // outer height, in pixels
  r = 3, // radius of nodes
  padding = 1, // horizontal padding for first and last column
  fill = "#999", // fill for nodes
  fillOpacity, // fill opacity for nodes
  stroke = "#555", // stroke for links
  strokeWidth = 1.5, // stroke width for links
  strokeOpacity = 0.4, // stroke opacity for links
  strokeLinejoin, // stroke line join for links
  strokeLinecap, // stroke line cap for links
  halo = "#fff", // color of label halo 
  haloWidth = 3, // padding around the labels
  minXAdjust = 0,
  widthAdjust = 0,
  dx = 10
} = {}) {
  // If id and parentId options are specified, or the path option, use d3.stratify
  // to convert tabular data to a hierarchy; otherwise we assume that the data is
  // specified as an object {children} with nested objects (a.k.a. the “flare.json”
  // format), and use d3.hierarchy.
  const root = path != null ? d3.stratify().path(path)(data)
      : id != null || parentId != null ? d3.stratify().id(id).parentId(parentId)(data)
      : d3.hierarchy(data, children);

  // Compute labels and titles.
  const descendants = root.descendants();
  const L = label == null ? null : descendants.map(d => label(d.data, d));
  const DL = delegateLabel == null ? null : descendants.map(d => delegateLabel(d.data, d));

  // Sort the nodes.
  if (sort != null) root.sort(sort);

  // Compute the layout.
  // const dx = 10;
  const dy = width / (root.height + padding);
  tree().nodeSize([dx, dy])(root);

  // Center the tree.
  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  // Compute the default height.
  if (height === undefined) height = x1 - x0 + dx * 2;

  const svg = d3.create("svg")
      .attr("viewBox", [-dy * padding / 2 + minXAdjust, x0 - dx, width + widthAdjust, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-linecap", strokeLinecap)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-width", strokeWidth)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d3.linkHorizontal()
            .x(d => d.y)
            .y(d => d.x));

  const node = svg.append("g")
    .selectAll("a")
    .data(root.descendants())
    .join("a")
      .attr("xlink:href", link == null ? null : d => link(d.data, d))
      .attr("target", link == null ? null : linkTarget)
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => d.children ? stroke : fill)
      .attr("r", r);

  if (title != null) node.append("title")
      .text(d => title(d.data, d))

  const resultNode = svg.node();

  if (L) {
    const texts = node.append("text")
      .attr("dy", "0.32em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text((d, i) => L[i])

    if (DL) {
      texts.append("tspan")
        .attr("fill", "blue")
        .text((d, i) => ` ${DL[i]}`)
    }

    texts.on("click", (event, [d]) => {
      console.log("Click", d.data.data.id)
      resultNode.selectedNode = d
      resultNode.dispatchEvent(new CustomEvent("input", {bubbles: true}))
    })
  }

      /*
      .call(text => text.clone(true))
      .attr("fill", "none")
      .attr("stroke", halo)
      .attr("stroke-width", haloWidth) */

  resultNode.selectedNode = null;
  return resultNode;
}
)}

function _params(URLSearchParams,location){return(
[...(new URLSearchParams(location.search.substring(1))).entries()].reduce((acc, [key, value]) => ({ [key]: value, ...acc }), {})
)}

function _permalink(selected)
{
  let url = `${document.baseURI.replace(/\?.*/,'')}?subtree=${selected.id}`
  return `[Permalink](${url})`
}


export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["funder-tree.json",new URL("./files/76cebeed9cdd52ef778d277888d4ab2e9c65012a45ea3a7fa87ee3d463f1981c0804a3d90a7a9ddfccb2a6ce5379a5e42ef69dccd3099c9769d5d44105d527db",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof selected")).define("viewof selected", ["Inputs","targets","params"], _selected);
  main.variable(observer("selected")).define("selected", ["Generators", "viewof selected"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","permalink"], _3);
  main.variable(observer("path")).define("path", ["getPath","targetPath"], _path);
  main.variable(observer("viewof showDelegates")).define("viewof showDelegates", ["Inputs"], _showDelegates);
  main.variable(observer("showDelegates")).define("showDelegates", ["Generators", "viewof showDelegates"], (G, _) => G.input(_));
  main.variable(observer("viewof tree")).define("viewof tree", ["getTree","fundingTree","path","selected"], _tree);
  main.variable(observer("tree")).define("tree", ["Generators", "viewof tree"], (G, _) => G.input(_));
  main.variable(observer()).define(["md","selectedNode"], _7);
  main.variable(observer()).define(["firstAncestorWithRegions","selectedNode","powerFromNode","md","bytes"], _8);
  main.variable(observer("matchedDelegate")).define("matchedDelegate", ["matchDelegate","selectedNode"], _matchedDelegate);
  main.variable(observer()).define(["md"], _10);
  main.variable(observer()).define(["Inputs","delegates","bytes"], _11);
  main.variable(observer("delegates")).define("delegates", ["getDelegates","selectedNode"], _delegates);
  main.variable(observer("totalScaledPower")).define("totalScaledPower", ["bytes","delegates"], _totalScaledPower);
  main.variable(observer("selectedNode")).define("selectedNode", ["tree","viewof tree"], _selectedNode);
  main.variable(observer("targetPath")).define("targetPath", ["fundingTree","selected"], _targetPath);
  main.variable(observer()).define(["md"], _16);
  main.variable(observer("targets")).define("targets", _targets);
  main.variable(observer()).define(["md"], _18);
  main.variable(observer("childrenWithRegions")).define("childrenWithRegions", _childrenWithRegions);
  main.variable(observer("firstAncestorWithRegions")).define("firstAncestorWithRegions", ["childrenWithRegions"], _firstAncestorWithRegions);
  main.variable(observer("fillFactor")).define("fillFactor", ["getFillFactor"], _fillFactor);
  main.variable(observer("coverage")).define("coverage", _coverage);
  main.variable(observer("powerFromNode")).define("powerFromNode", _powerFromNode);
  main.variable(observer("getPartitions")).define("getPartitions", ["coverage"], _getPartitions);
  main.variable(observer("getFillFactor")).define("getFillFactor", ["getPartitions"], _getFillFactor);
  main.variable(observer("getDelegates")).define("getDelegates", ["firstAncestorWithRegions","childrenWithRegions","fillFactor"], _getDelegates);
  main.variable(observer("hashProviderId")).define("hashProviderId", _hashProviderId);
  main.variable(observer("matchDelegate")).define("matchDelegate", ["getDelegates","hashProviderId"], _matchDelegate);
  main.variable(observer("getTreeWithDelegates")).define("getTreeWithDelegates", ["matchDelegate"], _getTreeWithDelegates);
  main.variable(observer()).define(["md"], _30);
  main.variable(observer("getPath")).define("getPath", ["md"], _getPath);
  main.variable(observer("getTree")).define("getTree", ["selectPath","topOfTree","getTreeWithDelegates","Tree2","d3","bytes","showDelegates"], _getTree);
  main.variable(observer("fundingTreeData")).define("fundingTreeData", ["FileAttachment"], _fundingTreeData);
  main.variable(observer("stratify")).define("stratify", ["d3"], _stratify);
  main.variable(observer("fundingTree")).define("fundingTree", ["stratify","fundingTreeData"], _fundingTree);
  main.variable(observer()).define(["fundingTree"], _37);
  main.variable(observer("selectPath")).define("selectPath", _selectPath);
  main.variable(observer("topOfTree")).define("topOfTree", ["stratify"], _topOfTree);
  main.variable(observer()).define(["md"], _40);
  main.variable(observer("bytes")).define("bytes", _bytes);
  const child1 = runtime.module(define1);
  main.import("graph", "graph2", child1);
  const child2 = runtime.module(define2);
  main.import("graph", child2);
  const child3 = runtime.module(define3);
  main.import("Tree", child3);
  main.variable(observer()).define(["md"], _45);
  main.variable(observer("Tree2")).define("Tree2", ["d3"], _Tree2);
  main.variable(observer("params")).define("params", ["URLSearchParams","location"], _params);
  main.variable(observer("permalink")).define("permalink", ["selected"], _permalink);
  return main;
}
