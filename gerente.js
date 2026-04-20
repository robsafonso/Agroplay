document.addEventListener(‘DOMContentLoaded’,function(){
var SB=“https://wexwcnezjadoutyzkbcj.supabase.co”;
var KY=“eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleHdjbmV6amFkb3V0eXprYmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNTEwOTgsImV4cCI6MjA5MTkyNzA5OH0.i9fsKIoy6R1Pj8DOgyDQ4BjUvy9KUh_PPp83sQe9gHQ”;
var LC=“https://robsafonso.github.io/Agroplay/cadastro.html”;
var LCV=“https://robsafonso.github.io/Agroplay/convite.html”;
var SETS=[“Artista”,“Influenciador”,“Diretoria”,“Colaborador”];
var COR={Artista:”#7c3aed”,Influenciador:”#0891b2”,Diretoria:”#b45309”,Colaborador:”#1e7a35”};
var cads=[],cods=[],evs=[],sel=[],fset=“Todos”,fk=“t”,lista=null,pa=null,eva=null,cf=“Todos”,cs=[],eid=null;
function q(id){return document.getElementById(id);}
function fd(d){if(!d)return””;var x=d.split(”-”);return x[2]+”/”+x[1]+”/”+x[0];}
function ap(p,o){o=o||{};var h={“apikey”:KY,“Authorization”:“Bearer “+KY,“Content-Type”:“application/json”};if(o.pref)h[“Prefer”]=o.pref;return fetch(SB+”/rest/v1/”+p,{method:o.m||“GET”,headers:h,body:o.b}).then(function(r){if(!r.ok){throw new Error(“HTTP “+r.status);}return r.text();}).then(function(t){return t?JSON.parse(t):null;});}
function cp2(txt,btn,lbl){if(navigator.clipboard){navigator.clipboard.writeText(txt).then(function(){btn.textContent=“Copiado!”;setTimeout(function(){btn.textContent=lbl;},2000);});}else{var t=document.createElement(“textarea”);t.value=txt;document.body.appendChild(t);t.select();document.execCommand(“copy”);document.body.removeChild(t);btn.textContent=“Copiado!”;setTimeout(function(){btn.textContent=lbl;},2000);}}
function dl(cnt,t,n){var b=new Blob([cnt],{type:t});var u=URL.createObjectURL(b);var a=document.createElement(“a”);a.href=u;a.download=n;a.click();}
q(“r”).onclick=load;
q(“bgl”).onclick=gerarLst;
q(“bexk”).onclick=expCods;
q(“bxls”).onclick=expExcel;
q(“bcsv”).onclick=expCSV;
q(“bfp”).onclick=function(){q(“ovp”).classList.remove(“on”);pa=null;};
q(“bdel”).onclick=delP;
q(“bsc”).oninput=rend;
q(“bcpy”).onclick=copDados;
q(“bffoto”).onclick=function(){q(“ovfoto”).classList.remove(“on”);};
q(“bnev”).onclick=function(){abrEv(null);};
q(“bfev”).onclick=fecEv;
q(“bcaev”).onclick=fecEv;
q(“bsev”).onclick=salvEv;
q(“bfconv”).onclick=function(){q(“ovconv”).classList.remove(“on”);};
q(“bcopc”).onclick=function(){cp2(q(“cmsg”).textContent,q(“bcopc”),“Copiar mensagem”);};
q(“boutro”).onclick=function(){q(“cres”).classList.add(“gone”);q(“csel”).classList.remove(“gone”);};
q(“bsall”).onclick=function(){cs=cads.filter(function(c){return cf===“Todos”||c.setor===cf;}).map(function(c){return c.id;});rcp();};
q(“bsnone”).onclick=function(){cs=[];rcp();};
q(“bgconv”).onclick=function(){gconvExt();};
q(“bgconvi”).onclick=function(){gconv(“interno”);};
q(“ckt”).onclick=function(){fk=“t”;q(“ckt”).classList.add(“on”);q(“ckd”).classList.remove(“on”);q(“cku”).classList.remove(“on”);rCods();};
q(“ckd”).onclick=function(){fk=“d”;q(“ckt”).classList.remove(“on”);q(“ckd”).classList.add(“on”);q(“cku”).classList.remove(“on”);rCods();};
q(“cku”).onclick=function(){fk=“u”;q(“ckt”).classList.remove(“on”);q(“ckd”).classList.remove(“on”);q(“cku”).classList.add(“on”);rCods();};
q(“tc”).onclick=function(){tab(“c”);};
q(“te”).onclick=function(){tab(“e”);};
q(“tk”).onclick=function(){tab(“k”);};
q(“tl”).onclick=function(){tab(“l”);};
q(“bapv”).onclick=function(){
if(!pa)return;
var pid=pa.id;
ap(“cadastros?id=eq.”+pid,{m:“PATCH”,pref:“return=minimal”,b:JSON.stringify({status:“aprovado”})}).then(function(){
for(var i=0;i<cads.length;i++){if(cads[i].id===pid){cads[i].status=“aprovado”;break;}}
q(“bapv”).textContent=“Aprovado!”;
setTimeout(function(){q(“bapv”).textContent=“Aprovar”;},2000);
rend();
});
};
q(“brpv”).onclick=function(){
if(!pa)return;
var pid=pa.id;
var pnome=pa.nome;
ap(“cadastros?id=eq.”+pid,{m:“PATCH”,pref:“return=minimal”,b:JSON.stringify({status:“reprovado”})}).then(function(){
for(var i=0;i<cads.length;i++){if(cads[i].id===pid){cads[i].status=“reprovado”;break;}}
var msg=“Ola “+pnome+”,\n\nSua solicitacao nao foi confirmada.\nContate o escritorio Agroplay.\nAgroplay Music - Londrina PR”;
cp2(msg,q(“brpv”),“Reprovar”);
rend();
});
};
function load(){
q(“tbl”).innerHTML=”<div class='empty'>Carregando…</div>”;
q(“sts”).innerHTML=”<div class='stat'><strong style='font-size:12px;color:#c9973c'>Conectando…</strong></div>”;
ap(“cadastros?select=*&order=criado_em.desc”).then(function(d){cads=d||[];rSts();rChips();rend();}).catch(function(e){cads=[];q(“tbl”).innerHTML=”<div class='empty' style='color:#e74c3c'>Erro: “+e.message+”</div>”;rSts();rChips();});
ap(“codigos?select=*&order=id.asc”).then(function(d){cods=d||[];rSts();rCods();}).catch(function(){cods=[];});
ap(“eventos?select=*&order=data.asc”).then(function(d){evs=d||[];rSts();rEvs();}).catch(function(){evs=[];});
}
function rSts(){
var d=cods.filter(function(c){return !c.usado;}).length;
var pend=cads.filter(function(c){return c.status===“pendente”&&c.evento_id;}).length;
q(“sts”).innerHTML=”<div class='stat'><strong>”+cads.length+”</strong><small>Cadastros</small></div>”+”<div class='stat'><strong>”+evs.length+”</strong><small>Eventos</small></div>”+”<div class='stat'><strong>”+(pend>0?pend:d)+”</strong><small>”+(pend>0?“Pendentes”:“Codigos”)+”</small></div>”;
}
function rChips(){
q(“chips”).innerHTML=[“Todos”].concat(SETS).map(function(s){
return “<button class='chip"+(fset===s?" on":"")+"' onclick='setF(\""+s+"\")'>” +s+”</button>”;
}).join(””);
}
function setF(s){fset=s;rChips();rend();}
function rend(){
var b=q(“bsc”).value.toLowerCase();
var f=cads.filter(function(c){return (fset===“Todos”||c.setor===fset)&&(!b||c.nome.toLowerCase().indexOf(b)>=0||c.email.toLowerCase().indexOf(b)>=0);});
var gb=q(“gbar”);
if(sel.length>0){gb.style.display=“flex”;q(“sct”).textContent=sel.length+” sel.”;}else gb.style.display=“none”;
if(!f.length){q(“tbl”).innerHTML=”<div class='empty'>Nenhum cadastro</div>”;return;}
var all=f.every(function(c){return sel.indexOf(c.id)>=0;});
var h=”<div class='tbl'><table><thead><tr><th><input type=‘checkbox’”+(all?” checked”:””)+” id=‘cball’></th><th>Nome</th><th>Setor</th><th>Status</th></tr></thead><tbody>”;
f.forEach(function(c){
var cor=COR[c.setor]||”#555”;
var sb=c.status===“aprovado”?”<span class='ab'>Aprov</span>”:c.status===“reprovado”?”<span class='rb'>Reprov</span>”:c.evento_id?”<span class='pb'>Pend</span>”:””;
h+=”<tr><td><input type=‘checkbox’”+(sel.indexOf(c.id)>=0?” checked”:””)+” onchange=‘togS(”+c.id+”,this.checked)’></td><td><span class='nlink' onclick='verP("+c.id+")'>”+c.nome+”</span></td><td><span class='badge' style='background:"+cor+"'>”+c.setor+”</span></td><td>”+sb+”</td></tr>”;
});
h+=”</tbody></table></div>”;
q(“tbl”).innerHTML=h;
var cb=q(“cball”);
if(cb)cb.onchange=function(){togAll(f.map(function(c){return c.id;}),this.checked);};
}
function togS(id,v){if(v){if(sel.indexOf(id)<0)sel.push(id);}else{sel=sel.filter(function(x){return x!==id;});}rend();}
function togAll(ids,v){if(v)ids.forEach(function(id){if(sel.indexOf(id)<0)sel.push(id);});else sel=sel.filter(function(x){return ids.indexOf(x)<0;});rend();}
function verP(id){
var c=null;
for(var i=0;i<cads.length;i++){if(cads[i].id===id){c=cads[i];break;}}
if(!c)return;pa=c;
var cor=COR[c.setor]||”#555”;
var fh=c.foto_url?”<img src='"+c.foto_url+"' onclick='verFoto("+c.id+")' style='width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid #2aab47;margin:0 auto 10px;display:block;cursor:pointer'/>”:”<div style='width:80px;height:80px;background:"+cor+";border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:28px;color:#fff;font-weight:700'>”+c.nome.charAt(0).toUpperCase()+”</div>”;
var h=”<div style='text-align:center;margin-bottom:16px'>”+fh+”<div style='font-size:17px;font-weight:700;color:#fff'>”+c.nome+”</div><span class='badge' style='background:"+cor+";margin-top:6px;display:inline-block'>”+c.setor+”</span></div>”;
var rows=[[“CPF”,c.cpf],[“RG”,c.rg],[“Email”,c.email],[“Telefone”,c.telefone],[“Nascimento”,fd(c.nascimento)]];
if(c.empresa)rows.push([“Empresa”,c.empresa]);
if(c.cargo)rows.push([“Cargo”,c.cargo]);
if(c.status&&c.evento_id)rows.push([“Status”,c.status]);
rows.forEach(function(row){h+=”<div class='prow'><span>”+row[0]+”</span><span>”+row[1]+”</span></div>”;});
q(“pcont”).innerHTML=h;
if(c.evento_id)q(“aprovd”).style.display=“block”;else q(“aprovd”).style.display=“none”;
q(“ovp”).classList.add(“on”);
}
function verFoto(id){
var c=null;
for(var i=0;i<cads.length;i++){if(cads[i].id===id){c=cads[i];break;}}
if(!c||!c.foto_url)return;
q(“fgrd”).src=c.foto_url;q(“ovfoto”).classList.add(“on”);
}
function copDados(){
if(!pa)return;
var txt=“Nome: “+pa.nome+”\nCPF: “+pa.cpf+”\nRG: “+pa.rg+”\nEmail: “+pa.email+”\nTelefone: “+pa.telefone+”\nNascimento: “+fd(pa.nascimento)+”\nSetor: “+pa.setor;
if(pa.empresa)txt=txt+”\nEmpresa: “+pa.empresa;
if(pa.cargo)txt=txt+”\nCargo: “+pa.cargo;
cp2(txt,q(“bcpy”),“Copiar dados”);
}
function delP(){
if(!pa)return;if(!confirm(“Excluir?”))return;
var pid=pa.id;
ap(“cadastros?id=eq.”+pid,{m:“DELETE”,pref:“return=minimal”}).then(function(){
cads=cads.filter(function(c){return c.id!==pid;});
sel=sel.filter(function(x){return x!==pid;});
q(“ovp”).classList.remove(“on”);pa=null;rSts();rend();
});
}
function abrEv(id){
eid=id;
if(id){
var ev=null;
for(var i=0;i<evs.length;i++){if(evs[i].id===id){ev=evs[i];break;}}
if(!ev)return;
q(“evtit”).textContent=“Editar Evento”;
q(“evn”).value=ev.nome||””;q(“evd”).value=ev.data||””;q(“evl”).value=ev.local||””;
q(“evm”).value=ev.maps_url||””;q(“eva1”).value=ev.atracao1||””;q(“evi1”).value=ev.insta_atr1||””;
q(“eva2”).value=ev.atracao2||””;q(“evi2”).value=ev.insta_atr2||””;
q(“evf”).value=ev.foto_url||””;q(“evdesc”).value=ev.descricao||””;
}else{
q(“evtit”).textContent=“Novo Evento”;
[“evn”,“evd”,“evl”,“evm”,“eva1”,“evi1”,“eva2”,“evi2”,“evf”,“evdesc”].forEach(function(x){q(x).value=””;});
}
q(“evalert”).innerHTML=””;
q(“ovev”).classList.add(“on”);
}
function fecEv(){q(“ovev”).classList.remove(“on”);eid=null;}
function salvEv(){
var nome=q(“evn”).value.trim();
if(!nome){q(“evalert”).innerHTML=”<div class='ea'>Nome obrigatorio</div>”;return;}
var btn=q(“bsev”);btn.textContent=“Salvando…”;btn.disabled=true;
var body=JSON.stringify({nome:nome,data:q(“evd”).value||null,local:q(“evl”).value.trim(),maps_url:q(“evm”).value.trim(),atracao1:q(“eva1”).value.trim(),insta_atr1:q(“evi1”).value.trim(),atracao2:q(“eva2”).value.trim(),insta_atr2:q(“evi2”).value.trim(),foto_url:q(“evf”).value.trim(),descricao:q(“evdesc”).value.trim()});
var path=eid?“eventos?id=eq.”+eid:“eventos”;
var meth=eid?“PATCH”:“POST”;
ap(path,{m:meth,pref:“return=minimal”,b:body}).then(function(){fecEv();load();tab(“e”);}).catch(function(){q(“evalert”).innerHTML=”<div class='ea'>Erro ao salvar</div>”;}).finally(function(){btn.textContent=“Salvar”;btn.disabled=false;});
}
function rEvs(){
var el=q(“evlst”);
if(!evs.length){el.innerHTML=”<div class='empty'>Nenhum evento</div>”;return;}
var h=””;
evs.forEach(function(ev){
var d=ev.data?ev.data.split(”-”):[””,””,””];
h+=”<div class='card'>”;
h+=”<div style='font-size:15px;font-weight:700;color:#fff;margin-bottom:4px'>”+ev.nome+”</div>”;
h+=”<div style='font-size:11px;color:#555;line-height:1.7;margin-bottom:10px'>”;
if(ev.data)h+=“Data: “+d[2]+”/”+d[1]+”/”+d[0]+”<br>”;
if(ev.local)h+=“Local: “+ev.local+”<br>”;
if(ev.atracao1)h+=“Atracoes: “+ev.atracao1+(ev.atracao2?” + “+ev.atracao2:””)+”<br>”;
h+=”</div>”;
h+=”<div style='display:flex;gap:6px;flex-wrap:wrap'>”;
h+=”<button class='btn' onclick='abrConv("+ev.id+")' style='flex:1;font-size:11px;padding:8px'>Enviar Convites</button>”;
h+=”<button class='bto' onclick='lstEv("+ev.id+")' style='font-size:11px;padding:8px'>Lista</button>”;
h+=”<button class='bty' onclick='abrEv("+ev.id+")' style='font-size:11px;padding:8px'>Editar</button>”;
h+=”<button class='btr' onclick='delEv("+ev.id+")' style='font-size:11px;padding:8px'>X</button>”;
h+=”</div></div>”;
});
el.innerHTML=h;
}
function delEv(id){
if(!confirm(“Excluir evento?”))return;
ap(“eventos?id=eq.”+id,{m:“DELETE”,pref:“return=minimal”}).then(function(){evs=evs.filter(function(e){return e.id!==id;});rEvs();rSts();});
}
function abrConv(evId){
eva=null;
for(var i=0;i<evs.length;i++){if(evs[i].id===evId){eva=evs[i];break;}}
if(!eva)return;
cs=[];cf=“Todos”;
q(“cres”).classList.add(“gone”);q(“csel”).classList.remove(“gone”);
q(“cevinfo”).textContent=“Evento: “+eva.nome;
q(“calert”).innerHTML=””;
document.querySelectorAll(”#cchips .chip”).forEach(function(b){b.classList.remove(“on”);});
document.querySelector(”#cchips .chip”).classList.add(“on”);
rcp();
q(“ovconv”).classList.add(“on”);
}
function fconv(f,btn){cf=f;document.querySelectorAll(”#cchips .chip”).forEach(function(b){b.classList.remove(“on”);});btn.classList.add(“on”);rcp();}
function rcp(){
var f=cads.filter(function(c){return cf===“Todos”||c.setor===cf;});
if(!f.length){q(“cpess”).innerHTML=”<div class='empty'>Nenhuma pessoa</div>”;return;}
var h=””;
f.forEach(function(c){
var cor=COR[c.setor]||”#555”;
var chk=cs.indexOf(c.id)>=0;
h+=”<div style='display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #111'>”;
h+=”<input type=‘checkbox’ style=‘width:18px;height:18px;cursor:pointer’ “+(chk?“checked”:””)+” onchange=‘togC(”+c.id+”,this.checked)’>”;
h+=”<div style='flex:1;font-size:13px;color:#eee'>”+c.nome+”</div>”;
h+=”<span class='badge' style='background:"+cor+"'>”+c.setor+”</span></div>”;
});
q(“cpess”).innerHTML=h;
}
function togC(id,v){if(v){if(cs.indexOf(id)<0)cs.push(id);}else{cs=cs.filter(function(x){return x!==id;});}}
function setTipo(t){
if(t===“externo”){
q(“btntipoe”).className=“btn”;q(“btntipoe”).style.flex=“1”;q(“btntipoe”).style.fontSize=“12px”;
q(“btntipoi”).className=“bto”;q(“btntipoi”).style.flex=“1”;q(“btntipoi”).style.fontSize=“12px”;
q(“csel-ext”).style.display=“block”;
q(“csel-int”).style.display=“none”;
} else {
q(“btntipoe”).className=“bto”;q(“btntipoe”).style.flex=“1”;q(“btntipoe”).style.fontSize=“12px”;
q(“btntipoi”).className=“btn”;q(“btntipoi”).style.flex=“1”;q(“btntipoi”).style.fontSize=“12px”;q(“btntipoi”).style.background=”#0891b2”;
q(“csel-ext”).style.display=“none”;
q(“csel-int”).style.display=“block”;
rcp();
}
}

function gconvExt(){
if(!eva)return;
var btn=q(“bgconv”);btn.textContent=“Gerando…”;btn.disabled=true;
q(“calert”).innerHTML=””;
fetch(SB+”/rest/v1/codigos?usado=eq.false&order=id.asc&limit=1”,{headers:{“apikey”:KY,“Authorization”:“Bearer “+KY}})
.then(function(r){return r.json();})
.then(function(d){
if(!d||!d.length){q(“calert”).innerHTML=”<div class='ea'>Nenhum codigo disponivel!</div>”;return;}
var cod=d[0].codigo;
var link=LCV+”?ev=”+eva.id+”&tipo=externo&cod=”+cod;
var msg=“AGROPLAY - Convite VIP\n\n”+eva.nome+(eva.data?”\nData: “+eva.data.split(”-”).reverse().join(”/”):””)+(eva.local?”\nLocal: “+eva.local:””)+”\n\nAcesse e se cadastre:\n”+link+”\n\nCodigo: “+cod+”\n\nCodigo intransferivel.\nAgroplay - Londrina PR”;
q(“linkext”).textContent=link;
q(“bcopext”).style.display=“block”;
q(“bcopext”).onclick=function(){cp2(msg,q(“bcopext”),“Copiar link + mensagem”);};
btn.textContent=“Gerar novo link”;btn.disabled=false;
})
.catch(function(){q(“calert”).innerHTML=”<div class='ea'>Erro</div>”;btn.textContent=“Gerar link externo”;btn.disabled=false;});
}

function gconv(tipo){
if(cs.length===0){q(“calert”).innerHTML=”<div class='ea'>Selecione pelo menos 1 pessoa</div>”;return;}
var btn=q(“bgconv”);btn.textContent=“Gerando…”;btn.disabled=true;
q(“calert”).innerHTML=””;
fetch(SB+”/rest/v1/codigos?usado=eq.false&order=id.asc&limit=1”,{headers:{“apikey”:KY,“Authorization”:“Bearer “+KY}})
.then(function(r){return r.json();})
.then(function(d){
if(!d||!d.length){q(“calert”).innerHTML=”<div class='ea'>Nenhum codigo disponivel!</div>”;return;}
var cod=d[0].codigo;
var pessoa=null;
for(var i=0;i<cads.length;i++){if(cads[i].id===cs[0]){pessoa=cads[i];break;}}
var ev=eva;
var df=ev.data?ev.data.split(”-”):[””,””,””];
var dataFmt=ev.data?df[2]+”/”+df[1]+”/”+df[0]:””;
var tipoConv=tipo||“externo”;
var tipoConv=tipo||“interno”;
var msg=“AGROPLAY - Convite VIP\n\nOla “+pessoa.nome+”!\n\nVoce esta convidado(a):\n\n”+ev.nome+(dataFmt?”\nData: “+dataFmt:””)+(ev.local?”\nLocal: “+ev.local:””)+(ev.atracao1?”\nAtracoes: “+ev.atracao1+(ev.atracao2?” + “+ev.atracao2:””):””);
msg=msg+”\n\nAcesse e confirme presenca:\n”+LCV+”?ev=”+ev.id+”&tipo=”+tipoConv+”\n\nSeu codigo: “+cod+”\n\nCodigo intransferivel.\nAgroplay - Londrina PR”;
q(“ccod”).textContent=cod;
q(“cmsg”).textContent=msg;
q(“cres”).classList.remove(“gone”);
q(“csel”).classList.add(“gone”);
cs=cs.slice(1);
})
.catch(function(){q(“calert”).innerHTML=”<div class='ea'>Erro ao gerar</div>”;})
.finally(function(){btn.textContent=“Gerar convite”;btn.disabled=false;});
}
function lstEv(evId){
var ev=null;
for(var i=0;i<evs.length;i++){if(evs[i].id===evId){ev=evs[i];break;}}
if(!ev)return;
var p=cads.filter(function(c){return c.evento_id===evId;});
lista={n:ev.nome,p:p,dt:new Date().toLocaleString(“pt-BR”)};
tab(“l”);rLst();
}
function rCods(){
var f=cods.filter(function(c){return fk===“d”?!c.usado:fk===“u”?c.usado:true;});
if(!f.length){q(“klst”).innerHTML=”<div class='empty'>Nenhum</div>”;return;}
var h=”<div style='display:grid;grid-template-columns:repeat(2,1fr);gap:5px'>”;
f.forEach(function(c){
h+=”<div style='background:#030503;border:1px solid #1a2a1a;border-radius:7px;padding:8px 10px;display:flex;justify-content:space-between;align-items:center'>”;
h+=”<span style='font-family:monospace;font-size:12px;font-weight:700;color:"+(c.usado?"#444":"#fff")+"'>”+c.codigo+”</span>”;
h+=”<span class='badge' style='background:"+(c.usado?"#555":"#1e7a35")+"'>”+(c.usado?“Usado”:“Livre”)+”</span></div>”;
});
h+=”</div>”;q(“klst”).innerHTML=h;
}
function expCods(){dl(“Codigo,Status\n”+cods.map(function(c){return c.codigo+”,”+(c.usado?“Usado”:“Disponivel”);}).join(”\n”),“text/csv”,“Codigos.csv”);}
function gerarLst(){
var p=cads.filter(function(c){return sel.indexOf(c.id)>=0;});
var n=q(“evnm”).value||“Evento”;
lista={n:n,p:p,dt:new Date().toLocaleString(“pt-BR”)};
tab(“l”);rLst();
}
function rLst(){
if(!lista){q(“llst”).innerHTML=”<div class='empty'>Selecione cadastros e clique em Gerar Lista.</div>”;return;}
var h=”<div style='display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px'>”;
h+=”<div><div style='font-size:15px;color:#fff;font-weight:700'>”+lista.n+”</div>”;
h+=”<div style='font-size:11px;color:#555;margin-top:2px'>”+lista.dt+” - “+lista.p.length+” pessoa(s)</div></div>”;
h+=”<div style='display:flex;gap:6px'><button class='bto' onclick='exXlsL()'>Excel</button><button class='bto' onclick='exCsvL()'>CSV</button></div></div>”;
h+=”<div class='tbl'><table><thead><tr><th>#</th><th>Nome</th><th>Empresa</th><th>Cargo</th><th>Email</th><th>Tel</th><th>Setor</th><th>Status</th></tr></thead><tbody>”;
lista.p.forEach(function(p,i){
var sb=p.status===“aprovado”?”<span class='ab'>Aprov</span>”:p.status===“reprovado”?”<span class='rb'>Reprov</span>”:”<span class='pb'>Pend</span>”;
h+=”<tr><td style='color:#444'>”+(i+1)+”</td><td style='color:#fff'>”+p.nome+”</td>”;
h+=”<td style='color:#777'>”+(p.empresa||”-”)+”</td><td style='color:#777'>”+(p.cargo||”-”)+”</td>”;
h+=”<td style='color:#777'>”+p.email+”</td><td style='color:#777'>”+p.telefone+”</td>”;
h+=”<td><span class='badge' style='background:"+(COR[p.setor]||"#555")+"'>”+p.setor+”</span></td>”;
h+=”<td>”+sb+”</td></tr>”;
});
h+=”</tbody></table></div>”;
q(“llst”).innerHTML=h;
}
function mkR(arr){return arr.map(function(c){return[c.nome,c.cpf,c.rg,c.email,c.telefone,fd(c.nascimento),c.setor,c.empresa||””,c.cargo||””,c.status||””];});}
function expExcel(){mkXls(mkR(cads),“Cadastros”);}
function exXlsL(){if(lista)mkXls(mkR(lista.p),“Lista_”+lista.n);}
function expCSV(){dl(“Nome,CPF,RG,Email,Telefone,Nascimento,Setor,Empresa,Cargo,Status\n”+mkR(cads).map(function(r){return r.map(function(v){return’”’+v+’”’;}).join(”,”);}).join(”\n”),“text/csv”,“Cadastros.csv”);}
function exCsvL(){if(lista)dl(“Nome,CPF,RG,Email,Telefone,Nascimento,Setor,Empresa,Cargo,Status\n”+mkR(lista.p).map(function(r){return r.map(function(v){return’”’+v+’”’;}).join(”,”);}).join(”\n”),“text/csv”,“Lista.csv”);}
function mkXls(rows,name){
var hdr=”<Row><Cell><Data ss:Type='String'>Nome</Data></Cell><Cell><Data ss:Type='String'>CPF</Data></Cell><Cell><Data ss:Type='String'>RG</Data></Cell><Cell><Data ss:Type='String'>Email</Data></Cell><Cell><Data ss:Type='String'>Telefone</Data></Cell><Cell><Data ss:Type='String'>Nascimento</Data></Cell><Cell><Data ss:Type='String'>Setor</Data></Cell><Cell><Data ss:Type='String'>Empresa</Data></Cell><Cell><Data ss:Type='String'>Cargo</Data></Cell><Cell><Data ss:Type='String'>Status</Data></Cell></Row>”;
var body=rows.map(function(r){return “<Row>”+r.map(function(v){return”<Cell><Data ss:Type='String'>”+String(v).replace(/&/g,”&”).replace(/</g,”<”)+”</Data></Cell>”;}).join(””)+”</Row>”;}).join(””);
dl(”<?xml version='1.0'?><Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet' xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'><Worksheet ss:Name='Dados'><Table>”+hdr+body+”</Table></Worksheet></Workbook>”,“application/vnd.ms-excel”,name+”.xls”);
}
function tab(t){
[“c”,“e”,“k”,“l”].forEach(function(x){q(“s”+x).classList.add(“gone”);q(“t”+x).classList.remove(“on”);});
q(“s”+t).classList.remove(“gone”);q(“t”+t).classList.add(“on”);
if(t===“l”)rLst();if(t===“k”)rCods();if(t===“e”)rEvs();
}
load();
setTimeout(function(){alert("JS rodando! Cads: "+cads.length);},2000);
});
