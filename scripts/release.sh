#!/bin/bash

# Release script for Vanish AI
# Usage: ./scripts/release.sh [major|minor|patch]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current version from git tags
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
VERSION=${LATEST_TAG#v}
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# Determine bump type
BUMP_TYPE=${1:-patch}

case $BUMP_TYPE in
  major)
    MAJOR=$((MAJOR + 1))
    MINOR=0
    PATCH=0
    ;;
  minor)
    MINOR=$((MINOR + 1))
    PATCH=0
    ;;
  patch)
    PATCH=$((PATCH + 1))
    ;;
  *)
    echo -e "${RED}Error: Invalid bump type. Use: major, minor, or patch${NC}"
    exit 1
    ;;
esac

NEW_VERSION="v${MAJOR}.${MINOR}.${PATCH}"

echo -e "${GREEN}Current version: ${LATEST_TAG}${NC}"
echo -e "${GREEN}New version: ${NEW_VERSION}${NC}"

# Confirm
read -p "Create release ${NEW_VERSION}? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Release cancelled${NC}"
    exit 1
fi

# Check if working directory is clean
if [[ -n $(git status -s) ]]; then
    echo -e "${RED}Error: Working directory is not clean. Commit or stash changes first.${NC}"
    exit 1
fi

# Update version in package.json (frontend)
if [ -f "frontend/package.json" ]; then
    sed -i.bak "s/\"version\": \".*\"/\"version\": \"${MAJOR}.${MINOR}.${PATCH}\"/" frontend/package.json
    rm frontend/package.json.bak
    echo -e "${GREEN}Updated frontend/package.json${NC}"
fi

# Update CHANGELOG.md
CURRENT_DATE=$(date +%Y-%m-%d)
sed -i.bak "s/## \[Unreleased\]/## \[Unreleased\]\n\n## \[${MAJOR}.${MINOR}.${PATCH}\] - ${CURRENT_DATE}/" CHANGELOG.md
rm CHANGELOG.md.bak 2>/dev/null || true
echo -e "${GREEN}Updated CHANGELOG.md${NC}"

# Commit changes
git add frontend/package.json CHANGELOG.md
git commit -m "chore: bump version to ${NEW_VERSION}" || true

# Create tag
git tag -a "${NEW_VERSION}" -m "Release ${NEW_VERSION}"

echo -e "${GREEN}Created tag ${NEW_VERSION}${NC}"
echo -e "${YELLOW}Push with: git push origin main && git push origin ${NEW_VERSION}${NC}"

