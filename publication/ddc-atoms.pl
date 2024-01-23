#!/usr/bin/env perl
use v5.24;
use JSON::PP qw(encode_json decode_json);
use List::Util 'none';

# TODO: get 'ddc-frequencies.tsv' to calculate number of records;

sub lines {
    do { local (@ARGV) = $_[0]; <> }
}

binmode *STDOUT, "utf8";

# read known atoms and number of notations they are used in
my %atoms = map {
    my ( $atom, $numbers ) = split ",";
    ( $atom => { numbers => 1 * $numbers, records => 0 } )
} lines("ddc-atom-counts.csv");

# read number of records a composed notation is used in
my %frequencies = map { my ( $n, $c ) = split "\t"; ( $n => 1 * $c ) }
  lines("ddc-frequencies.tsv");

# read decomposition
open my $fh, "<", "ddc-decomposition.csv";
while (<$fh>) {
    chomp;
    my ( $composed, @parts ) = split ",";
    for (@parts) {
        $atoms{$_}->{records} += $frequencies{$composed};
    }
}

# TODO: add labels
say "atom,numbers,records";
for ( sort keys %atoms ) {
    my $a = $atoms{$_};
    say join "\t", $_, $a->{numbers}, $a->{records};
}
