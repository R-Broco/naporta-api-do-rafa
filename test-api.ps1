# ==========================================
# Script de Testes PowerShell - API naPorta
# ==========================================
# Como usar: Selecione e execute os blocos abaixo no seu terminal PowerShell.

$baseUrl = "http://localhost:3000/pedidos"

# 1. LOGIN
$authResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post
$headers = @{
    "Authorization" = "Bearer $($authResponse.access_token)"
    "Content-Type"  = "application/json"
}

# 2. CREATE
$bodyCreate = @{
    numero              = "PED-1005"
    dataPrevisaoEntrega = "2026-06-20T00:00:00Z"
    clienteNome         = "Joao da Silva"
    clienteDocumento    = "12345678909"
    enderecoEntrega     = "Rua Ficticia, 123"
} | ConvertTo-Json

Invoke-RestMethod -Uri $baseUrl -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($bodyCreate)) -ContentType "application/json; charset=utf-8"

# 3. UPDATE (Substitua a string abaixo pelo ID real gerado)
$idPedido = "COLOQUE_O_ID_AQUI"
$bodyUpdate = @{
    enderecoEntrega = "Avenida Principal, 456 - Novo Endereco"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$baseUrl/$idPedido" -Method Patch -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($bodyUpdate)) -ContentType "application/json; charset=utf-8"

# 4. SOFT DELETE
Invoke-RestMethod -Uri "$baseUrl/$idPedido" -Method Delete -Headers $headers

# 5. GET (Listagem e Filtros)
Invoke-RestMethod -Uri $baseUrl -Method Get -Headers $headers
Invoke-RestMethod -Uri "$baseUrl/$idPedido" -Method Get -Headers $headers

$numero = "PED-1005"
Invoke-RestMethod -Uri "${baseUrl}?numero=$numero" -Method Get -Headers $headers

# 6. GET LIXEIRA (Exclusão Lógica)
Invoke-RestMethod -Uri "${baseUrl}?excluidos=true" -Method Get -Headers $headers 
Invoke-RestMethod -Uri "${baseUrl}?excluidos=all" -Method Get -Headers $headers