#!/bin/bash

# Generate release notes from git commits
# Usage: ./scripts/generate-release-notes.sh [from-tag] [to-tag]

set -e

FROM_TAG=${1:-$(git describe --tags --abbrev=0 2>/dev/null || echo "")}
TO_TAG=${2:-HEAD}

if [ -z "$FROM_TAG" ]; then
    echo "No previous tag found. Generating notes from initial commit."
    COMMITS=$(git log --pretty=format:"%s" --no-merges)
else
    COMMITS=$(git log ${FROM_TAG}..${TO_TAG} --pretty=format:"%s" --no-merges)
fi

echo "# Release Notes"
echo ""
echo "## Changes"
echo ""

# Categorize commits
FEATURES=$(echo "$COMMITS" | grep -E "^(feat|feature)" || true)
FIXES=$(echo "$COMMITS" | grep -E "^(fix|bugfix)" || true)
DOCS=$(echo "$COMMITS" | grep -E "^(docs)" || true)
PERF=$(echo "$COMMITS" | grep -E "^(perf)" || true)
REFACTOR=$(echo "$COMMITS" | grep -E "^(refactor)" || true)
OTHER=$(echo "$COMMITS" | grep -vE "^(feat|feature|fix|bugfix|docs|perf|refactor)" || true)

if [ -n "$FEATURES" ]; then
    echo "### ✨ Features"
    echo "$FEATURES" | sed 's/^/- /'
    echo ""
fi

if [ -n "$FIXES" ]; then
    echo "### 🐛 Bug Fixes"
    echo "$FIXES" | sed 's/^/- /'
    echo ""
fi

if [ -n "$PERF" ]; then
    echo "### ⚡ Performance"
    echo "$PERF" | sed 's/^/- /'
    echo ""
fi

if [ -n "$REFACTOR" ]; then
    echo "### 🔧 Refactoring"
    echo "$REFACTOR" | sed 's/^/- /'
    echo ""
fi

if [ -n "$DOCS" ]; then
    echo "### 📚 Documentation"
    echo "$DOCS" | sed 's/^/- /'
    echo ""
fi

if [ -n "$OTHER" ]; then
    echo "### 📝 Other Changes"
    echo "$OTHER" | sed 's/^/- /'
    echo ""
fi

