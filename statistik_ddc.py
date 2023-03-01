import sys
import requests
import csv
import time
#import concurrent.futures
from itertools import islice

def zerlegung(x):
    global keine_vollständige_zerlegung_möglich
    par = {'notation': x[0]}
    r = requests.get('https://coli-conc.gbv.de/coli-ana/app/analyze', params=par)
    j = 0
    temp = []
    notations = {}
    
    for k in range(5):
        try:
            len(r.json()) > 0 == True
        except requests.exceptions.RequestException:
            print("Abfrage gescheitert. Versuche es in 5 Minuten noch einmal")
            time.sleep(320)

    for element in r.json()[0]['memberList']:
        j += 1
        if element is None:
            if bool(len(temp) > 0):
                notations[temp[0]['notation'][0]] = x[1]
                keine_vollständige_zerlegung_möglich += 1
                break
            else:
                keine_vollständige_zerlegung_möglich += 1
                break
        elif j == len(r.json()[0]['memberList']):
            notations[element['notation'][0]] = x[1]
            if bool(temp) and bool(temp[0].get('broader')) and not bool(element.get('broader')):
                notations[temp[0]['notation'][0]] = x[1]
        elif bool(temp) and bool(temp[0].get('broader')) and not bool(element.get('broader')):
            notations[temp[0]['notation'][0]] = x[1]
            temp = []
        else:
            temp = []
            temp.append(element)

    return notations

ergebnis = {}

try:
    input_file = sys.argv[1]
except:
    input_file = input("Bitte Input-File angeben: ")

with open(input_file, "r") as ddcs:
    count = csv.reader(ddcs, delimiter="\t")
    ddcs_list = [[line[0].strip(), int(line[1].strip())] for line in count]

#Testliste
#    ddcs_list_klein = []
#    for item in islice(ddcs_list, 0, 4):
#        ddcs_list_klein.append(item)

    zeilen = len(ddcs_list)
    i = 0
    start = time.time()
    duration_gesamt = 0
    keine_vollständige_zerlegung_möglich = 0

    def progress(percent=0, dur=0, e=0, width=40):
        left = width * percent // 100
        right = width - left
        
        tags = "#" * left
        spaces = " " * right
        percents = f"{percent:.0f}%"
        
        print("\r[", tags, spaces, "]", percents, int(dur/60), "Min. vergangen", int(e/60), "Min. übrig", keine_vollständige_zerlegung_möglich, sep=" ", end="", flush=True)

    def handle_result(h):
        for m, n in h.items():
            if m not in ergebnis:
                ergebnis[m] = n
            else:
                ergebnis[m] += n

# Methode für mehrere Anfragen gleichzeitig. Getestet mit max. 2   
# with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
#        for result in executor.map(zerlegung, ddcs_list):
#            i += 1

    for line in ddcs_list:
        result = zerlegung(line)
        i += 1
        if i % 10 == 0:
                end = time.time()
                duration = end - start
                duration_gesamt += duration
                eta = ((zeilen - i) / 10) * duration
                per = int(((i / zeilen) * 100))
                progress(per, duration_gesamt, eta)
                start = time.time()
                if result != None:
                    handle_result(result)
        elif result != None:
            handle_result(result)


with open("ergebnis.csv", "w") as erg:
    erg.write("%s,%s\n"%("Keine vollständige Zerlegung möglich",keine_vollständige_zerlegung_möglich))
    for key in ergebnis.keys():
            erg.write("%s,%s\n"%(key,ergebnis[key]))