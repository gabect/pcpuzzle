const parts = [
  { id: 'cpu', label: 'CPU', slot: 'motherboard' },
  { id: 'ram', label: 'RAM', slot: 'motherboard' },
  { id: 'gpu', label: 'GPU', slot: 'motherboard' },
  { id: 'sound', label: 'Sound Card', slot: 'motherboard' },
  { id: 'usb', label: 'USB Ports', slot: 'motherboard' },
  { id: 'hdd', label: 'HDD', slot: 'hddSlot' },
  { id: 'fan', label: 'Fan', slot: 'fanSlot' },
  { id: 'psu', label: 'Power Supply', slot: 'psuSlot' },
  { id: 'keyboard', label: 'Keyboard', slot: 'motherboard' },
  { id: 'mouse', label: 'Mouse', slot: 'motherboard' },
  { id: 'monitor', label: 'Monitor', slot: 'motherboard' },
  { id: 'sata', label: 'SATA Cable', slot: 'motherboard' }
];

const bin = document.getElementById('partsBin');
const template = document.getElementById('partTemplate');
const progress = document.getElementById('progress');
const resetBtn = document.getElementById('resetBtn');
const board = document.querySelector('.board');
const cablesSvg = document.getElementById('cables');
const motherboard = document.getElementById('motherboard');

const slots = {
  motherboard,
  hddSlot: document.getElementById('hddSlot'),
  fanSlot: document.getElementById('fanSlot'),
  psuSlot: document.getElementById('psuSlot')
};

let installed = 0;
const liveCables = [];

function makePart(p) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.classList.add(p.id);
  node.dataset.id = p.id;
  node.dataset.slot = p.slot;
  node.querySelector('.label').textContent = p.label;

  node.addEventListener('dragstart', (ev) => {
    if (node.classList.contains('installed')) return ev.preventDefault();
    node.classList.add('dragging');
    ev.dataTransfer.setData('text/plain', p.id);
  });

  node.addEventListener('dragend', () => node.classList.remove('dragging'));
  return node;
}

parts.forEach((p) => bin.appendChild(makePart(p)));

Object.values(slots).forEach((slotNode) => {
  slotNode.addEventListener('dragover', (ev) => {
    ev.preventDefault();
    slotNode.classList.add('drop-ok');
  });

  slotNode.addEventListener('dragleave', () => slotNode.classList.remove('drop-ok'));

  slotNode.addEventListener('drop', (ev) => {
    ev.preventDefault();
    slotNode.classList.remove('drop-ok');

    const id = ev.dataTransfer.getData('text/plain');
    const part = document.querySelector(`.part[data-id="${id}"]`);
    if (!part || part.classList.contains('installed')) return;

    const expected = part.dataset.slot;
    if (slotNode.id !== expected && expected !== 'motherboard') return;

    part.classList.add('installed');
    part.style.position = 'absolute';
    part.style.left = `${10 + Math.random() * 60}%`;
    part.style.top = `${10 + Math.random() * 70}%`;
    part.style.width = '100px';
    part.style.zIndex = 8;
    slotNode.appendChild(part);

    installed += 1;
    drawCable(slotNode);
    updateProgress();
  });
});

function drawCable(target) {
  const binRect = bin.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const x1 = binRect.right - boardRect.left;
  const y1 = binRect.top + 40 + Math.random() * (binRect.height - 80) - boardRect.top;
  const x2 = targetRect.left + targetRect.width / 2 - boardRect.left;
  const y2 = targetRect.top + targetRect.height / 2 - boardRect.top;
  const cx = (x1 + x2) / 2 + 40;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${y1 - 30} ${x2} ${y2}`);
  path.setAttribute('class', 'cable live');
  cablesSvg.appendChild(path);
  liveCables.push(path);
}

function updateProgress() {
  progress.textContent = `${installed} / ${parts.length} piezas instaladas`;
  if (installed === parts.length) {
    progress.textContent = '¡PC completada! Diagnóstico: OK';
  }
}

resetBtn.addEventListener('click', () => location.reload());
updateProgress();
