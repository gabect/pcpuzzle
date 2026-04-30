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

parts.forEach(([id,label,slot])=>{
  const n = tpl.content.firstElementChild.cloneNode(true);
  n.classList.add(id); n.dataset.id=id; n.dataset.slot=slot; n.querySelector('.label').textContent=label;
  n.addEventListener('dragstart',e=>{ if(n.classList.contains('installed')) return e.preventDefault(); e.dataTransfer.setData('text',id); });
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
