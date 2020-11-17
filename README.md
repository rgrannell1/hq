
# hq

`hq` pulls information from webpages. It's mainly intended to interlink with [jq](https://stedolan.github.io/jq), allowing you to:

- pull down a website using curl
- extract links, headers, or whatever target content you want
- pass this information onto `jq` for filtering

### Stability Index

> 1, Experimental - This project might die, it's undertested and underdocumented, and redesigns and breaking changes are likely

### Name

This project's name is either styled after`jq`, or Hylaeus quadratus

### Usage

hq reads html on standard-input and selects elements based on a query-selector.

```sh
hq <selector> [--all]
```

```sh
curl -sq "https://www.lipsum.com/feed/html" | hq p
```

### Files

```
  dist/                        compiled code, so people don't need to manually compile to test
  src/
```

### License

The MIT License

Copyright (c) 2020 Róisín Grannell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
