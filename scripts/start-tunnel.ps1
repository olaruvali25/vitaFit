# PowerShell script to start cloudflared tunnel for Make.com webhook
# This exposes your localhost:3000 to the internet so Make.com can call it

Write-Host "Starting cloudflared tunnel..." -ForegroundColor Green
Write-Host "Your local server will be accessible from the internet" -ForegroundColor Yellow
Write-Host ""

# Start cloudflared tunnel pointing to localhost:3000
# The --url flag makes it a quick tunnel (no login needed)
cloudflared tunnel --url http://localhost:3000

