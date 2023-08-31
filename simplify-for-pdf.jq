# Usage: jq -f simplify-for-pdf.jq < results.ndjson
{
  notation: .notation[0],
  rows: [
    .memberList[] | select(.ATOMIC) |
    .notation[0] as $notation |
    {
      $notation,
      zeroes: ($notation|length|if . < 3 then (3-.|"0"*.) else "" end), 
      label: .prefLabel.de,
    }
  ]
}
