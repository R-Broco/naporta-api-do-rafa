const API_URL = process.env.API_URL || 'https://naporta-api-do-rafa.onrender.com';

async function runSimulation() {
  console.log('🚀 [SRE] Iniciando ciclo de tráfego sintético...');

  try {
    // 1. LOGIN (POST direto sem body, conforme o teste do PowerShell)
    console.log('🔑 Solicitando Bearer Token...');
    const loginRes = await fetch(`${API_URL}/auth/login`, { method: 'POST' });

    if (!loginRes.ok) {
      throw new Error(`Erro na autenticação: Status ${loginRes.status}`);
    }

    const { access_token } = await loginRes.json();
    console.log('✅ Token JWT obtido!');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    };

    // 2. LISTAGEM INICIAL (GET /pedidos)
    console.log('🔍 Executando GET /pedidos...');
    await fetch(`${API_URL}/pedidos`, { headers: authHeaders });

    // 3. CRIAÇÃO (POST /pedidos com número dinâmico para não conflitar)
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const novoPedido = {
      numero: `PED-SYNTH-${randomId}`,
      dataPrevisaoEntrega: "2026-12-31T23:59:59Z",
      clienteNome: "SRE Synthetic Bot",
      clienteDocumento: "00011122233",
      enderecoEntrega: "Rota de Teste Automatizada, 000"
    };

    console.log(`📦 Criando pedido ${novoPedido.numero}...`);
    const createRes = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(novoPedido)
    });

    const createdData = await createRes.json();
    const pedidoId = createdData.id;
    console.log(`✅ Pedido criado com sucesso! ID: ${pedidoId}`);

    // 4. ATUALIZAÇÃO (PATCH /pedidos/:id)
    if (pedidoId) {
      console.log(`✏️ Atualizando endereço do pedido ${pedidoId}...`);
      await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ enderecoEntrega: "Avenida do Grafana, 999 - Atualizado" })
      });

      // 5. EXCLUSÃO LÓGICA (DELETE /pedidos/:id)
      console.log(`🗑️ Aplicando soft-delete no pedido ${pedidoId}...`);
      const deleteRes = await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      console.log(`✅ Exclusão lógica finalizada com status ${deleteRes.status}`);
    }

    console.log('🎯 Simulação concluída com sucesso! Métricas geradas no Grafana.');

  } catch (error) {
    console.error('❌ Falha na simulação:', error.message);
    process.exit(1);
  }
}

runSimulation();
