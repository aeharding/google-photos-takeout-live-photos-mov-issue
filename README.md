# Google Photos Takeout for Live Photo `(1)` issue fixer

Google Photos sometimes breaks exports by making the {file}.HEVC/JPG + {file}.MOV files into {file}.HEVC/JPG + (1).HEVC/JPG (even though it _should_ be .MOV).

This detects these descrepancies and renames file file to a MOV file, if it's actually a MOV file (and some other checks, like there's an accompanying HEVC/JPG photo).

You will need to modify the PATH as appropriate. I have it set to my Synology Moments directory. This is just a quick hack to fix my photos.

## Disclaimer

1.  Have a backup!
2.  Understand the code _before_ you run it!
