# FVM Actor Code Playground - ERC20 Sans Events - Wallaby Testnet

https://observablehq.com/@jimpick/fvm-actor-code-playground-erc20-sans-events-wallaby-testne@2156

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@5
npm install https://api.observablehq.com/d/c96312e9d904c8b1@2156.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@jimpick/fvm-actor-code-playground-erc20-sans-events-wallaby-testne";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
