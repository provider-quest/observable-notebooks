# Internal: Mapping: Storage Provider to Country/State/Province [Provider.Quest]

https://observablehq.com/@jimpick/internal-mapping-storage-provider-to-countrystateprovin@656

View this notebook in your browser by running a web server in this folder. For
example:

~~~sh
npx http-server
~~~

Or, use the [Observable Runtime](https://github.com/observablehq/runtime) to
import this module directly into your application. To npm install:

~~~sh
npm install @observablehq/runtime@4
npm install https://api.observablehq.com/d/e98f5037803ae3db@656.tgz?v=3
~~~

Then, import your notebook and the runtime as:

~~~js
import {Runtime, Inspector} from "@observablehq/runtime";
import define from "@jimpick/internal-mapping-storage-provider-to-countrystateprovin";
~~~

To log the value of the cell named “foo”:

~~~js
const runtime = new Runtime();
const main = runtime.module(define);
main.value("foo").then(value => console.log(value));
~~~
