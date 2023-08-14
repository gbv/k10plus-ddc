# K10plus DDC

This repository contains scripts to analyze, convert and publish Dewey Decimal Classification (DDC) numbers found K10plus catalog. The analysis is mainly based on [coli-ana].

[coli-ana]: https://github.com/gbv/coli-ana

## Overview

The repository contains the following command line scripts:

- `analyze.js` - read a list of (numerically sorted) DDC numbers and generate analysis with coli-ana 
- `count.js` - calculate frequency of individual DDC elements in analysis result and emit as CSV or JSKOS concept list

## See Also

- [coli-ana] API to analyze DDC numbers
- [K10plus Subjects](https://github.com/gbv/k10plus-subjects) to analyze, extract and publish subject indexing data (including DDC but also other systems) from K10plus

