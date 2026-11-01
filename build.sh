#!/usr/bin/env bash
# Builds dist/inkline-<version>.zip for the Chrome Web Store upload.
set -euo pipefail
cd "$(dirname "$0")"

node test/styles.test.js

version=$(node -p "require('./manifest.json').version")
out="dist/inkline-$version.zip"
mkdir -p dist
rm -f "$out"
zip -q -r "$out" manifest.json styles.js content.js content.css background.js popup.html popup.js popup.css icons
unzip -l "$out"
echo "Built $out"
