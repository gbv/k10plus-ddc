all: ddc-decomposition.ndjson.gz ddc-decomposition.csv ddc-atoms.csv

#ddc-frequencies.tsv: kxp-subjects.tsv.gz
#	zcat $< | awk '$$2=="ddc"{print $$3}' | sort | uniq -c | awk '{print $$2"\t"$$1} > $@
#	wc -l $@

ddc-decomposition.csv: ddc-decomposition.ndjson
	jq -r '.notation[0] as $$n|.memberList|select(map(.==null)|any|not)|[$$n]+[.[]|select(.ATOMIC)|.notation[0]|select(.!="")]|select(length>1)|join(",")' < $< > $@
	wc -l $@

ddc-decomposition.ndjson.gz: ddc-decomposition.ndjson
	gzip < $< > $@
	ls -lah ddc-decomposition.ndjson.gz

ddc-atom-counts.csv: ddc-decomposition.csv
	sed 's/[^,]\+,//;s/,/\n/g' $< | sort | uniq -c | awk '{print $$2","$$1}' > $@
	wc -l $@

ddc-atoms.tsv: ddc-frequencies.tsv ddc-decomposition.csv ddc-atom-counts.csv
	./ddc-atoms.pl | sort -rnk3 > $@
	wc -l $@

README.md: datapackage.json
	ejs-cli -O $< datapackage2md.ejs > tmp && mv tmp $@
