const API = '';
function token(){ return localStorage.getItem('token'); }
function usuario(){ return JSON.parse(localStorage.getItem('usuario') || 'null'); }
function sair(){ localStorage.clear(); location.href='/pages/login.html'; }
function proteger(){ if(!token()) location.href='/pages/login.html'; }
async function request(url, options={}){
  const res = await fetch(API + url, {
    ...options,
    headers:{ 'Content-Type':'application/json', Authorization:'Bearer '+token(), ...(options.headers||{}) }
  });
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.erro || 'Erro na requisição');
  return data;
}
function sidebar(active){
  const u = usuario() || {nome:'Usuário', perfil:'perfil'};
  document.write(`
  <aside class="sidebar">
    <div class="brand"><div class="mark">Ψ</div><div><h1>PsicoGest</h1><small>Clínica Integrada</small></div></div>
    <nav class="nav">
      <a class="${active==='dashboard'?'active':''}" href="/pages/dashboard.html">Dashboard</a>
      <a class="${active==='agenda'?'active':''}" href="/pages/agenda.html">Agenda</a>
      <a class="${active==='pacientes'?'active':''}" href="/pages/pacientes.html">Pacientes</a>
      <a class="${active==='prontuario'?'active':''}" href="/pages/prontuario.html">Prontuários</a>
      <a class="${active==='financeiro'?'active':''}" href="/pages/financeiro.html">Financeiro</a>
      <a class="${active==='relatorios'?'active':''}" href="/pages/relatorios.html">Relatórios</a>
    </nav>
    <div class="userbox"><b>${u.nome}</b><br><small>${u.perfil}</small><br><br><button class="btn light" onclick="sair()">Sair</button></div>
  </aside>`)
}
