#!/bin/bash

#
# Example:
#
# for f in fotos/dir/*.jpg; do ./srcset.sh "$f" >> htmlmarkup.html; done
#

filename="$1"
path="${filename%/*}"
file_with_ext="${filename##*/}"
file="${file_with_ext%.*}"
# Spaces would break the srcset attributes, so replace them in the output filenames
file="${file// /-}"

test ! -d "${path}/resized" && mkdir -p "${path}/resized"

# Convert the original image to webp format, capped at 2560px on the longest side to keep the repo small
magick "$filename" -strip -resize '2560x2560>' -quality 80 "${path}/resized/${file}.webp"

# Create resized versions of the image
for size in 320 640 768 1024 1366 1440 1600 1920; do
  magick "$filename" -strip -adaptive-resize "$size" "${path}/resized/${file}-${size}w.webp"
done

# Generate HTML markup for the image with srcset
echo "<figure class=\"col-12 col-md-4\">"
echo "  <a href=\"resized/${file}.webp\" data-pswp-srcset=\""
for size in 320 640 768 1024 1366 1440 1600 1920; do
  echo "    resized/${file}-${size}w.webp ${size}w,"
done
echo "  \" $(magick identify -format 'data-pswp-width=\"%w\" data-pswp-height=\"%h\"' "$filename") target=\"_blank\">"
echo "    <img class=\"figure-img img-thumbnail\" alt=\"\" loading=\"lazy\" src=\"resized/${file}-640w.webp\" />"
echo "  </a>"
echo "  <figcaption>Lorem ipsum</figcaption>"
echo "</figure>"
