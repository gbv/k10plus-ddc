# K10plus DDC

This repository contains scripts to analyze, convert and publish Dewey Decimal Classification (DDC) numbers found K10plus catalogue. The analysis is mainly based on [coli-ana] DDC number decomposition.

[coli-ana]: https://github.com/gbv/coli-ana
[K10plus Subjects]: https://github.com/gbv/k10plus-subjects
[jskos]: https://format.gbv.de/jskos

## Installation

~~~sh
npm ci
~~~

## Usage

The script `bin/k10plus-patch.js`

1. reads PICA+ records (or PPNs to retrieve records from K10plus)
2. extracts DDC fields from the records
3. retrieves DDC analysis (cached in a local database)
4. and emits [PICA Patch](https://format.gbv.de/pica/patch/specification) files to modify records

~~~
Usage: k10plus-patch [options] < file

Check and extend DDC numbers in PICA records of K10plus catalogue

Options:
  -a, --api <URL>        coli-ana API endpoint
  -c, --continue <ppn>   continue after given PPN (expect sorted)
  -f, --format <name>    PICA+ serialization (default: plain)
  -i, --input <file>     input file (default: - for STDIN)
  -d, --database <file>  optional SQLite file for caching
  -p, --ppns             input is list of PPNs instead of PICA records
  -h, --help             display help for command
~~~

### simplify-for-pdf.jq

    sqlite3 cache.sqlite 'select analysis from coliana' | jq -f simplify-for-pdf.jq -c | sort | uniq

### analyze.js

- `analyze.js` - read a list of (numerically sorted) DDC numbers and generate analysis with coli-ana 
- `count.js` - calculate frequency of individual DDC elements in analysis result and emit as CSV or JSKOS concept list

## Data in this repository

- `ddcs` sorted DDC numbers found in K10plus with number of occurrences. Data generated from [K10plus Subjects].

## See Also

- [coli-ana] API to analyze DDC numbers
- [K10plus Subjects] to analyze, extract and publish subject indexing data (including DDC but also other systems) from K10plus

