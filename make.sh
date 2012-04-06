#!/bin/sh

cat base.js > all.js
cat event.js >> all.js
cat cell.js >> all.js

jsmin < all.js > cell-0.1.min.js

rm all.js