#!/bin/bash

filename="$1"
path="${filename%/*}"
file_with_ext="${filename##*/}"
file="${file_with_ext%.*}"
prefix="${path}/resized/${file}"
type=webp

test ! -d "${path}/resized" && mkdir -p "${path}/resized"

convert "$filename" -strip "${prefix}.${type}"

for size in 320 640 768 1024 1366 1440 1600 1920; do
  convert "$filename" -strip -adaptive-resize "$size" "${prefix}-${size}w.${type}"
done

echo "<figure class=\"col-12 col-md-4\">"
echo "  <a href=\"${prefix}.${type}\" data-pswp-srcset=\""
for size in 320 640 768 1024 1366 1440 1600 1920; do
  echo "    ${prefix}-${size}w.${type} ${size}w,"
done
echo "  \" $(identify -format 'data-pswp-width=\"%w\" data-pswp-height=\"%h\"' ${prefix}.${type}) target=\"_blank\">"
echo "    <img class=\"figure-img img-thumbnail\" src=\"${prefix}-768w.${type}\" />"
echo "  </a>"
echo "  <figcaption>Lorem ipsum</figcaption>"
echo "</figure>"
