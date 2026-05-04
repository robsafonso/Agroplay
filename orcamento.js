document.getElementById(‘debug’).innerHTML=’<b style="color:#0f0">SCRIPT INICIOU</b>’;

window.onerror=function(m,s,l){
var d=document.getElementById(‘debug’);
if(d)d.innerHTML=’<b style="color:#f00">ERRO L’+l+’: ‘+m+’</b>’;
};

function dbg(t){
var d=document.getElementById(‘debug’);
if(d)d.innerHTML+=’<br>’+t;
}

var SB=‘https://wexwcnezjadoutyzkbcj.supabase.co’;
var KY=‘eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleHdjbmV6amFkb3V0eXprYmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTEwOTgsImV4cCI6MjA5MTkyNzA5OH0.i9fsKIoy6R1Pj8DOgyDQ4BjUvy9KUh_PPp83sQe9gHQ’;

var evAtual=null;
var itens=[];
var allEvs=[];

var CATS=[
{n:‘Artista’,its:[‘Cache do artista’,‘Passagem aerea artista’,‘Passagem aerea banda’,‘Hospedagem artista’,‘Hospedagem banda’,‘Translado aeroporto/hotel’,‘Translado hotel/show’,‘Alimentacao camarim’,‘Camareira’,‘Hospitality rider’]},
{n:‘Estrutura Tecnica’,its:[‘Sistema de som PA’,‘Sistema monitor’,‘Iluminacao’,‘Gerador’,‘Palco montagem’,‘Backline’,‘Telao LED’,‘Praticaveis’,‘Cabos extra’]},
{n:‘Local’,its:[‘Aluguel do espaco’,‘Banheiro quimico’,‘Banheiro PCD’,‘Energia eletrica’,‘Limpeza pre’,‘Limpeza pos’,‘Estacionamento’,‘Alvara bombeiros’,‘Alvara prefeitura’]},
{n:‘Seguranca’,its:[‘Seguranca patrimonial’,‘Seguranca ostensiva’,‘Brigadista’,‘Ambulancia’,‘Medico plantonista’,‘Bombeiro civil’]},
{n:‘Equipe’,its:[‘Producao local’,‘Portaria/credenciamento’,‘Garcom’,‘Bartender’,‘Copeiro’,‘Fotografo’,‘Videomaker’,‘Operador de som’,‘Iluminador’,‘Roadie’,‘Limpeza durante’]},
{n:‘Bebidas’,its:[‘Whisky garrafa’,‘Vodca garrafa’,‘Gin garrafa’,‘Licor garrafa’,‘Energetico cx’,‘Cerveja cx’,‘Chope barril’,‘Refrigerante cx’,‘Agua mineral cx’,‘Agua de coco cx’,‘Suco cx’,‘Gelo saco 5kg’,‘Copo descartavel pct’,‘Canudo pct’]},
{n:‘Alimentacao’,its:[‘Buffet convidados’,‘Jantar staff’,‘Cafe da manha equipe’,‘Lanche fotografo’,‘Frutas camarim’,‘Marmita seguranca’]},
{n:‘Divulgacao’,its:[‘Trafego pago Meta’,‘Trafego pago Google’,‘Flyers impressao’,‘Banner outdoor’,‘Influenciador’,‘Grafica geral’,‘Material identidade visual’]},
{n:‘Administracao’,its:[‘ECAD’,‘IRRF’,‘Contador’,‘Seguro evento’,‘Transporte producao’,‘Combustivel’,‘Material escritorio’,‘Taxa cartao’]}
];

function getCat(nome){
for(var i=0;i<CATS.length;i++){
if(CATS[i].n===nome)return CATS[i];
}
return null;
}

function fmt(v){
return ’R$ ’+parseFloat(v||0).toLocaleString(‘pt-BR’,{minimumFractionDigits:2,maximumFractionDigits:2});
}

function fd(d){
if(!d)return’’;
var x=d.split(’-’);
return x[2]+’/’+x[1]+’/’+x[0];
}

function esc(s){
if(!s)return’’;
return String(s).replace(/&/g,’&’).replace(/</g,’<’).replace(/>/g,’>’).replace(/”/g,’"’);
}

function el(id){return document.getElementById(id);}

function init(){
dbg(‘init ok’);
if(sessionStorage.getItem(‘ag_admin’)===‘1’){
dbg(‘admin logado’);
el(‘login’).style.display=‘none’;
el(‘painel’).style.display=‘block’;
carregarEventos();
}else{
dbg(‘mostrando login’);
el(‘login’).style.display=‘block’;
el(‘painel’).style.display=‘none’;
}
}

function logar(){
var u=el(‘admU’).value.trim();
var p=el(‘admP’).value.trim();
var m=el(‘lmsg’);
if(!u||!p){m.textContent=‘Preencha’;return;}
m.textContent=’…’;
fetch(SB+’/rest/v1/admins?usuario=eq.’+encodeURIComponent(u)+’&senha=eq.’+encodeURIComponent(p)+’&select=id’,{
headers:{apikey:KY,Authorization:’Bearer ’+KY}
}).then(function(r){return r.json();}).then(function(d){
if(Array.isArray(d)&&d.length){
sessionStorage.setItem(‘ag_admin’,‘1’);
init();
}else{
m.textContent=‘Usuario ou senha invalidos’;
}
}).catch(function(){m.textContent=‘Erro’;});
}

function sair(){
sessionStorage.removeItem(‘ag_admin’);
location.reload();
}

function carregarEventos(){
dbg(‘carregando eventos…’);
fetch(SB+’/rest/v1/eventos?select=id,nome,data,horario,local&order=data.asc’,{
headers:{apikey:KY,Authorization:‘Bearer ‘+KY}
}).then(function(r){return r.json();}).then(function(d){
dbg(‘resp: ‘+(Array.isArray(d)?d.length+’ eventos’:JSON.stringify(d).substring(0,80)));
var sel=el(‘esel’);
if(!Array.isArray(d)){
sel.innerHTML=’<option>Erro</option>’;
return;
}
allEvs=d;
var html=’<option value="">Selecione um evento…</option>’;
for(var i=0;i<d.length;i++){
html+=’<option value="'+d[i].id+'">’+esc(d[i].nome)+’ (’+fd(d[i].data)+’)</option>’;
}
sel.innerHTML=html;
dbg(‘select preenchido com ‘+d.length+’ opcoes’);
}).catch(function(e){
dbg(‘erro fetch: ‘+e.message);
el(‘esel’).innerHTML=’<option>Erro de conexao</option>’;
});
}

function selEv(){
var id=el(‘esel’).value;
el(‘einfo’).innerHTML=’’;
el(‘conteudo’).innerHTML=’’;
evAtual=null;
if(!id)return;
for(var i=0;i<allEvs.length;i++){
if(allEvs[i].id===id){evAtual=allEvs[i];break;}
}
if(!evAtual)return;
var info=’<div class="box-evento"><b>’+esc(evAtual.nome)+’</b><span>’+fd(evAtual.data);
if(evAtual.horario)info+=’ as ‘+evAtual.horario.substring(0,5);
if(evAtual.local)info+=’ - ‘+esc(evAtual.local);
info+=’</span></div>’;
el(‘einfo’).innerHTML=info;
carregarItens();
}

function carregarItens(){
if(!evAtual)return;
el(‘conteudo’).innerHTML=’<div class="empty">Carregando…</div>’;
fetch(SB+’/rest/v1/orcamentos?evento_id=eq.’+evAtual.id+’&order=categoria.asc,item.asc’,{
headers:{apikey:KY,Authorization:‘Bearer ‘+KY}
}).then(function(r){return r.json();}).then(function(d){
itens=Array.isArray(d)?d:[];
render();
}).catch(function(){
el(‘conteudo’).innerHTML=’<div class="empty">Erro</div>’;
});
}

function listaCats(){
var lst=[];
for(var i=0;i<CATS.length;i++)lst.push(CATS[i].n);
for(var j=0;j<itens.length;j++){
if(lst.indexOf(itens[j].categoria)<0)lst.push(itens[j].categoria);
}
return lst;
}

function render(){
var tot=0;
for(var k=0;k<itens.length;k++)tot+=parseFloat(itens[k].valor_total||0);

var h=’<div class="tot-card"><div class="tot-lbl">TOTAL ESTIMADO</div><div class="tot-val">’+fmt(tot)+’</div></div>’;

var lst=listaCats();
for(var i=0;i<lst.length;i++){
var cat=lst[i];
var cid=‘c’+i;
var co=getCat(cat);
var ci=[];
var ct=0;
for(var j=0;j<itens.length;j++){
if(itens[j].categoria===cat){
ci.push(itens[j]);
ct+=parseFloat(itens[j].valor_total||0);
}
}

```
h+='<div class="cat-card">';
h+='<div class="cat-head"><div class="cat-nome">'+esc(cat)+'</div><div class="cat-tot">'+fmt(ct)+'</div></div>';

h+='<div>';
if(ci.length===0){
  h+='<div class="empty">Nenhum item ainda</div>';
}else{
  for(var z=0;z<ci.length;z++)h+=renderIt(ci[z]);
}
h+='</div>';

h+='<div class="add-area">';
h+='<div class="add-row">';
h+='<select id="si_'+cid+'" onchange="togO(\''+cid+'\')">';
if(co){
  for(var y=0;y<co.its.length;y++)h+='<option>'+esc(co.its[y])+'</option>';
}
h+='<option value="_outro_">Outro item...</option>';
h+='</select>';
h+='<input type="number" id="sq_'+cid+'" value="1" step="0.5" class="qtd">';
h+='<input type="number" id="sv_'+cid+'" placeholder="R$" step="0.01" class="vlr">';
h+='<button class="add-btn" onclick="addIt(\''+esc(cat)+'\',\''+cid+'\')">+</button>';
h+='</div>';
h+='<input type="text" id="sn_'+cid+'" placeholder="Nome do item" class="outro-input">';
h+='</div>';
h+='</div>';
```

}

h+=’<button class="btn-pdf" onclick="gerarPDF()">Gerar PDF do Orcamento</button>’;

el(‘conteudo’).innerHTML=h;
}

function renderIt(it){
return ‘<div class="it"><div class="it-info"><div class="it-nome">’+esc(it.item)+’</div><div class="it-det">’+it.quantidade+‘x ‘+fmt(it.valor_unitario)+’</div></div><div class="it-val">’+fmt(it.valor_total)+’</div><button class="it-del" onclick="delIt(\''+it.id+'\')">x</button></div>’;
}

function togO(cid){
var s=el(‘si_’+cid);
var i=el(‘sn_’+cid);
if(s&&i){
i.style.display=s.value===’*outro*’?‘block’:‘none’;
}
}

function addIt(cat,cid){
if(!evAtual){alert(‘Selecione um evento’);return;}
var s=el(‘si_’+cid);
var ni=el(‘sn_’+cid);
var nome;
if(s.value===’*outro*’){
nome=ni?ni.value.trim():’’;
}else{
nome=s.value;
}
var qtd=parseFloat(el(‘sq_’+cid).value)||1;
var val=parseFloat(el(‘sv_’+cid).value)||0;
if(!nome){alert(‘Preencha o item’);return;}
if(!val||val<=0){alert(‘Digite o valor’);return;}

var body={
evento_id:evAtual.id,
categoria:cat,
item:nome,
quantidade:qtd,
valor_unitario:val,
valor_total:qtd*val
};

fetch(SB+’/rest/v1/orcamentos’,{
method:‘POST’,
headers:{apikey:KY,Authorization:’Bearer ’+KY,‘Content-Type’:‘application/json’,Prefer:‘return=representation’},
body:JSON.stringify(body)
}).then(function(r){return r.json();}).then(function(d){
if(Array.isArray(d)&&d[0])itens.push(d[0]);
render();
}).catch(function(){alert(‘Erro ao adicionar’);});
}

function delIt(id){
if(!confirm(‘Excluir este item?’))return;
fetch(SB+’/rest/v1/orcamentos?id=eq.’+id,{
method:‘DELETE’,
headers:{apikey:KY,Authorization:’Bearer ’+KY}
}).then(function(){
var novos=[];
for(var i=0;i<itens.length;i++){
if(itens[i].id!==id)novos.push(itens[i]);
}
itens=novos;
render();
}).catch(function(){alert(‘Erro’);});
}

function gerarPDF(){
if(!evAtual||!itens.length){alert(‘Adicione itens primeiro’);return;}
var tot=0;
for(var i=0;i<itens.length;i++)tot+=parseFloat(itens[i].valor_total||0);

var grp={};
for(var j=0;j<itens.length;j++){
var c=itens[j].categoria;
if(!grp[c])grp[c]=[];
grp[c].push(itens[j]);
}

var w=window.open(’’,’_blank’);
var h=’<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Orcamento</title>’;
h+=’<style>’;
h+=‘body{font-family:Arial,sans-serif;max-width:700px;margin:0 auto;padding:24px;color:#222}’;
h+=‘h1{color:#1e7a35;font-size:28px}’;
h+=‘h2{color:#666;font-size:16px;font-weight:normal;margin-bottom:24px;border-bottom:2px solid #1e7a35;padding-bottom:8px}’;
h+=’.totbox{background:#f0fff0;border:2px solid #1e7a35;border-radius:10px;padding:16px;margin:20px 0;display:flex;justify-content:space-between;align-items:center}’;
h+=’.totbox .v{font-size:24px;color:#1e7a35;font-weight:900}’;
h+=‘h3{background:#1e7a35;color:#fff;padding:10px 14px;margin-top:20px;border-radius:6px;font-size:14px;display:flex;justify-content:space-between}’;
h+=‘table{width:100%;border-collapse:collapse;margin-top:8px;font-size:12px}’;
h+=‘th{background:#f5f5f5;padding:8px;border-bottom:2px solid #ddd;text-align:left;font-size:11px;text-transform:uppercase;color:#555}’;
h+=‘td{padding:8px;border-bottom:1px solid #eee}’;
h+=‘td:last-child,th:last-child{text-align:right;font-weight:700;color:#1e7a35}’;
h+=’.rodape{margin-top:30px;padding-top:14px;border-top:1px solid #ccc;font-size:10px;color:#888;text-align:center}’;
h+=’@media print{button{display:none}}’;
h+=’.btn{width:100%;background:#1e7a35;color:#fff;border:none;padding:14px;font-size:14px;font-weight:700;cursor:pointer;border-radius:8px;margin-top:24px}’;
h+=’</style></head><body>’;
h+=’<h1>AGROPLAY MUSIC</h1>’;
h+=’<h2>Orcamento - ‘+esc(evAtual.nome);
if(evAtual.data)h+=’ - ‘+fd(evAtual.data);
h+=’</h2>’;
h+=’<div class="totbox"><b>TOTAL ESTIMADO</b><div class="v">’+fmt(tot)+’</div></div>’;

var ord=[];
for(var k=0;k<CATS.length;k++)ord.push(CATS[k].n);
for(var c2 in grp){
if(ord.indexOf(c2)<0)ord.push(c2);
}

for(var x=0;x<ord.length;x++){
var cat=ord[x];
if(!grp[cat])continue;
var ct=0;
for(var y=0;y<grp[cat].length;y++)ct+=parseFloat(grp[cat][y].valor_total||0);
h+=’<h3><span>’+esc(cat)+’</span><span>’+fmt(ct)+’</span></h3>’;
h+=’<table><tr><th>Item</th><th>Qtd</th><th>Unit.</th><th>Total</th></tr>’;
for(var z=0;z<grp[cat].length;z++){
var it=grp[cat][z];
h+=’<tr><td>’+esc(it.item)+’</td><td>’+it.quantidade+’</td><td>’+fmt(it.valor_unitario)+’</td><td>’+fmt(it.valor_total)+’</td></tr>’;
}
h+=’</table>’;
}

h+=’<div class="rodape">Agroplay Music - Londrina/PR - ‘+new Date().toLocaleDateString(‘pt-BR’)+’</div>’;
h+=’<button class="btn" onclick="window.print()">Imprimir / Salvar PDF</button>’;
h+=’</body></html>’;

w.document.write(h);
w.document.close();
}

try{
init();
}catch(e){
dbg(’ERRO INIT: ’+e.message);
}
