let pacientes=[];
async function init(){
 pacientes=await request('/api/pacientes');
 pacienteSelect.innerHTML='<option value="">Selecione paciente</option>'+pacientes.map(p=>`<option value="${p.id}">${p.nome}</option>`).join('');
 const salvo=localStorage.getItem('paciente_id'); if(salvo) pacienteSelect.value=salvo;
 carregar();
}
async function carregar(){
 const dados=await request('/api/prontuarios');
 lista.innerHTML=dados.map(r=>`<tr><td>${pacientes.find(p=>p.id===r.paciente_id)?.nome||'-'}</td><td><span class="badge ${r.status}">${r.status}</span></td><td>${new Date(r.data_registro).toLocaleDateString('pt-BR')}</td></tr>`).join('');
}
form.onsubmit=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(form));body.psicologo_id=usuario().id;await request('/api/prontuarios',{method:'POST',body:JSON.stringify(body)});form.reset();carregar();};
init().catch(e=>alert(e.message));
