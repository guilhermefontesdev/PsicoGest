(async()=>{
 const d=await request('/api/relatorios/dashboard');
 indicadores.innerHTML=`<tr><th>Pacientes</th><td>${d.pacientes}</td></tr><tr><th>Sessões</th><td>${d.sessoes}</td></tr><tr><th>Receita</th><td>${Number(d.receita).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td></tr><tr><th>Despesa</th><td>${Number(d.despesa).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td></tr><tr><th>Lucro</th><td>${Number(d.lucro).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td></tr>`;
 const mensal=await request('/api/relatorios/financeiro-mensal');
 new Chart(graficoFinanceiro,{type:'line',data:{labels:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],datasets:[{label:'Receitas',data:mensal.map(m=>m.receita)},{label:'Despesas',data:mensal.map(m=>m.despesa)}]}});
})().catch(e=>alert(e.message));
