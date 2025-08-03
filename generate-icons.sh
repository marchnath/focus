#!/bin/bash

# Create different sized icons for PWA
# This script requires ImageMagick to be installed
# Install with: brew install imagemagick

INPUT_ICON="public/icons100.png"
OUTPUT_DIR="public"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it with:"
    echo "brew install imagemagick"
    exit 1
fi

# Check if input icon exists
if [ ! -f "$INPUT_ICON" ]; then
    echo "Input icon $INPUT_ICON not found!"
    exit 1
fi

echo "Generating PWA icons..."

# Generate different sizes
convert "$INPUT_ICON" -resize 192x192 "$OUTPUT_DIR/icon-192.png"
convert "$INPUT_ICON" -resize 512x512 "$OUTPUT_DIR/icon-512.png"
convert "$INPUT_ICON" -resize 180x180 "$OUTPUT_DIR/apple-touch-icon.png"

echo "Icons generated successfully:"
echo "- icon-192.png (192x192)"
echo "- icon-512.png (512x512)"
echo "- apple-touch-icon.png (180x180)"
echo ""
echo "Update your manifest.json to use these new icons."
