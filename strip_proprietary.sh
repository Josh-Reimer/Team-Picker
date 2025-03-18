#!/bin/bash

# Define the files to keep in the public repo
PUBLIC_FILES=("index.html" "app.js" "index.css")

# Remove proprietary code and its comment markers from the selected public files
for FILE in "${PUBLIC_FILES[@]}"; do
    if [[ -f "$FILE" ]]; then
        # Remove everything between PROPRIETARY CODE START and PROPRIETARY CODE END, including markers
        sed -i '/PROPRIETARY CODE START/,/PROPRIETARY CODE END/d' "$FILE"
    fi
done

# Delete all other files EXCEPT the ones listed above and preserve .git directory
find . -type f ! -name "index.html" ! -name "app.js" ! -name ".git*" ! -name "strip_proprietary.sh" -delete

echo "Proprietary code and markers removed. Only index.html + app.js retained for public release."
