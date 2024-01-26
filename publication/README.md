# Analysis of DDC numbers in K10plus union catalogue

<https://doi.org/10.5281/zenodo.10569321>

This dataset contains an analysis of DDC notations in K10plus union catalogue (as of 2023-12-31).

## Sources

The data is based on:

- [Normalized subject indexing data of K10plus library union catalog](https://doi.org/10.5281/zenodo.7016625)

- [Decomposition of DDC numbers (coli-ana)](https://coli-conc.gbv.de/coli-ana/)

## Resources

The dataset consists of:

- `ddc-frequencies.tsv`: sorted DDC notations found in K10plus records, each with number of records it is used in (tsv format)

- `ddc-decomposition.ndjson.gz`: full analysis of DDC notations in newline-delimited JSKOS (including incomplete analysis and non-atomic elements) (jskos format)

- `ddc-decomposition.csv`: atomic DDC elements from decomposition. First column is original number, following columns are atomic elements (csv format)

- `ddc-atoms.tsv`: atomic DDC numbers found in fully decomposed numbers of K10plus catalogue (tsv format)

  With the following fields:

  - `atom`: atomic DDC number which cannot be decomposed further

  - `number`: number of distinct DDC numbers this atom is used in

  - `records`: number of K10plus records this atom is used in


## Contributors

- [Verbundzentrale des GBV (VZG)](https://ror.org/048vdhs48) (publisher)

- [Jakob Voß](https://orcid.org/0000-0002-7613-4123) (maintainer)

- [Ulrike Reiner](http://www.wikidata.org/entity/Q101436909) (contributor)


## License

- [Creative Commons Zero v1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) (CC0)


