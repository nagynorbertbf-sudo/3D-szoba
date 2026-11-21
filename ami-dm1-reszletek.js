(function(){
const w=window,gd=[...document.querySelectorAll('.js-plotly-plot')].find(g=>g.data&&g.data.length);
if(!gd){setTimeout(()=>{if(!window.__bedEnhanceTried){window.__bedEnhanceTried=true;eval('('+arguments.callee.toString()+')()')}},500);return;}
const P=w.Plotly;let active=false;let newIndices=[];let originals=[];
const bed=(t)=>/AMI DM1|Fejtámla|Matrac|kárpit|Ágytakaró|ágyneműtartó/i.test(t.hovertemplate||t.name||'');
const bedMeshes=[];gd.data.forEach((t,i)=>{if(t.type==='mesh3d'&&bed(t)){bedMeshes.push(i);originals.push({i,lighting:{...(t.lighting||{})},flatshading:t.flatshading})}});
function line(name,x,y,z,color,width){return {type:'scatter3d',mode:'lines',name,showlegend:false,hoverinfo:'skip',x,y,z,line:{color,width},visible:true}}
function details(){
const a=[];const dark='#14161b',seam='#3b3d43';
// Fine upholstery seam channels on the vertical headboard. All points use existing room cm coordinates.
for(let y=181;y<=285;y+=26){a.push(line('AMI DM1 · fejtámla kárpitvarrás',[4.1,4.1],[y,y],[45,77],seam,2.1));}
a.push(line('AMI DM1 · fejtámla felső él',[3.8,3.8],[173,292],[79.5,79.5],dark,3));
a.push(line('AMI DM1 · fejtámla oldalsó él',[3.8,3.8],[173,173],[43,79.5],dark,2));
a.push(line('AMI DM1 · fejtámla oldalsó él',[3.8,3.8],[292,292],[43,79.5],dark,2));
// The long lower upholstered edge is on the side opposite the headboard.
a.push(line('AMI DM1 · oldalkárpit alsó varrás',[8,202],[170.9,170.9],[40,40],seam,2));
a.push(line('AMI DM1 · oldalkárpit alsó varrás',[8,202],[294.1,294.1],[40,40],seam,2));
return a;
}
const box=document.createElement('div');box.id='bed-detail-tools';box.style='position:fixed;right:10px;top:10px;z-index:99999;background:#1b222de9;color:white;border:1px solid #78808b;border-radius:12px;padding:9px;font:13px system-ui;max-width:240px';
box.innerHTML='<b>AMI DM1 · ágy részletei</b><div style="margin-top:6px"><button id="bed-detail-toggle" style="padding:8px;border-radius:7px;background:#bd996d;color:#171717;border:0">Részletek bekapcsolása</button></div><small style="display:block;margin-top:5px;color:#e3e4e5">Kárpitvarrások és mattabb felületek. Az eredeti geometria nem változik.</small>';
document.body.appendChild(box);
const btn=box.querySelector('button');btn.onclick=async()=>{
btn.disabled=true;
try{
if(!active){
const a=details();const first=gd.data.length;await P.addTraces(gd,a);newIndices=a.map((_,i)=>first+i);
if(bedMeshes.length)await P.restyle(gd,{lighting:bedMeshes.map(()=>({ambient:.76,diffuse:.71,specular:.08,roughness:.93,fresnel:.025})),flatshading:bedMeshes.map(()=>false)},bedMeshes);
active=true;btn.textContent='Eredeti ágy visszaállítása';
}else{
if(newIndices.length){await P.deleteTraces(gd,newIndices);newIndices=[];}
if(bedMeshes.length){await P.restyle(gd,{lighting:originals.map(o=>o.lighting),flatshading:originals.map(o=>o.flatshading)},bedMeshes)}
active=false;btn.textContent='Részletek bekapcsolása';
}
}catch(e){box.querySelector('small').textContent='Nem sikerült módosítani: '+e.message}finally{btn.disabled=false}
};
})();