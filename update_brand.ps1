$root = "c:\Users\WIN10\Desktop\KIMI CODE\forged-by-fire-master-from-zip\forged-by-fire-master"
$logoSource = "c:\Users\WIN10\Desktop\KIMI CODE\FORGED CARBON LOGO.JPG"
$logoDest = Join-Path $root "images\forged-carbon-logo.jpg"
Copy-Item -Path $logoSource -Destination $logoDest -Force
Get-ChildItem -Path $root -Filter '*.html' | ForEach-Object {
    $filePath = $_.FullName
    $text = Get-Content -Path $filePath -Raw
    $text = $text -replace 'Forged <span>by Fire</span>', 'Forged Carbon'
    $text = $text -replace 'Forged <em>by Fire</em>', 'Forged Carbon'
    $text = $text -replace 'Forged by Fire Pty Ltd', 'Forged Carbon Pty Ltd'
    $text = $text -replace 'Forged by Fire', 'Forged Carbon'
    $text = $text -replace 'forgedbyfire.com.au', 'forgedcarbon.com.au'
    $text = $text -replace '<a href="#" class="nav__brand">Forged Carbon</a>', '<a href="#" class="nav__brand"><img src="images/forged-carbon-logo.jpg" alt="Forged Carbon"></a>'
    $text = $text -replace '<a href="index.html" class="nav__brand">Forged Carbon</a>', '<a href="index.html" class="nav__brand"><img src="images/forged-carbon-logo.jpg" alt="Forged Carbon"></a>'
    $text = $text -replace '<a href="index.html" class="footer__brand">Forged Carbon</a>', '<a href="index.html" class="footer__brand"><img src="images/forged-carbon-logo.jpg" alt="Forged Carbon"></a>'
    if ($text -ne (Get-Content -Path $filePath -Raw)) {
        Set-Content -Path $filePath -Value $text -Encoding utf8
        Write-Output "updated $($_.Name)"
    }
}
Write-Output 'done'