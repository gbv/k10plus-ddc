/**
 * Build a PICA record with analyzed DDC number fields.
 *
 * See https://format.k10plus.de/k10plushelp.pl?cmd=kat&val=5400&katalog=Standard.
 */
export function picaFromDDC(concept) {

  // include atomic members only
  const members = (concept.memberList || []).filter(({ATOMIC}) => ATOMIC)

  // skip incomplete or unknown decomposition
  if (members.includes(null) || members.length === 0) {
    return
  }

  // assumes we always have 23rd edition
  const pica = ["045H", "20", "e", "23", "a", concept.notation[0]]

  const subfields = {
    T1: "f",
    T2: "g",
    T3A: "h",
    T3B: "i",
    T3C: "j",
    T4: "k",
    T5: "l",
    T6: "m",
  }

  pica.push("c", members[0].notation[0]) // base number

  for (let i=1; i<members.length; i++) {
    const notation = members[i].notation[0]
    const [ table, number ] = notation.split("--")
    const code = subfields[table]
    if (code) { // notation from table
      pica.push(code, number.replace(/^.+:/,"")) // map internal number within range to specific notation
    } else {  // notation from main schedule
      pica.push("d", notation)
    }
  }

  // TODO: make sure non-repeatable fields are not repeated?

  pica.push("A", "coli-ana")

  return pica
}
