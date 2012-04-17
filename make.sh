#!/bin/sh

rm cell-0.*.min.js

cat src/base.js > all.js
cat src/event.js >> all.js
cat src/container.js >> all.js
cat src/cell.js >> all.js

jsmin < all.js > cell-0.2.min.js

rm all.js