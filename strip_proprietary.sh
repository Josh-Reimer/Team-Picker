#!/bin/bash

# Define the files to keep in the public repo
PUBLIC_FILES=("index.html" "app.js" "index.css" ".gitignore")

# Remove proprietary code and public code comment markers from the selected public files
for FILE in "${PUBLIC_FILES[@]}"; do
    if [[ -f "$FILE" ]]; then
        # Remove everything between PROPRIETARY CODE START and PROPRIETARY CODE END, including markers
        sed -i '/PROPRIETARY CODE START/,/PROPRIETARY CODE END/d' "$FILE"
        
        # Remove public code markers as well
        sed -i '/PUBLIC CODE START/d' "$FILE"
        sed -i '/PUBLIC CODE END/d' "$FILE"
    fi
done

# Delete all other files EXCEPT the ones listed above and preserve .git directory
find . -type f \
    ! -name "index.html" \
    ! -name "app.js" \
    ! -name "index.css" \
    ! -name ".gitignore" \
    ! -name "strip_proprietary.sh" \
    ! -path "./.git/*" \
    -delete

# Delete the images folder and its contents
rm -rf images

# Delete the .vscode folder and its contents
rm -rf .vscode

echo "Proprietary and public code markers removed. Only index.html, app.js, index.css, and .gitignore retained. .git preserved. Images and .vscode folders deleted."
