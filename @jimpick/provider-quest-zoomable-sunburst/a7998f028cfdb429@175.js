// https://observablehq.com/@jimpick/debouncing-input-delayed@175
function _1(md){return(
md`# Debouncing Input - Delayed`
)}

function _input(html){return(
html`<input placeholder="Type some text here.">`
)}

function _3(md){return(
md`Non-debounced input:`
)}

function _4(input){return(
input
)}

function _5(md){return(
md`Debounced input:`
)}

function _6(debounce,$0){return(
debounce($0)
)}

function _7(md){return(
md`A function for debouncing input:`
)}

function _debounce(Generators){return(
function debounce(input, delay = 1000) {
  return Generators.observe(notify => {
    let timer = null;
    let value;

    // On input, check if we recently reported a value.
    // If we did, do nothing and wait for a delay;
    // otherwise, report the current value and set a timeout.
    function inputted() {
      if (timer !== null) return;
      //notify(value = input.value);
      timer = setTimeout(delayed, delay);
    }

    // After a delay, check if the last-reported value is the current value.
    // If it’s not, report the new value.
    function delayed() {
      timer = null;
      if (value === input.value) return;
      notify(value = input.value);
    }

    input.addEventListener("input", inputted), inputted();
    return () => input.removeEventListener("input", inputted);
  });
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof input")).define("viewof input", ["html"], _input);
  main.variable(observer("input")).define("input", ["Generators", "viewof input"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["input"], _4);
  main.variable(observer()).define(["md"], _5);
  main.variable(observer()).define(["debounce","viewof input"], _6);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("debounce")).define("debounce", ["Generators"], _debounce);
  return main;
}
