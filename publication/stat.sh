#!/usr/bin/bash

distinct=$(<ddc-frequencies.tsv wc -l)
decomposed=$(<ddc-decomposition.csv wc -l)
atoms=$(<ddc-atoms.tsv wc -l)

echo "Distinct DDC numbers found in K10plus: $distinct"
echo "Fully decomposed: $decomposed ($(echo "100*$decomposed/$distinct" | bc)%)"
echo "Distinct atomic elements: $atoms"

