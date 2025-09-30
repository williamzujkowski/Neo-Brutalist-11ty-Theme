#!/bin/bash
set -e

echo "🔍 Verifying NPM Package Configuration..."

# Clean previous builds
rm -f *.tgz

# Create tarball
echo "📦 Creating test package..."
npm pack

# Extract tarball name
TARBALL=$(ls *.tgz)
echo "✅ Created: $TARBALL"

# Check size
SIZE=$(du -h "$TARBALL" | cut -f1)
echo "📊 Package size: $SIZE"

# List contents summary
echo "📋 Package contents (first 20 files):"
tar -tzf "$TARBALL" | head -20

# Check for unwanted files
echo ""
echo "🚫 Checking for unwanted files..."
UNWANTED=$(tar -tzf "$TARBALL" | grep -E "(\.claude/|tests/|\.github/|\.swarm/|\.hive-mind/|memory/|coordination/|PROGRESS\.md|TESTING\.md|CLAUDE\.md|swarm-prompt\.md)" || true)

if [ -z "$UNWANTED" ]; then
    echo "✅ No unwanted files found"
else
    echo "❌ Found unwanted files:"
    echo "$UNWANTED"
    rm -f "$TARBALL"
    exit 1
fi

# Check for required files
echo ""
echo "✅ Checking for required files..."
REQUIRED_FILES=(
    "package/.eleventy.js"
    "package/README.md"
    "package/LICENSE"
    "package/example/README.md"
    "package/src/_includes/layouts/base.njk"
    "package/src/assets/css/main.css"
    "package/src/assets/js/main.js"
)

ALL_FOUND=true
for file in "${REQUIRED_FILES[@]}"; do
    if tar -tzf "$TARBALL" | grep -q "$file"; then
        echo "  ✅ $file"
    else
        echo "  ❌ Missing: $file"
        ALL_FOUND=false
    fi
done

if [ "$ALL_FOUND" = false ]; then
    rm -f "$TARBALL"
    exit 1
fi

# Get package stats
echo ""
echo "📊 Package Statistics:"
FILE_COUNT=$(tar -tzf "$TARBALL" | wc -l)
echo "  Total files: $FILE_COUNT"
echo "  Compressed size: $SIZE"

# Show largest files
echo ""
echo "📈 Largest files in package:"
tar -xzf "$TARBALL"
cd package
find . -type f -exec du -h {} \; | sort -rh | head -10
cd ..
rm -rf package

echo ""
echo "🎉 Package verification complete!"
echo ""
echo "To publish: npm publish $TARBALL"