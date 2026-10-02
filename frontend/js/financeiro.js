async function carregar(){
 const dados=await request('/api/financeiro');
 lista.innerHTML=dados.map(f=>`<tr><td>${f.tipo}</td><td>${f.descricao}</td><td>${Number(f.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td><td><span class="badge ${f.status}">${f.status}</span></td></tr>`).join('');
}
form.onsubmit=async e=>{e.preventDefault();await request('/api/financeiro',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(form)))});form.reset();carregar();};
carregar().catch(e=>alert(e.message));
