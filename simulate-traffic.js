const API_URL = process.env.API_URL || 'https://naporta-api-do-rafa.onrender.com';

async function executeCycle(iteration) {
  try {
    // 1. AUTENTICAÇÃO (POST /auth/login)
    const loginRes = await fetch(`${API_URL}/auth/login`, { method: 'POST' });
    if (!loginRes.ok) throw new Error(`Status ${loginRes.status}`);
    const { access_token } = await loginRes.json();

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token}`
    };

    // 2. READ (GET /pedidos)
    await fetch(`${API_URL}/pedidos`, { headers: authHeaders });

    // 3. CREATE (POST /pedidos)
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

    // 4. UPDATE & DELETE (PATCH e DELETE /pedidos/:id)
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

    console.log(`[${new Date().toLocaleTimeString()}] ✅ Ciclo ${iteration} OK (ID: ${pedidoId || 'N/A'})`);
  } catch (error) {
    console.error(`[${new Date().toLocaleTimeString()}] ❌ Falha no ciclo ${iteration}:`, error.message);
  }
}

async function runContinuousTraffic() {
  console.log('🚀 Iniciando simulação contínua (Duração: 5 minutos com rajadas a cada 5s)...');
  const startTime = Date.now();
  const DURATION_MS = 5 * 60 * 1000; // 5 minutos de duração do runner
  let iteration = 1;

  while (Date.now() - startTime < DURATION_MS) {
    await executeCycle(iteration++);
    // Pausa de 5 segundos entre cada ciclo completo de CRUD para alimentar o Grafana continuamente
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  console.log('🎯 Ciclo de 5 minutos concluído com sucesso!');
}

runContinuousTraffic();
