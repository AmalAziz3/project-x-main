#!/bin/bash

# Navigate to the frontend directory
cd frontend

# Find all JavaScript files and replace '../layout/BaseLayout' with '../Layout/BaseLayout'
find src -type f -name "*.js" -exec sed -i 's/\.\.\/layout\/BaseLayout/\.\.\/Layout\/BaseLayout/g' {} \;

# Find all JavaScript files and replace '../layout/Header' with '../Layout/Header'
find src -type f -name "*.js" -exec sed -i 's/\.\.\/layout\/Header/\.\.\/Layout\/Header/g' {} \;

# Find all JavaScript files and replace '../layout/Layout' with '../Layout/Layout'
find src -type f -name "*.js" -exec sed -i 's/\.\.\/layout\/Layout/\.\.\/Layout\/Layout/g' {} \;

echo "Import paths fixed!" 