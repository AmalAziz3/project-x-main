# Navigate to the frontend directory
cd frontend

# Get all JavaScript files
$files = Get-ChildItem -Path "src" -Filter "*.js" -Recurse

# Replace '../layout/BaseLayout' with '../Layout/BaseLayout'
foreach ($file in $files) {
    (Get-Content $file.FullName) | 
    ForEach-Object { $_ -replace '../layout/BaseLayout', '../Layout/BaseLayout' } |
    Set-Content $file.FullName
}

# Replace '../layout/Header' with '../Layout/Header'
foreach ($file in $files) {
    (Get-Content $file.FullName) | 
    ForEach-Object { $_ -replace '../layout/Header', '../Layout/Header' } |
    Set-Content $file.FullName
}

# Replace '../layout/Layout' with '../Layout/Layout'
foreach ($file in $files) {
    (Get-Content $file.FullName) | 
    ForEach-Object { $_ -replace '../layout/Layout', '../Layout/Layout' } |
    Set-Content $file.FullName
}

Write-Host "Import paths fixed!" 