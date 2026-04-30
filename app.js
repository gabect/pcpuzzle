const parts = [
  ['cpu','CPU','cpu'],['ram','RAM','ram'],['gpu','GPU','gpu'],['sound','Sound Card','sound'],['usb','USB Hub','usb'],
  ['hdd','HDD','hdd'],['fan','Fan Cooler','fan'],['psu','Power Supply','psu'],['keyboard','Keyboard','ioArea'],['mouse','Mouse','ioArea'],['monitor','Monitor','ioArea'],['sata','SATA Cable','ioArea']
];

const bin = document.getElementById('partsBin');
const tpl = document.getElementById('partTemplate');
const progress = document.getElementById('progress');
const cables = document.getElementById('cables');
const hintBtn = document.getElementById('hintBtn');
const targets = {
  cpu: document.querySelector('.cpu-socket'), ram: document.querySelector('.ram-slot'), gpu: document.querySelector('.gpu-slot'),
  sound: document.querySelector('.sound-slot'), usb: document.querySelector('.usb-slot'), hdd: document.getElementById('hddSlot'),
  fan: document.getElementById('fanSlot'), psu: document.getElementById('psuSlot'), ioArea: document.getElementById('ioArea')
};
let done = 0;

function decoratePart(node, id){
  const art = document.createElement('div');
  art.className = 'art';
  if(id==='cpu') art.innerHTML = '<svg viewBox="0 0 100 60"><rect x="18" y="10" width="64" height="40" rx="4" fill="#cfb874" stroke="#f5e4a8"/><rect x="30" y="22" width="40" height="16" fill="#8e7d4a"/></svg>';
  if(id==='gpu') art.innerHTML = '<svg viewBox="0 0 100 60"><rect x="6" y="16" width="70" height="28" rx="3" fill="#32404d" stroke="#9db2c2"/><circle cx="82" cy="30" r="11" fill="#20303d" stroke="#a8bfce"/><circle cx="82" cy="30" r="4" fill="#0f161d"/></svg>';
  if(id==='hdd') art.innerHTML = '<svg viewBox="0 0 100 60"><rect x="15" y="10" width="70" height="40" rx="5" fill="#c7cdd3" stroke="#7a8590"/><circle cx="42" cy="30" r="10" fill="#dfe6ed" stroke="#5b646d"/></svg>';
  if(id==='fan') art.innerHTML = '<svg viewBox="0 0 100 60"><circle cx="50" cy="30" r="20" fill="#2d3a45" stroke="#9fb4c5"/><path d="M50 30 L67 25 A18 18 0 0 1 58 43 Z" fill="#a7bac8"/><path d="M50 30 L42 13 A18 18 0 0 1 61 17 Z" fill="#a7bac8"/><path d="M50 30 L33 35 A18 18 0 0 1 41 17 Z" fill="#a7bac8"/></svg>';
  if(art.innerHTML) node.appendChild(art);
}

parts.forEach(([id,label,slot])=>{
  const n = tpl.content.firstElementChild.cloneNode(true);
  n.classList.add(id); n.dataset.id=id; n.dataset.slot=slot; n.querySelector('.label').textContent=label;
  n.addEventListener('dragstart',e=>{ if(n.classList.contains('installed')) return e.preventDefault(); e.dataTransfer.setData('text',id); });
  decoratePart(n,id);
  bin.appendChild(n);
});

Object.entries(targets).forEach(([key,node])=>{
  node.addEventListener('dragover',e=>e.preventDefault());
  node.addEventListener('drop',e=>{
    e.preventDefault();
    const id=e.dataTransfer.getData('text');
    const part=document.querySelector(`.part[data-id="${id}"]`);
    if(!part || part.classList.contains('installed')) return;
    if(part.dataset.slot!==key) return;
    part.classList.add('installed');
    part.style.position='absolute'; part.style.width=(id==='ram'?'120px':'95px');
    part.style.left=`${10+Math.random()*70}%`; part.style.top=`${8+Math.random()*70}%`;
    node.appendChild(part); drawCable(node); done++; update();
  });
});

function drawCable(node){
  const b=bin.getBoundingClientRect(), t=node.getBoundingClientRect(), p=document.querySelector('.board').getBoundingClientRect();
  const x1=b.right-p.left, y1=b.top+b.height/2-p.top, x2=t.left+t.width/2-p.left, y2=t.top+t.height/2-p.top;
  const c=document.createElementNS('http://www.w3.org/2000/svg','path');
  c.setAttribute('class','cable');
  c.setAttribute('d',`M ${x1} ${y1} C ${(x1+x2)/2+80} ${y1-40}, ${(x1+x2)/2-50} ${y2+40}, ${x2} ${y2}`);
  cables.appendChild(c);
}
function update(){progress.textContent=`${done} / ${parts.length} instaladas`; if(done===parts.length) progress.textContent='✅ Ensamble finalizado';}

hintBtn.addEventListener('click',()=>document.querySelectorAll('.slot').forEach(s=>s.style.background='rgba(48,126,182,.35)'));
document.getElementById('resetBtn').addEventListener('click',()=>location.reload());

(function drawGrain(){
  const c=document.getElementById('grain'),ctx=c.getContext('2d');
  c.width=c.clientWidth; c.height=c.clientHeight;
  ctx.fillStyle='#68472d'; ctx.fillRect(0,0,c.width,c.height);
  for(let y=0;y<c.height;y+=3){ctx.fillStyle=`rgba(${80+Math.random()*40},${50+Math.random()*30},${30+Math.random()*20},0.22)`;ctx.fillRect(0,y,c.width,2)}
})();
update();
