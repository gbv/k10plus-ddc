#!/usr/bin/env perl
use v5.24;
use JSON::PP 'decode_json';
use List::Util 'none';

# TODO: get 'ddc-frequencies.tsv' to calculate number of records;

binmode *STDOUT, "utf8";

my %row;

while (<>) {
    my $ddc     = decode_json($_);
    my $members = $ddc->{memberList};
    if ( none { !$_ } @$members ) {
        my @atoms = grep { $_->{ATOMIC} } @$members;

        #my $notation = $ddc->{notation}[0];
        for (@atoms) {
            my $n = $_->{notation}[0];
            $row{$n} //= { numbers => 0, records => 0 };
            $row{$n}->{numbers}++;
            $row{$n}->{label} = ( $_->{prefLabel}{de} =~ s/\s+/ /gr );

            # TODO: number of records
        }

    }
}

say "atom,numbers,records,label";
for ( sort keys %row ) {
    my $r = $row{$_};
    say join "\t", $_, $r->{numbers}, $r->{records}, $r->{label};
}
