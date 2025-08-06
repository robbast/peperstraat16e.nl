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

test ! -d "${path}/resized" && mkdir -p "${path}/resized"

# Convert the original image to webp format
convert "$filename" -strip "${path}/resized/${file}.webp"

# Create resized versions of the image
for size in 320 640 768 1024 1366 1440 1600 1920; do
  convert "$filename" -strip -adaptive-resize "$size" "${path}/resized/${file}-${size}w.webp"
done

# Generate HTML markup for the image with srcset
echo "<figure class=\"col-12 col-md-4\">"
echo "  <a href=\"resized/${file}.webp\" data-pswp-srcset=\""
for size in 320 640 768 1024 1366 1440 1600 1920; do
  echo "    resized/${file}-${size}w.webp ${size}w,"
done
echo "  \" $(identify -format 'data-pswp-width=\"%w\" data-pswp-height=\"%h\"' "${path}/resized/${file}.webp") target=\"_blank\">"
echo "    <img class=\"figure-img img-thumbnail\" src=\"${path}/resized/${file}-768w.webp\" />"
echo "  </a>"
echo "  <figcaption>Lorem ipsum</figcaption>"
echo "</figure>"
