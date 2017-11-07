#!/usr/bin/perl

print "Installing OVID\n";


my $files = `find setup -type f`;

if (!$files) { 
	print "\n\nNo setup directory found... go to root directory\n\n";
	exit;
}

foreach my $f (split "\n", $files) {
	if ($f =~ /(.+)\//) {
		if (!grep /$1/, @dirs) {
			push(@dirs, $1);
		}
		## print "-> $f\n";
	}

	$f=~s/setup\/+//;
	my $checkdiff = "diff setup/$f ./../../../$f\n";
	my $diff = `$checkdiff`;
	
	if ($diff) {
		print "*"x length($checkdiff);
		print "\n** $f differs: (< : setup/) **\n";
		print "*"x length($checkdiff);
		print "\n$diff\n\n";
	}
}

print "\nDirectories:\n" . @dirs.join("\n");


