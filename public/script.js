async function abrirPluggy() {
    try {
      const res = await fetch('/connect-token');
      const data = await res.json();
  
      // Garantir que PluggyConnect está disponível
      if (!window.PluggyConnect) {
        throw new Error('PluggyConnect não carregado');
      }
  
      // CORREÇÃO: Use new PluggyConnect (e não PluggyConnect.init)
      const widget = new PluggyConnect({
        connectToken: data.connectToken,
        onSuccess: function (item) {
          document.getElementById('itemIdContainer').innerText = 'Item ID: ' + item.id;
          carregarTransacoes(item.id);
        },
        onError: function (err) {
          console.error('Erro ao conectar:', err);
        }
      });
      widget.open();
    } catch (e) {
      console.error('Erro ao abrir PluggyConnect:', e.message);
      alert('Não foi possível abrir o Pluggy Connect. Veja o console para detalhes.');
    }
  }
  
  async function carregarTransacoes(itemId) {
    try {
      const res = await fetch(`/transactions/${itemId}`);
      const data = await res.json();
      const transacoes = data.results;
  
      const tabela = document.getElementById('tabelaTransacoes');
      tabela.innerHTML = '<tr><th>Data</th><th>Descrição</th><th>Valor</th></tr>';
      const valores = {};
  
      transacoes.forEach(t => {
        tabela.innerHTML += `<tr><td>${t.date}</td><td>${t.description}</td><td>${t.amount}</td></tr>`;
        const data = t.date.split('T')[0];
        valores[data] = (valores[data] || 0) + t.amount;
      });
  
      const labels = Object.keys(valores);
      const dados = Object.values(valores);
  
      new Chart(document.getElementById('graficoTransacoes'), {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Fluxo de Caixa por Dia',
            data: dados
          }]
        }
      });
    } catch (err) {
      console.error('Erro ao carregar transações:', err.message);
      alert('Erro ao carregar transações.');
    }
  }
  