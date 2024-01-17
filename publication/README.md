# DDC in K10plus

This dataset contains an analysis of DDC notations in K10plus union catalogue.

The analysis is based on

- Normalized subject indexing data of K10plus library union catalog
  <https://doi.org/10.5281/zenodo.7016625>

- Decomposition of DDC numbers ([coli-ana](https://coli-conc.gbv.de/coli-ana/))

The dataset was consists of:

- `ddc-frequencies.tsv`: sorted DDC notations found in K10plus records, each with number of records it is used in

Atomic DDC elements from decomposition (`ddc-atoms.tsv`):
Only atoms from fully decomposed numbers are included.

    TODO: <ddc-decomposition.ndjson ./ddc-summary.pl | sort -nrk2 > ddc-atoms.tsv

