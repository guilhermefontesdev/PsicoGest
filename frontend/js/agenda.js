let pacientes=[], salas=[];
async function init(){
 pacientes=await request('/api/pacientes'); salas=await request('/api/salas');
 pacienteSelect.innerHTML='<option value="">Paciente</option>'+pacientes.map(p=>`<option value="${p.id}">${p.nome}</option>`).join('');
 salaSelect.innerHTML='<option value="">Sala</option>'+salas.map(s=>`<option value="${s.id}">${s.nome}</option>`).join('');
 carregar();
}
async function carregar(){
 const ag=await request('/api/agendamentos');
 const hoje=new Date(); const ano=hoje.getFullYear(); const mes=hoje.getMonth(); const dias=new Date(ano,mes+1,0).getDate();
 calendar.innerHTML='';
 for(let d=1;d<=dias;d++){
  const eventos=ag.filter(a=>new Date(a.data_hora).getDate()===d && new Date(a.data_hora).getMonth()===mes);
  calendar.innerHTML+=`<div class="day"><b>${d}</b>${eventos.map(e=>`<div class="event"><span class="badge ${e.status}">${e.status}</span><br>${new Date(e.data_hora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})} - ${pacientes.find(p=>p.id===e.paciente_id)?.nome||'Paciente'}<br><button onclick="cancelar('${e.id}')">Cancelar</button></div>`).join('')}</div>`;
 }
}
async function cancelar(id){ await request('/api/agendamentos/'+id,{method:'PUT',body:JSON.stringify({status:'cancelado'})}); carregar(); }
form.onsubmit=async e=>{e.preventDefault();const body=Object.fromEntries(new FormData(form));body.psicologo_id=usuario().id;await request('/api/agendamentos',{method:'POST',body:JSON.stringify(body)});form.reset();carregar();};
init().catch(e=>alert(e.message));
