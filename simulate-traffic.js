const API_URL = process.env.API_URL || 'https://naporta-api-do-rafa.onrender.com';

async function executeCycle(index) {
  try {
    // 1. LOGIN
    const loginRes = await fetch(`${API_URL}/auth/login`, { method: 'POST' });
    if (!loginRes.ok) throw new Error(`Status ${loginRes.status}`);
    const { access_token } = await loginRes.json();

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    };

    // 2. GET
    await fetch(`${API_URL}/pedidos`, { headers: authHeaders });

    // 3. POST
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const novoPedido = {
      numero: `PED-SYNTH-${randomId}`,
      dataPrevisaoEntrega: "2026-12-31T23:59:59Z",
      clienteNome: "SRE Synthetic Bot",
      clienteDocumento: "00011122233",
      enderecoEntrega: "Rota de Teste Automatizada, 000"
    };

    const createRes = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(novoPedido)
    });
    const createdData = await createRes.json();
    const pedidoId = createdData.id;

    // 4. PATCH & DELETE
    if (pedidoId) {
      await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ enderecoEntrega: "Avenida do Grafana, 999 - Atualizado" })
      });

      await fetch(`${API_URL}/pedidos/${pedidoId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
    }

    console.log(`[Iteração ${index}/30] ✅ Ciclo de tráfego concluído para ID: ${pedidoId || 'N/A'}`);
  } catch (error) {
    console.error(`[Iteração ${index}/30] ❌ Falha:`, error.message);
  }
}

async function runTrafficBurst() {
  console.log('🚀 Iniciando rajada sintética de tráfego (30 iterações)...');
  
  for (let i = 1; i <= 30; i++) {
    await executeCycle(i);
    // Pausa de 1 segundo entre requisições para espalhar no gráfico
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  console.log('🎯 Rajada concluída com sucesso!');
}

runTrafficBurst();
