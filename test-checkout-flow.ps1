# Script de prueba end-to-end para el flujo de checkout
# Prueba 1: Usuario sin loguear (crear customer)
# Prueba 2: Usuario logueado (obtener customer existente)

$baseUrl = "http://localhost:3000/api"

Write-Host "=== PRUEBA 1: Usuario SIN loguear - Crear Customer ===" -ForegroundColor Cyan
Write-Host ""

$customerData = @{
    first_name = "Test"
    last_name = "User"
    email = "test@example.com"
    phone = "1234567890"
    address = "Test Address 123"
    city = "Test City"
    country = "Colombia"
    birth_date = "1990-01-01"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/customers" `
        -Method POST `
        -Body $customerData `
        -ContentType "application/json"
    
    Write-Host "✓ Customer creado exitosamente" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $response | ConvertTo-Json -Depth 5
    Write-Host ""
} catch {
    Write-Host "✗ Error al crear customer:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== PRUEBA 2: Usuario logueado - Obtener Customer ===" -ForegroundColor Cyan
Write-Host ""

# Primero hacer login
Write-Host "1. Haciendo login..." -ForegroundColor Yellow
$loginData = @{
    email = "juan.perez@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/json"
    
    $token = $loginResponse.data.token
    Write-Host "✓ Login exitoso. Token obtenido." -ForegroundColor Green
    Write-Host ""
    
    # Ahora obtener customer con token
    Write-Host "2. Obteniendo customer del usuario logueado..." -ForegroundColor Yellow
    
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    
    $customerResponse = Invoke-RestMethod -Uri "$baseUrl/customers/by-user" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✓ Customer obtenido exitosamente" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Yellow
    $customerResponse | ConvertTo-Json -Depth 5
    Write-Host ""
    
} catch {
    Write-Host "✗ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host $_.ErrorDetails.Message -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "=== PRUEBA 3: Usuario logueado SIN customer - Debe retornar null ===" -ForegroundColor Cyan
Write-Host ""

# Intentar obtener customer de un usuario que no tiene customer
Write-Host "Nota: Esta prueba requiere un usuario que no tenga customer asociado" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== Pruebas completadas ===" -ForegroundColor Green
