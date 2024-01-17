ddc-frequencies.tsv: kxp-subjects.tsv.gz
	zcat $< | awk '$$2=="ddc"{print $$3}' | sort | uniq -c | awk '{print $$2"\t"$$1} > $@
	wc -l $@

ddc-atoms.tsv: ddc-decomposition.ndjson
	./ddc-summary.pl < $< | sort -nrk2 > $@
	wc -l $@
