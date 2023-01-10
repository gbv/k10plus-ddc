#!/bin/bash

#Zeilen mit DDC filtern
grep ddc clean_subjects.tsv > ddc.tsv

#Notationen filtern und zählen
awk '{print $3}' ddc.tsv | egrep -e "^[0-9]{3}[.][0-9]{2,}$" | sort | uniq -c | sed -e 's/^ *//;s/ /,/' | awk -F ',' '{print $2,"\t",$1}' > ddcs