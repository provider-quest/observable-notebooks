// https://observablehq.com/@jimpick/test-github-backup@22
import define1 from "./1d309dbd9697e042@703.js";

function _1(md){return(
md`# Test GitHub backup`
)}

function _2(md){return(
md`* https://observablehq.com/@tomlarkworthy/github-backups
* https://github.com/provider-quest/observable-notebooks`
)}

function _3(backupNowButton){return(
backupNowButton()
)}

function _4(md){return(
md`Test backup 1`
)}

function _6(enableGithubBackups){return(
enableGithubBackups({
  owner: "provider-quest",                   // Target Github username/organization
  repo: "observable-notebooks",                // Target Github repo
  allow: ['jimpick', 'endpointservices'] // [optional] Allowed source observablehq logins
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["backupNowButton"], _3);
  main.variable(observer()).define(["md"], _4);
  const child1 = runtime.module(define1);
  main.import("enableGithubBackups", child1);
  main.import("backupNowButton", child1);
  main.variable(observer()).define(["enableGithubBackups"], _6);
  return main;
}
