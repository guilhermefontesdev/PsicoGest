async function carregar(){
  const dados=await request('/api/pacientes');
  lista.innerHTML=dados.map(p=>`<tr><td>${p.nome}</td><td>${p.telefone||'-'}</td><td><span class="badge ${p.status}">${p.status}</span></td><td><button class="btn light" onclick="abrirProntuario('${p.id}')">Prontuário</button> <button class="btn danger" onclick="remover('${p.id}')">Excluir</button></td></tr>`).join('');
}
function abrirProntuario(id){ localStorage.setItem('paciente_id',id); location.href='/pages/prontuario.html'; }
async function remover(id){ if(confirm('Excluir paciente?')){ await request('/api/pacientes/'+id,{method:'DELETE'}); carregar(); } }
form.onsubmit=async e=>{e.preventDefault();await request('/api/pacientes',{method:'POST',body:JSON.stringify(Object.fromEntries(new FormData(form)))});form.reset();carregar();};
carregar().catch(e=>alert(e.message));
