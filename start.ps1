# Start Backend Server
Write-Host "Starting Drone Control Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\car with app\backend'; npm start"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Drone Control Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\car with app\frontend'; npm run dev"

# Wait a moment
Start-Sleep -Seconds 2

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "✓ Drone Control System Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "`nBackend:  http://localhost:3003" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3004" -ForegroundColor Cyan
Write-Host "`nNext Steps:" -ForegroundColor White
Write-Host "1. Open http://localhost:3004 in your browser"
Write-Host "2. Run the drone client:"
Write-Host "   cd drone-client"
Write-Host "   python drone_client.py --simulator"
Write-Host "`nPress any key to open the web app..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open browser
Start-Process "http://localhost:3004"
