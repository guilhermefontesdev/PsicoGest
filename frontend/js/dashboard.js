(async()=>{
  const d=await request('/api/relatorios/dashboard');
  pacientes.textContent=d.pacientes||0; sessoes.textContent=d.sessoes||0;
  receita.textContent=Number(d.receita).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  despesa.textContent=Number(d.despesa).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  lucro.textContent=Number(d.lucro).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const mensal=await request('/api/relatorios/financeiro-mensal');
  new Chart(document.getElementById('grafico'),{type:'bar',data:{labels:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],datasets:[{label:'Receitas',data:mensal.map(m=>m.receita)},{label:'Despesas',data:mensal.map(m=>m.despesa)}]}});
})().catch(e=>alert(e.message));
