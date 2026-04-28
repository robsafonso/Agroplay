const SB = "https://wexwcnezjadoutyzkbcj.supabase.co";
const KY = "COLE_SEU_TOKEN_COMPLETO_AQUI";

// ================= BASE =================
async function api(path, opt={}){
  const res = await fetch(SB + "/rest/v1/" + path, {
    method: opt.method || "GET",
    headers:{
      "apikey": KY,
      "Authorization": "Bearer " + KY,
      "Content-Type":"application/json",
      ...(opt.headers||{})
    },
    body: opt.body ? JSON.stringify(opt.body) : null
  });

  const txt = await res.text();
  return txt ? JSON.parse(txt) : null;
}

// ================= GERAR CODIGO =================
async function gerarCodigo(){
  const res = await fetch(SB + "/rest/v1/rpc/pegar_codigo", {
    method:"POST",
    headers:{
      "apikey": KY,
      "Authorization":"Bearer " + KY,
      "Content-Type":"application/json"
    }
  });

  return await res.json();
}

// ================= LISTAR CODIGOS =================
async function listarCodigos(){
  return await api("codigos?select=*&order=id.desc");
}

// ================= USAR CODIGO =================
async function usarCodigo(cod){
  return await api("codigos?codigo=eq."+cod,{
    method:"PATCH",
    headers:{ "Prefer":"return=minimal" },
    body:{
      usado:true,
      usado_em:new Date().toISOString()
    }
  });
}

// ================= CADASTROS =================
async function listarCadastros(){
  return await api("cadastros?select=*&order=id.desc");
}

async function criarCadastro(data){
  return await api("cadastros",{
    method:"POST",
    headers:{ "Prefer":"return=minimal" },
    body:data
  });
}

// ================= EVENTOS =================
async function listarEventos(){
  return await api("eventos?select=*&order=data.desc");
}

async function criarEvento(data){
  return await api("eventos",{
    method:"POST",
    headers:{ "Prefer":"return=minimal" },
    body:data
  });
}

// ================= LOTES =================
async function listarLotes(){
  return await api("lotes?select=*&order=id.desc");
}

async function criarLote(data){
  return await api("lotes",{
    method:"POST",
    headers:{ "Prefer":"return=representation" },
    body:data
  });
}
