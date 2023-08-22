# K10plus DDC

This repository contains scripts to analyze, convert and publish Dewey Decimal Classification (DDC) numbers found K10plus catalog. The analysis is mainly based on [coli-ana] DDC number decomposition.

[coli-ana]: https://github.com/gbv/coli-ana
[K10plus Subjects]: https://github.com/gbv/k10plus-subjects
[jskos]: https://format.gbv.de/jskos

## Usage

### Installation

~~~sh
npm ci
~~~

### bin/k10plus-patch.js

This script reads PICA+ records or PPNs, extracts DDC fields, retrieves DDC
analysis and emits PICA Patch files to insert result into the records.

### analyze.js

- `analyze.js` - read a list of (numerically sorted) DDC numbers and generate analysis with coli-ana 
- `count.js` - calculate frequency of individual DDC elements in analysis result and emit as CSV or JSKOS concept list

## Data in this repository

- `ddcs` sorted DDC numbers found in K10plus with number of occurrences. Data generated from [K10plus Subjects].

## See Also

- [coli-ana] API to analyze DDC numbers
- [K10plus Subjects] to analyze, extract and publish subject indexing data (including DDC but also other systems) from K10plus

