const parts = [
  { id: 'cpu', label: 'CPU', slot: 'motherboard' },
  { id: 'ram', label: 'RAM', slot: 'motherboard' },
  { id: 'gpu', label: 'GPU', slot: 'motherboard' },
  { id: 'sound', label: 'Sound Card', slot: 'motherboard' },
  { id: 'usb', label: 'USB Ports', slot: 'motherboard' },
  { id: 'hdd', label: 'HDD', slot: 'hddSlot' },
  { id: 'fan', label: 'Fan Cooler', slot: 'fanSlot' },
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

const slots = {
  motherboard: document.getElementById('motherboard'),
  hddSlot: document.getElementById('hddSlot'),
  fanSlot: document.getElementById('fanSlot'),
  psuSlot: document.getElementById('psuSlot')
};

const motherboardAnchors = [
  [12, 14], [28, 24], [46, 28], [23, 46], [57, 51], [17, 67], [44, 70], [34, 38]
];

let installed = 0;
let anchorIndex = 0;

function makePart(part) {
  const node = template.content.firstElementChild.cloneNode(true);
  node.classList.add(part.id);
  node.dataset.id = part.id;
  node.dataset.slot = part.slot;
  node.querySelector('.label').textContent = part.label;

  node.addEventListener('dragstart', (ev) => {
    if (node.classList.contains('installed')) return ev.preventDefault();
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', part.id);
    node.classList.add('dragging');
  });

  node.addEventListener('dragend', () => node.classList.remove('dragging'));
  return node;
}

parts.forEach((p) => bin.appendChild(makePart(p)));

Object.entries(slots).forEach(([slotKey, slotNode]) => {
  slotNode.addEventListener('dragover', (ev) => {
    ev.preventDefault();
    slotNode.classList.add('drop-ok');
  });

  slotNode.addEventListener('dragleave', () => slotNode.classList.remove('drop-ok'));

  slotNode.addEventListener('drop', (ev) => {
    ev.preventDefault();
    slotNode.classList.remove('drop-ok');

    const partId = ev.dataTransfer.getData('text/plain');
    const partNode = document.querySelector(`.part[data-id="${partId}"]`);
    if (!partNode || partNode.classList.contains('installed')) return;

    const expectedSlot = partNode.dataset.slot;
    const validDrop = expectedSlot === slotKey || (expectedSlot === 'motherboard' && slotKey === 'motherboard');
    if (!validDrop) return;

    installPart(partNode, slotNode, slotKey);
  });
});

function installPart(partNode, slotNode, slotKey) {
  partNode.classList.add('installed');
  partNode.style.position = 'absolute';
  partNode.style.width = partNode.classList.contains('ram') ? '120px' : '96px';
  partNode.style.zIndex = '10';

  if (slotKey === 'motherboard') {
    const [x, y] = motherboardAnchors[anchorIndex % motherboardAnchors.length];
    anchorIndex += 1;
    partNode.style.left = `${x}%`;
    partNode.style.top = `${y}%`;
  } else {
    partNode.style.left = `${12 + Math.random() * 52}%`;
    partNode.style.top = `${10 + Math.random() * 52}%`;
  }

  slotNode.appendChild(partNode);
  drawCable(slotNode);
  installed += 1;
  updateProgress();
}

function drawCable(target) {
  const binRect = bin.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const boardRect = board.getBoundingClientRect();

  const x1 = binRect.right - boardRect.left;
  const y1 = binRect.top + 30 + Math.random() * (binRect.height - 60) - boardRect.top;
  const x2 = targetRect.left + targetRect.width / 2 - boardRect.left;
  const y2 = targetRect.top + targetRect.height / 2 - boardRect.top;
  const bend = 55 + Math.random() * 40;
  const cx = (x1 + x2) / 2 + bend;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('class', 'cable live');
  path.setAttribute('d', `M ${x1} ${y1} C ${cx} ${y1 - 18}, ${cx - 25} ${y2 + 18}, ${x2} ${y2}`);
  path.style.strokeDasharray = '4 3';
  cablesSvg.appendChild(path);
}

function updateProgress() {
  progress.textContent = `${installed} / ${parts.length} piezas instaladas`;
  if (installed === parts.length) progress.textContent = '¡PC COMPLETA! Encendido y cableado correcto.';
}

resetBtn.addEventListener('click', () => window.location.reload());
updateProgress();
