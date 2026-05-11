/* ═══════════════════════════════════════
   practice.js — Interactive Practice Module
   5 challenges: XOR, Step Order, Binary XOR, Quiz, Formula Fill
   ═══════════════════════════════════════ */

// ── QUIZ DATA (indexed by lang key in i18n) ──
const QUIZ_DATA = {
  en: [
    { q:"What does HMAC stand for?", opts:["Hash-based Message Authentication Code","Highly Modified Asymmetric Cipher","Hashed MAC Address Control","Hash Method for Algorithm Computation"], ans:0, exp:"HMAC = Hash-based Message Authentication Code (RFC 2104)" },
    { q:"What is ipad in HMAC-SHA-256?", opts:["0x36 repeated 64 times","0x5C repeated 64 times","0xFF repeated 32 times","The secret key itself"], ans:0, exp:"ipad = 0x36 (00110110) repeated for each byte of the block size (64 bytes)" },
    { q:"What does the avalanche effect mean?", opts:["A tiny change in input causes ~50% of hash bits to change","The hash grows as the message grows","HMAC is slower on large inputs","Padding increases output size"], ans:0, exp:"Even a 1-bit change causes approximately half the hash bits to flip — this is a critical security property" },
    { q:"What is the output size of HMAC-SHA-256?", opts:["256 bits / 32 bytes / 64 hex chars","128 bits / 16 bytes","512 bits / 64 bytes","64 bits / 8 bytes"], ans:0, exp:"SHA-256 always produces 256 bits = 32 bytes = 64 hexadecimal characters" },
    { q:"Why does HMAC use two nested hash operations?", opts:["To prevent length-extension attacks","To make computation faster","To double the output size","To allow key rotation"], ans:0, exp:"Double hashing prevents length-extension attacks that would be possible with a simple prefix construction H(key ∥ message)" },
    { q:"What is opad in HMAC?", opts:["0x5C repeated 64 times","0x36 repeated 64 times","The message digest","A random nonce"], ans:0, exp:"opad = 0x5C (01011100) — the outer padding constant, used to differentiate the outer key from the inner key" },
    { q:"What happens if the key is longer than 64 bytes?", opts:["It is first hashed with SHA-256","It is truncated to 64 bytes","It is split into two keys","An error is returned"], ans:0, exp:"Keys longer than 64 bytes are first hashed with SHA-256 (→32 bytes), then zero-padded to 64 bytes" },
    { q:"What block size does SHA-256 use?", opts:["512 bits (64 bytes)","256 bits (32 bytes)","128 bits (16 bytes)","1024 bits (128 bytes)"], ans:0, exp:"SHA-256 processes data in 512-bit (64-byte) blocks — this is why the HMAC key is normalized to 64 bytes" },
    { q:"HMAC provides which security properties?", opts:["Integrity + Authenticity","Confidentiality only","Integrity only","Non-repudiation only"], ans:0, exp:"HMAC provides message integrity (not tampered) and message authenticity (sender knows the secret key)" },
    { q:"What operation combines the padded key with ipad and opad?", opts:["XOR (exclusive or)","AND operation","OR operation","Addition modulo 256"], ans:0, exp:"XOR (exclusive or) is used: each byte of K' is XOR'd with 0x36 (ipad) or 0x5C (opad)" },
    { q:"In the HMAC formula, what does K' represent?", opts:["Key normalized to 64 bytes","The original secret key","The message hash","A random session key"], ans:0, exp:"K' is the padded (or hashed+padded) version of the original key K, normalized to exactly 64 bytes" },
    { q:"Which RFC defines HMAC?", opts:["RFC 2104","RFC 4346","RFC 7519","RFC 5246"], ans:0, exp:"HMAC is defined in RFC 2104, published in 1997 by H. Krawczyk, M. Bellare, and R. Canetti" },
  ],
  ru: [
    { q:"Что означает аббревиатура HMAC?", opts:["Код аутентификации сообщений на основе хеша","Высокозащищённый асимметричный шифр","Контроль MAC-адреса хеша","Метод хеша для вычисления алгоритма"], ans:0, exp:"HMAC = Hash-based Message Authentication Code (RFC 2104)" },
    { q:"Что такое ipad в HMAC-SHA-256?", opts:["0x36, повторённый 64 раза","0x5C, повторённый 64 раза","0xFF, повторённый 32 раза","Сам секретный ключ"], ans:0, exp:"ipad = 0x36 (00110110), повторяется для каждого байта блока (64 байта)" },
    { q:"Что означает лавинный эффект?", opts:["Малое изменение → ~50% битов хеша меняются","Хеш растёт с ростом сообщения","HMAC медленнее на больших данных","Дополнение увеличивает размер вывода"], ans:0, exp:"Изменение даже 1 бита меняет примерно половину бит хеша — ключевое свойство безопасности" },
    { q:"Каков размер выхода HMAC-SHA-256?", opts:["256 бит / 32 байта / 64 шестн. символа","128 бит / 16 байт","512 бит / 64 байта","64 бита / 8 байт"], ans:0, exp:"SHA-256 всегда выдаёт 256 бит = 32 байта = 64 шестнадцатеричных символа" },
    { q:"Зачем HMAC использует два вложенных хеша?", opts:["Для предотвращения атак расширения длины","Для ускорения вычислений","Для удвоения размера вывода","Для ротации ключей"], ans:0, exp:"Двойное хеширование предотвращает атаки расширения длины, возможные при простой конструкции H(ключ ∥ сообщение)" },
    { q:"Что такое opad в HMAC?", opts:["0x5C, повторённый 64 раза","0x36, повторённый 64 раза","Дайджест сообщения","Случайный одноразовый номер"], ans:0, exp:"opad = 0x5C (01011100) — внешняя константа заполнения, отличает внешний ключ от внутреннего" },
    { q:"Что происходит если ключ длиннее 64 байт?", opts:["Сначала хешируется SHA-256","Усекается до 64 байт","Делится на два ключа","Возвращается ошибка"], ans:0, exp:"Ключи длиннее 64 байт сначала хешируются SHA-256 (→32 байта), затем дополняются нулями до 64 байт" },
    { q:"Какой размер блока использует SHA-256?", opts:["512 бит (64 байта)","256 бит (32 байта)","128 бит (16 байт)","1024 бит (128 байт)"], ans:0, exp:"SHA-256 обрабатывает данные блоками по 512 бит (64 байта) — поэтому ключ HMAC нормализуется до 64 байт" },
    { q:"Какие свойства безопасности обеспечивает HMAC?", opts:["Целостность + Подлинность","Только конфиденциальность","Только целостность","Только неотказуемость"], ans:0, exp:"HMAC обеспечивает целостность (не изменено) и подлинность (отправитель знает ключ)" },
  ]
};

// Drag order is language-aware — uses translation keys drag_step1..5
// Items are tagged with data-step="1".."5" for comparison
function getCorrectDragOrder() {
  return [1,2,3,4,5].map(i => t('drag_step' + i));
}

let practiceState = {
  activeTab: 'xor',
  mcIndex: 0,
  mcAnswered: false,
  practiceScore: 0
};

// ── TAB NAVIGATION ──
function switchPracticeTab(tab) {
  practiceState.activeTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  document.getElementById('tab-' + tab).classList.add('active');
}

// ── INIT PRACTICE ──
function initPractice() {
  initXORPractice();
  initDragPractice();
  initBinaryXOR();
  loadMCQuestion();
  initFillFormula();
  // Activate first tab
  switchPracticeTab('xor');
}

// ── CHALLENGE 1: XOR Practice ──
const XOR_KEY_BYTES = [0x6b, 0x65, 0x79, 0x00, 0x2a, 0x3F, 0x10, 0xAB];
const XOR_IPAD = 0x36;

function initXORPractice() {
  const area = document.getElementById('xor-practice-area');
  if (!area) return;
  area.innerHTML = XOR_KEY_BYTES.map((b, i) => `
    <div class="xor-row anim-row">
      <span class="xor-label" style="color:var(--accent2)">0x${toHex(b)}</span>
      <span style="font-size:11px;color:var(--muted);font-family:monospace">(${byteToBin(b)})</span>
      <span class="xor-op">⊕</span>
      <span class="xor-label" style="color:var(--success)">0x${toHex(XOR_IPAD)}</span>
      <span style="font-size:11px;color:var(--muted);font-family:monospace">(${byteToBin(XOR_IPAD)})</span>
      <span style="color:var(--muted)">=</span>
      <input class="xor-input" id="xor-ans-${i}" placeholder="??" maxlength="2" oninput="this.value=this.value.toUpperCase()">
    </div>`).join('');
  document.getElementById('xor-feedback').style.display = 'none';
  document.getElementById('xor-score').textContent = '';
  // Render the hex calculator panel
  renderHexCalculator();
}

function checkXOR() {
  let correct = 0;
  XOR_KEY_BYTES.forEach((b, i) => {
    const inp = document.getElementById('xor-ans-' + i);
    const expected = toHex(b ^ XOR_IPAD).toUpperCase();
    const given = (inp.value || '').toUpperCase();
    inp.classList.remove('correct-input', 'wrong-input');
    if (given === expected) { inp.classList.add('correct-input'); correct++; }
    else { inp.classList.add('wrong-input'); }
  });

  const fb = document.getElementById('xor-feedback');
  fb.style.display = 'block';
  if (correct === XOR_KEY_BYTES.length) {
    fb.className = 'quiz-feedback correct';
    fb.textContent = t('xor_correct');
    addPracticeScore(10);
  } else {
    fb.className = 'quiz-feedback wrong';
    fb.textContent = t('xor_wrong') + XOR_KEY_BYTES.map((b, i) => `[${i}] 0x${toHex(b)}⊕0x${toHex(XOR_IPAD)}=0x${toHex(b^XOR_IPAD).toUpperCase()}`).join(', ');
  }
  document.getElementById('xor-score').textContent = `${correct}/${XOR_KEY_BYTES.length}`;
}

// ── CHALLENGE 2: Drag & Drop ──
function initDragPractice() {
  const CORRECT_DRAG_ORDER = getCorrectDragOrder();
  const shuffled = [...CORRECT_DRAG_ORDER].sort(() => Math.random() - .5);
  const src = document.getElementById('drag-source');
  const tgt = document.getElementById('drag-target');
  if (!src || !tgt) return;
  src.innerHTML = '';
  tgt.innerHTML = '';
  document.getElementById('drag-feedback').style.display = 'none';

  shuffled.forEach(step => {
    const stepIdx = getCorrectDragOrder().indexOf(step) + 1;
    src.appendChild(createDragItem(step, stepIdx));
  });

  setupDropZone(src);
  setupDropZone(tgt);
}

function createDragItem(text, stepIdx) {
  const el = document.createElement('div');
  el.className = 'drag-item';
  el.textContent = text;
  el.draggable = true;
  if (stepIdx !== undefined) el.setAttribute('data-step', stepIdx);
  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text', text);
    e.dataTransfer.setData('step', stepIdx !== undefined ? stepIdx : '');
    el.style.opacity = '.5';
  });
  el.addEventListener('dragend', () => { el.style.opacity = '1'; });
  return el;
}

function setupDropZone(zone) {
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const text = e.dataTransfer.getData('text');
    const stepIdx = e.dataTransfer.getData('step');
    // Remove from both zones
    document.querySelectorAll('.drag-item').forEach(el => {
      if (el.textContent === text) el.remove();
    });
    zone.appendChild(createDragItem(text, stepIdx ? parseInt(stepIdx) : undefined));
    setupDropZone(document.getElementById('drag-source'));
    setupDropZone(document.getElementById('drag-target'));
  });
}

function checkDragOrder() {
  const tgt = document.getElementById('drag-target');
  const items = Array.from(tgt.children);
  // Compare by data-step index (language-independent)
  const steps = items.map(c => parseInt(c.getAttribute('data-step') || '0'));
  const correct = JSON.stringify(steps) === JSON.stringify([1,2,3,4,5]) && items.length === 5;
  const fb = document.getElementById('drag-feedback');
  fb.style.display = 'block';
  if (correct) {
    fb.className = 'quiz-feedback correct';
    fb.textContent = t('drag_correct');
    tgt.classList.add('correct-zone');
    addPracticeScore(15);
  } else {
    fb.className = 'quiz-feedback wrong';
    fb.textContent = t('drag_wrong') + getCorrectDragOrder().join(' → ');
    tgt.classList.remove('correct-zone');
  }
}

function resetDrag() {
  document.getElementById('drag-target').classList.remove('correct-zone');
  initDragPractice();
}

// ── CHALLENGE 3: Binary XOR ──
let binXORData = { a: [], b: [], answer: [], userAnswer: [] };

function initBinaryXOR() {
  // Generate 8 random bit pairs
  binXORData.a = Array.from({length: 8}, () => Math.round(Math.random()));
  binXORData.b = Array.from({length: 8}, () => Math.round(Math.random()));
  binXORData.answer = binXORData.a.map((bit, i) => bit ^ binXORData.b[i]);
  binXORData.userAnswer = new Array(8).fill(-1); // -1 = unanswered
  renderBinaryXOR();
}

function renderBinaryXOR() {
  const area = document.getElementById('binary-xor-area');
  if (!area) return;
  area.innerHTML = `
    <div style="display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;margin-bottom:8px">
      <span style="font-size:13px;font-weight:700;color:var(--accent2);min-width:60px">Byte A:</span>
      <div class="bit-grid">${binXORData.a.map((b,i) => `<div class="bit-cell ${b?'bit-1':'bit-0'}">${b}</div>`).join('')}</div>
    </div>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;margin-bottom:8px">
      <span style="font-size:13px;font-weight:700;color:var(--success);min-width:60px">⊕ Byte B:</span>
      <div class="bit-grid">${binXORData.b.map((b,i) => `<div class="bit-cell ${b?'bit-1':'bit-0'}">${b}</div>`).join('')}</div>
    </div>
    <div style="display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;margin-bottom:12px">
      <span style="font-size:13px;font-weight:700;color:var(--warn);min-width:60px">= Result:</span>
      <div class="bit-grid" id="bin-answer-grid">${binXORData.userAnswer.map((b,i) => `<div class="bit-cell answer ${b===-1?'':b?'selected-1':'bit-0'}" onclick="toggleBit(${i})">${b===-1?'?':b}</div>`).join('')}</div>
    </div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:12px">
      Decimal: A=${parseInt(binXORData.a.join(''),2)}, B=${parseInt(binXORData.b.join(''),2)}, A⊕B=?
    </div>`;
  document.getElementById('bin-feedback').style.display = 'none';
}

function toggleBit(idx) {
  const cur = binXORData.userAnswer[idx];
  binXORData.userAnswer[idx] = cur === -1 ? 1 : cur === 1 ? 0 : 1;
  const grid = document.getElementById('bin-answer-grid');
  if (!grid) return;
  grid.innerHTML = binXORData.userAnswer.map((b, i) => {
    let cls = 'answer ';
    if (b === -1) cls += '';
    else if (b === 1) cls += 'selected-1';
    else cls += 'bit-0';
    return `<div class="bit-cell ${cls}" onclick="toggleBit(${i})">${b === -1 ? '?' : b}</div>`;
  }).join('');
}

function checkBinaryXOR() {
  const allAnswered = !binXORData.userAnswer.includes(-1);
  if (!allAnswered) { showNotif('Click all 8 result bits first!', '⚠️'); return; }
  let correct = 0;
  const grid = document.getElementById('bin-answer-grid');
  grid.innerHTML = binXORData.userAnswer.map((b, i) => {
    const isRight = b === binXORData.answer[i];
    if (isRight) correct++;
    return `<div class="bit-cell ${isRight ? 'correct-bit' : 'wrong-bit'}">${b}</div>`;
  }).join('');

  const fb = document.getElementById('bin-feedback');
  fb.style.display = 'block';
  if (correct === 8) {
    fb.className = 'quiz-feedback correct';
    fb.textContent = t('bin_correct') + ` A(${parseInt(binXORData.a.join(''),2)}) ⊕ B(${parseInt(binXORData.b.join(''),2)}) = ${parseInt(binXORData.answer.join(''),2)}`;
    addPracticeScore(8);
  } else {
    fb.className = 'quiz-feedback wrong';
    fb.textContent = t('bin_wrong') + ` Correct: ${binXORData.answer.join('')} = ${parseInt(binXORData.answer.join(''),2)}`;
  }
}

// ── CHALLENGE 4: Multiple Choice Quiz ──
let mcState = { index: 0, answered: false };

function loadMCQuestion() {
  const pool = QUIZ_DATA[currentLang] || QUIZ_DATA['en'];
  mcState.index = Math.floor(Math.random() * pool.length);
  mcState.answered = false;
  const q = pool[mcState.index];
  document.getElementById('mc-question').textContent = q.q;
  document.getElementById('mc-options').innerHTML = q.opts.map((o, i) =>
    `<div class="quiz-option" onclick="answerMC(${i})">${o}</div>`
  ).join('');
  document.getElementById('mc-feedback').style.display = 'none';
}

function answerMC(choice) {
  if (mcState.answered) return;
  mcState.answered = true;
  const pool = QUIZ_DATA[currentLang] || QUIZ_DATA['en'];
  const q = pool[mcState.index];
  const opts = document.querySelectorAll('#mc-options .quiz-option');
  opts.forEach(o => o.classList.add('disabled'));
  opts[q.ans].classList.add('correct');
  if (choice !== q.ans) opts[choice].classList.add('wrong');

  const fb = document.getElementById('mc-feedback');
  fb.style.display = 'block';
  if (choice === q.ans) {
    fb.className = 'quiz-feedback correct';
    fb.textContent = '✅ ' + (q.exp || 'Correct!');
    addPracticeScore(5);
  } else {
    fb.className = 'quiz-feedback wrong';
    fb.textContent = '❌ ' + (q.exp || 'Incorrect.');
  }
}

// ── CHALLENGE 5: Formula Fill ──
const FORMULA_BLANKS = ['H', "K'", 'opad', 'H', "K'", 'ipad', 'm'];
const FORMULA_CHOICES = ['H', "K'", 'ipad', 'opad', 'm', 'SHA-1', 'K', 'md5'];
let fillState = [];

function initFillFormula() {
  fillState = new Array(FORMULA_BLANKS.length).fill('');
  renderFillFormula();
}

function renderFillFormula() {
  const area = document.getElementById('fill-formula-area');
  if (!area) return;

  const blanks = fillState.map((val, i) =>
    `<select class="formula-blank-select" id="blank-${i}" onchange="fillState[${i}]=this.value">
      <option value="">___</option>
      ${FORMULA_CHOICES.map(c => `<option value="${c}" ${val===c?'selected':''}>${c}</option>`).join('')}
    </select>`
  );

  area.innerHTML = `
    <div style="background:var(--code-bg);border:1px solid var(--border);border-radius:10px;padding:20px;text-align:center;font-family:monospace;font-size:15px;line-height:3;margin-bottom:16px;overflow-x:auto">
      HMAC(K,m) = ${blanks[0]}( (${blanks[1]} ⊕ ${blanks[2]}) ∥ ${blanks[3]}( (${blanks[4]} ⊕ ${blanks[5]}) ∥ ${blanks[6]} ) )
    </div>
    <div style="font-size:13px;color:var(--muted)">
      Choose from: ${FORMULA_CHOICES.map(c=>`<code style="background:var(--bg);padding:2px 6px;border-radius:4px;margin:2px">${c}</code>`).join('')}
    </div>`;

  // Style the selects
  area.querySelectorAll('.formula-blank-select').forEach(sel => {
    sel.style.cssText = 'background:var(--card);color:var(--text);border:2px solid var(--accent2);border-radius:6px;padding:4px 6px;font-family:monospace;font-size:14px;margin:0 4px;cursor:pointer;';
  });

  document.getElementById('fill-feedback').style.display = 'none';
}

function checkFillFormula() {
  // Re-read select values
  FORMULA_BLANKS.forEach((_, i) => {
    const sel = document.getElementById('blank-' + i);
    if (sel) fillState[i] = sel.value;
  });

  const correct = fillState.every((val, i) => val === FORMULA_BLANKS[i]);
  const fb = document.getElementById('fill-feedback');
  fb.style.display = 'block';

  if (correct) {
    fb.className = 'quiz-feedback correct';
    fb.textContent = '✅ Perfect! HMAC(K,m) = H( (K\'⊕opad) ∥ H( (K\'⊕ipad) ∥ m ) )';
    addPracticeScore(20);
  } else {
    const wrongBlanks = fillState.map((v, i) => v !== FORMULA_BLANKS[i] ? `blank ${i+1} (should be ${FORMULA_BLANKS[i]})` : null).filter(Boolean);
    fb.className = 'quiz-feedback wrong';
    fb.textContent = `❌ Wrong: ${wrongBlanks.join(', ')}. Try again!`;
  }
}


// ══════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════
// HEX / BIN CALCULATOR — Challenge 1 (XOR Practice)
// ══════════════════════════════════════════════════════════════════

let _calc = { cur: '', op: null, first: null, done: false };
let _calcMode = 'hex'; // 'hex' | 'bin'

/* ── internal helpers ── */
function _calcGetVal() {
  if (!_calc.cur) return 0;
  return _calcMode === 'hex' ? parseInt(_calc.cur, 16) : parseInt(_calc.cur, 2);
}
function _calcFromInt(n) {
  n = n & 0xFF;
  return _calcMode === 'hex'
    ? n.toString(16).toUpperCase().padStart(2, '0')
    : n.toString(2).padStart(8, '0');
}
function _calcMaxLen() { return _calcMode === 'hex' ? 2 : 8; }
function _calcFmtVal(intVal) {
  const h = '0x' + intVal.toString(16).toUpperCase().padStart(2,'0');
  const b = intVal.toString(2).padStart(8,'0').replace(/(.{4})/,'$1 ').trim();
  return _calcMode === 'hex' ? h : b;
}

function _calcUpdateDisplay(exprOverride) {
  const hexEl  = document.getElementById('calc-primary');
  const binEl  = document.getElementById('calc-secondary');
  const decEl  = document.getElementById('calc-decimal');
  const exprEl = document.getElementById('calc-expr');
  if (!hexEl) return;

  const raw = _calc.cur || (_calcMode === 'hex' ? '00' : '00000000');
  const val = _calcMode === 'hex' ? parseInt(raw, 16) : parseInt(raw, 2);
  const hexStr = '0x' + val.toString(16).toUpperCase().padStart(2,'0');
  const binStr = val.toString(2).padStart(8,'0').replace(/(.{4})/,'$1 ').trim();

  if (_calcMode === 'hex') {
    hexEl.textContent = hexStr;
    hexEl.style.fontSize = '28px';
    hexEl.style.letterSpacing = '3px';
    binEl.textContent = binStr;
  } else {
    hexEl.textContent = binStr;
    hexEl.style.fontSize = '20px';
    hexEl.style.letterSpacing = '4px';
    binEl.textContent = hexStr;
  }
  decEl.textContent = '= ' + val;

  // Expression line
  if (exprEl) {
    if (exprOverride !== undefined) {
      exprEl.textContent = exprOverride;
    } else if (_calc.op && _calc.first !== null) {
      exprEl.textContent = _calcFmtVal(_calc.first) + ' ' + _calc.op;
    } else {
      exprEl.textContent = '';
    }
  }

  // Operator button highlight
  ['xor','and','or'].forEach(op => {
    const btn = document.getElementById('calcbtn-' + op);
    if (!btn) return;
    const active = _calc.op === op.toUpperCase();
    btn.classList.toggle('calc-op-active', active);
  });

  // Disable non-binary digit buttons in BIN mode
  document.querySelectorAll('.calc-digit-btn[data-k]').forEach(btn => {
    const k = btn.getAttribute('data-k');
    const enabled = _calcMode === 'hex' || k === '0' || k === '1';
    btn.classList.toggle('calc-digit-disabled', !enabled);
  });

  // Mode label
  const modeEl = document.getElementById('calc-mode-lbl');
  if (modeEl) {
    modeEl.textContent = _calcMode.toUpperCase();
    modeEl.className = 'calc-mode-lbl calc-mode-' + _calcMode;
  }

  // Tip text
  const tipEl = document.getElementById('calc-tip-text');
  if (tipEl) {
    tipEl.textContent = _calcMode === 'hex'
      ? 'Enter hex value → XOR → value → ='
      : 'Enter 8 bits → XOR → 8 bits → =';
  }
}

/* ── public calc functions ── */
function calcKey(k) {
  if (k === '⌫') {
    _calc.cur  = _calc.cur.slice(0, -1);
    _calc.done = false;
    return _calcUpdateDisplay();
  }
  if (_calcMode === 'bin' && k !== '0' && k !== '1') return;
  if (_calc.done) { _calc.cur = ''; _calc.done = false; }
  const maxLen = _calcMaxLen();
  if (_calc.cur.length < maxLen) {
    _calc.cur = _calcMode === 'hex'
      ? (_calc.cur + k).replace(/^0+/, '') || '0'
      : _calc.cur + k;
  }
  _calcUpdateDisplay();
}

function calcOp(op) {
  if (_calc.cur === '' && _calc.first === null) return;
  _calc.first = _calc.cur !== '' ? _calcGetVal() : _calc.first || 0;
  _calc.op   = op;
  _calc.done = true;
  _calcUpdateDisplay();
}

function calcEquals() {
  if (_calc.op === null || _calc.first === null || _calc.cur === '') return;
  const a = _calc.first, b = _calcGetVal();
  let res;
  if      (_calc.op === 'XOR') res = a ^ b;
  else if (_calc.op === 'AND') res = a & b;
  else if (_calc.op === 'OR')  res = a | b;
  res &= 0xFF;
  const expr = _calcFmtVal(a) + ' ' + _calc.op + ' ' + _calcFmtVal(b) + ' =';
  _calc = { cur: _calcFromInt(res), op: null, first: null, done: true };
  _calcUpdateDisplay(expr);
}

function calcNOT() {
  if (_calc.cur === '') return;
  const v = _calcGetVal(), r = (~v) & 0xFF;
  const expr = 'NOT ' + _calcFmtVal(v) + ' =';
  _calc.cur  = _calcFromInt(r);
  _calc.done = true;
  _calcUpdateDisplay(expr);
}

function calcClear() {
  _calc = { cur: '', op: null, first: null, done: false };
  _calcUpdateDisplay('');
}

function toggleCalcMode() {
  const curVal = _calc.cur !== '' ? _calcGetVal() : null;
  _calcMode = _calcMode === 'hex' ? 'bin' : 'hex';
  if (curVal !== null) _calc.cur = _calcFromInt(curVal);
  // Operator first-operand stays as integer, no conversion needed
  _calcUpdateDisplay();
}

/* ── render ── */
function renderHexCalculator() {
  const container = document.getElementById('hex-calc-container');
  if (!container) return;

  // All 16 hex digits in order (D is at correct position now)
  const digits = ['7','8','9','A','4','5','6','B','1','2','3','C','0','D','E','F'];

  const dBtn = k => `<button class="calc-digit-btn" data-k="${k}" onclick="calcKey('${k}')">${k}</button>`;

  container.innerHTML = `
    <div class="calc-wrapper">

      <!-- Title bar -->
      <div class="calc-titlebar">
        <span class="calc-title-icon">⬢</span>
        <span class="calc-title-text">CALCULATOR</span>
        <span id="calc-mode-lbl" class="calc-mode-lbl calc-mode-hex">HEX</span>
        <button class="calc-mode-toggle" onclick="toggleCalcMode()" title="Switch HEX ↔ BIN">⇌</button>
      </div>

      <!-- Expression -->
      <div id="calc-expr" class="calc-expr"></div>

      <!-- Display -->
      <div class="calc-display">
        <div id="calc-primary"   class="calc-primary">0x00</div>
        <div id="calc-secondary" class="calc-secondary">0000 0000</div>
        <div id="calc-decimal"   class="calc-decimal">= 0</div>
      </div>

      <!-- Digit grid: 4×4 (all 16 hex digits) -->
      <div class="calc-digit-grid">
        ${digits.map(dBtn).join('')}
      </div>

      <!-- Backspace full-width -->
      <button class="calc-digit-btn calc-backspace" data-k="⌫" onclick="calcKey('⌫')">⌫</button>

      <!-- Operators -->
      <div class="calc-op-grid">
        <button id="calcbtn-xor" class="calc-op-btn calc-op-xor" onclick="calcOp('XOR')">XOR</button>
        <button id="calcbtn-and" class="calc-op-btn"             onclick="calcOp('AND')">AND</button>
        <button id="calcbtn-or"  class="calc-op-btn"             onclick="calcOp('OR')">OR</button>
        <button                  class="calc-op-btn"             onclick="calcNOT()">NOT</button>
      </div>

      <!-- = and CLR -->
      <div class="calc-bottom">
        <button class="calc-equals" onclick="calcEquals()">=</button>
        <button class="calc-clr"    onclick="calcClear()">CLR</button>
      </div>

      <!-- Tip -->
      <div class="calc-tip">
        <span id="calc-tip-text">Enter hex value → XOR → value → =</span>
      </div>
    </div>`;

  _calcUpdateDisplay('');
}

// ── SCORE ──
function addPracticeScore(pts) {
  practiceState.practiceScore += pts;
  const el = document.getElementById('practice-total-score');
  if (el) el.textContent = practiceState.practiceScore;
  // Update global state
  if (window.state) {
    window.state.stats.practice += pts;
    saveState();
    updateDashboard();
  }
}

// ── THEORY QUIZ (used from main.js) ──
const THEORY_QUIZ = {
  en: QUIZ_DATA.en,
  ru: QUIZ_DATA.ru
};

let theoryState = { index: 0, answered: false };

function loadTheoryQuiz() { showTheoryQuestion(0); }

function showTheoryQuestion(idx) {
  theoryState.index = idx;
  theoryState.answered = false;
  const pool = QUIZ_DATA[currentLang] || QUIZ_DATA['en'];
  const q = pool[idx % pool.length];
  document.getElementById('quiz-q').textContent = q.q;
  document.getElementById('quiz-options').innerHTML = q.opts.map((o, i) =>
    `<div class="quiz-option" onclick="answerTheory(${i})">${o}</div>`
  ).join('');
  const fb = document.getElementById('quiz-feedback');
  fb.style.display = 'none';
  fb.className = 'quiz-feedback';
  document.getElementById('quiz-next').style.display = 'none';
  const pool2 = QUIZ_DATA[currentLang] || QUIZ_DATA['en'];
  document.getElementById('quiz-progress').textContent = `Q ${(idx % pool2.length) + 1} / ${pool2.length}`;
}

function answerTheory(choice) {
  if (theoryState.answered) return;
  theoryState.answered = true;
  const pool = QUIZ_DATA[currentLang] || QUIZ_DATA['en'];
  const q = pool[theoryState.index % pool.length];
  const opts = document.querySelectorAll('#quiz-options .quiz-option');
  opts.forEach(o => o.classList.add('disabled'));
  opts[q.ans].classList.add('correct');
  if (choice !== q.ans) opts[choice].classList.add('wrong');

  const fb = document.getElementById('quiz-feedback');
  fb.style.display = 'block';
  if (choice === q.ans) {
    fb.className = 'quiz-feedback correct';
    fb.textContent = '✅ ' + q.exp;
    if (window.state) { window.state.stats.practice++; saveState(); }
  } else {
    fb.className = 'quiz-feedback wrong';
    fb.textContent = '❌ ' + q.exp;
  }
  document.getElementById('quiz-next').style.display = 'inline-block';
  if (window.state) {
    window.state.stats.theory = Math.min(100, (window.state.stats.theory || 0) + Math.round(100 / pool.length));
    saveState();
  }
}

function nextTheoryQuestion() {
  showTheoryQuestion(theoryState.index + 1);
}

window.calcKey         = calcKey;
window.calcOp          = calcOp;
window.calcEquals      = calcEquals;
window.calcNOT         = calcNOT;
window.calcClear       = calcClear;
window.toggleCalcMode  = toggleCalcMode;
window.renderHexCalculator = renderHexCalculator;
window.initPractice      = initPractice;
window.switchPracticeTab = switchPracticeTab;
window.checkXOR          = checkXOR;
window.checkDragOrder    = checkDragOrder;
window.resetDrag         = resetDrag;
window.toggleBit         = toggleBit;
window.checkBinaryXOR    = checkBinaryXOR;
window.initBinaryXOR     = initBinaryXOR;
window.loadMCQuestion    = loadMCQuestion;
window.answerMC          = answerMC;
window.initFillFormula   = initFillFormula;
window.checkFillFormula  = checkFillFormula;
window.loadTheoryQuiz    = loadTheoryQuiz;
window.answerTheory      = answerTheory;
window.nextTheoryQuestion = nextTheoryQuestion;
