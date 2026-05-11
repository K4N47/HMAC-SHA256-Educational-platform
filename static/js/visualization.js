/* ═══════════════════════════════════════
   visualization.js — Step-by-Step HMAC Visualization
   ═══════════════════════════════════════ */

let vizData = null;
let currentStep = 0;
const TOTAL_STEPS = 5;

async function startVisualization() {
  const msg = document.getElementById('viz-msg').value.trim();
  const key = document.getElementById('viz-key').value.trim();
  if (!msg || !key) { showNotif(t('viz_fill'), '⚠️'); return; }

  // Show loading
  const area = document.getElementById('viz-area');
  area.style.display = 'block';
  area.innerHTML = `<div class="card" style="text-align:center;padding:40px">
    <div class="hash-spinner"></div>
    <div style="color:var(--muted);margin-top:12px;font-size:14px">Computing HMAC steps...</div>
  </div>`;

  vizData = await getStepData(key, msg);
  currentStep = 0;

  area.innerHTML = `
    <div class="card"><div class="step-bar" id="step-bar"></div></div>
    <div id="step-content-area"></div>
  `;

  buildStepBar();
  renderStepContent(0);
}

function buildStepBar() {
  const steps = t('viz_steps');
  const bar = document.getElementById('step-bar');
  if (!bar) return;
  bar.innerHTML = steps.map((s, i) => `
    <div class="step-node ${i===0?'active':''}" id="stepnode-${i}">
      <div class="step-circle" id="stepcircle-${i}">${i+1}</div>
      <div class="step-label">${s}</div>
    </div>`).join('');
}

function updateStepBar(active) {
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const node   = document.getElementById('stepnode-'+i);
    const circle = document.getElementById('stepcircle-'+i);
    if (!node) continue;
    node.classList.remove('active', 'done');
    if (i < active) { node.classList.add('done'); circle.textContent = '✓'; }
    else if (i === active) { node.classList.add('active'); circle.textContent = i+1; }
    else { circle.textContent = i+1; }
  }
}

function nextVizStep() {
  if (currentStep < TOTAL_STEPS - 1) {
    currentStep++;
    renderStepContent(currentStep);
  } else {
    // Restart
    currentStep = 0;
    renderStepContent(0);
    showNotif('Visualization restarted! 🔄', '🔄');
  }
}

function renderStepContent(step) {
  updateStepBar(step);
  const area = document.getElementById('step-content-area');
  if (!area || !vizData) return;

  switch (step) {
    case 0: area.innerHTML = renderStep1(); break;
    case 1: area.innerHTML = renderStep2(); break;
    case 2: area.innerHTML = renderStep3(); break;
    case 3: area.innerHTML = renderStep4(); break;
    case 4: area.innerHTML = renderStep5(); break;
  }
  area.querySelectorAll('.anim-row').forEach((el, i) => {
    el.style.animation = `slideIn .4s ease ${i * 0.08}s both`;
  });
}

// ── STEP 1: Key Normalization ──
function renderStep1() {
  const d = vizData;
  const padded = d.kPrime;
  const original = d.keyBytes;
  const zeroPadCount = 64 - Math.min(original.length, 64);

  return `
  <div class="card" style="animation:fadeIn .3s ease">
    <h3 style="margin-bottom:6px">${t('s1_title')}</h3>
    <div class="step-explain" data-i18n-html="s1_explain">${t('s1_explain')}</div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px">
      <div class="anim-row">
        <div style="font-size:12px;color:var(--accent2);font-weight:700;margin-bottom:8px">${t('s1_orig')}</div>
        <div class="hex-grid">${hexGridHTML(original, 'key-orig', 16)}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:6px">
          "${d.keyStr}" = ${original.length} byte${original.length!==1?'s':''}
        </div>
      </div>
      <div class="anim-row">
        <div style="font-size:12px;color:var(--muted);font-weight:700;margin-bottom:8px">${t('s1_padded')}</div>
        <div class="hex-grid">${hexGridHTML(padded, null, 16, original.length)}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:6px">
          = 64 bytes (original + ${zeroPadCount} × 0x00)
        </div>
      </div>
    </div>

    <div style="background:var(--bg);border-radius:8px;padding:14px;border:1px solid var(--border);margin-bottom:16px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px;font-weight:600">🔢 All 64 key bytes (K'):</div>
      <div class="hex-grid">${hexGridAllHTML(padded, original.length)}</div>
    </div>

    <div style="background:rgba(59,130,246,.06);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:12px;font-size:13px;color:var(--muted);margin-bottom:16px">
      <strong style="color:var(--text)">Key info:</strong>
      ${t('s1_info_pre')}${original.length}${t('s1_info_suf')}${zeroPadCount}${t('s1_info_suf2')}
      ${original.length > 64 ? '<br><span style="color:var(--warn)">⚠️ Key > 64 bytes: first hashed with SHA-256, then padded</span>' : ''}
    </div>

    <button class="btn btn-primary" onclick="nextVizStep()" style="margin-top:4px">${t('viz_next')}</button>
  </div>`;
}

// ── STEP 2: XOR with ipad ──
function renderStep2() {
  const d = vizData;
  const SHOW = 8; // show 8 bytes for clarity
  const kSlice  = d.kPrime.slice(0, SHOW);
  const iSlice  = d.ipad.slice(0, SHOW);
  const xSlice  = d.kIpad.slice(0, SHOW);

  const xorRows = Array.from({length: SHOW}, (_, i) => `
    <div class="anim-row" style="display:flex;align-items:center;gap:6px;margin-bottom:6px;background:var(--bg);border-radius:6px;padding:8px 10px;border:1px solid var(--border)">
      <span style="width:28px;text-align:center;font-size:11px;color:var(--muted)">[${i}]</span>
      <code style="color:var(--accent2);font-size:13px">${toHex(kSlice[i])}</code>
      <span style="color:var(--muted);font-size:13px;padding:0 2px">(${byteToBin(kSlice[i])})</span>
      <span style="color:var(--warn);font-weight:700;font-size:16px">⊕</span>
      <code style="color:var(--success);font-size:13px">${toHex(iSlice[i])}</code>
      <span style="color:var(--muted);font-size:13px;padding:0 2px">(${byteToBin(iSlice[i])})</span>
      <span style="color:var(--muted)">=</span>
      <code style="color:var(--warn);font-size:13px;font-weight:700">${toHex(xSlice[i])}</code>
      <span style="color:var(--muted);font-size:13px">(${byteToBin(xSlice[i])})</span>
    </div>`).join('');

  return `
  <div class="card" style="animation:fadeIn .3s ease">
    <h3 style="margin-bottom:6px">${t('s2_title')}</h3>
    <div class="step-explain">${t('s2_explain')}</div>

    <div style="background:var(--bg);border-radius:8px;padding:12px;border:1px solid var(--border);margin-bottom:16px;font-size:13px">
      <span style="color:var(--accent2);font-weight:700">ipad constant:</span>
      <code style="margin-left:8px;color:var(--success)">0x36 = 00110110</code>
      (decimal: 54)
    </div>

    <div style="font-size:12px;color:var(--muted);margin-bottom:10px;font-weight:600">
      First 8 bytes — byte-by-byte XOR operation:
    </div>
    ${xorRows}
    <div style="font-size:12px;color:var(--muted);margin:8px 0 16px">... and ${64-SHOW} more bytes follow the same pattern</div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px">
      <div>
        <div style="font-size:11px;color:var(--accent2);font-weight:700;margin-bottom:6px">${t('s2_kp')}</div>
        <div class="hex-grid">${hexGridHTML(d.kPrime, 'key-orig', 8)}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--success);font-weight:700;margin-bottom:6px">${t('s2_ipad')}</div>
        <div class="hex-grid">${hexGridHTML(d.ipad, 'ipad-byte', 8)}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--warn);font-weight:700;margin-bottom:6px">${t('s2_res')}</div>
        <div class="hex-grid">${hexGridHTML(d.kIpad, 'xor-result', 8)}</div>
      </div>
    </div>

    <button class="btn btn-primary" onclick="nextVizStep()">${t('viz_next')}</button>
  </div>`;
}

// ── STEP 3: Inner Hash ──
function renderStep3() {
  const d = vizData;
  const innerHex = hex(d.innerHash);
  const msgPreview = `${Array.from(d.kIpad.slice(0,4)).map(toHex).join('')}...`;

  return `
  <div class="card" style="animation:fadeIn .3s ease">
    <h3 style="margin-bottom:6px">${t('s3_title')}</h3>
    <div class="step-explain">${t('s3_explain')}</div>

    <div style="display:grid;grid-template-columns:1fr;gap:12px;margin-bottom:16px">
      <div style="background:var(--bg);border-radius:10px;padding:16px;border:1px solid var(--border)">
        <div style="font-size:12px;color:var(--muted);margin-bottom:8px;font-weight:600">${t('s3_input')}</div>
        <div style="font-family:monospace;font-size:13px;color:var(--accent);margin-bottom:8px">${t('s3_formula')}</div>
        <div style="font-size:12px;color:var(--muted)">
          = <span style="color:var(--warn)">[K'⊕ipad = ${msgPreview}...]</span>
          <span style="color:var(--muted)"> ∥ </span>
          <span style="color:var(--accent2)">"${d.msgStr.length > 20 ? d.msgStr.substring(0,20)+'...' : d.msgStr}"</span>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px">Total input: 64 + ${enc(d.msgStr).length} = ${64 + enc(d.msgStr).length} bytes</div>
      </div>
    </div>

    <div style="text-align:center;font-size:28px;margin-bottom:8px">⬇️</div>
    <div style="background:var(--bg);border-radius:8px;padding:12px;text-align:center;margin-bottom:8px;font-size:13px;color:var(--muted);border:1px solid var(--border)">
      <span style="font-size:20px">⚙️</span> SHA-256 compression function (64 rounds of bit manipulation)
    </div>
    <div style="text-align:center;font-size:28px;margin-bottom:12px">⬇️</div>

    <div style="font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:600">${t('s3_output')}</div>
    <div class="result-box" style="position:relative">
      ${innerHex}
      <button class="copy-btn" onclick="navigator.clipboard.writeText('${innerHex}')">Copy</button>
    </div>

    <div style="margin-top:12px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:600">Inner hash bit pattern (256 bits):</div>
      <div style="display:flex;flex-wrap:wrap;gap:2px;">${hexToBits(innerHex).map(b => `<div style="width:8px;height:8px;border-radius:1px;background:${b?'var(--accent)':'var(--border)'};"></div>`).join('')}</div>
    </div>

    <button class="btn btn-primary" style="margin-top:16px" onclick="nextVizStep()">${t('viz_next')}</button>
  </div>`;
}

// ── STEP 4: XOR with opad ──
function renderStep4() {
  const d = vizData;
  const SHOW = 8;
  const kSlice = d.kPrime.slice(0, SHOW);
  const oSlice = d.opad.slice(0, SHOW);
  const xSlice = d.kOpad.slice(0, SHOW);

  const xorRows = Array.from({length: SHOW}, (_, i) => `
    <div class="anim-row" style="display:flex;align-items:center;gap:6px;margin-bottom:6px;background:var(--bg);border-radius:6px;padding:8px 10px;border:1px solid var(--border)">
      <span style="width:28px;text-align:center;font-size:11px;color:var(--muted)">[${i}]</span>
      <code style="color:var(--accent2);font-size:13px">${toHex(kSlice[i])}</code>
      <span style="color:var(--muted);font-size:13px">(${byteToBin(kSlice[i])})</span>
      <span style="color:var(--warn);font-weight:700;font-size:16px">⊕</span>
      <code style="color:var(--error);font-size:13px">${toHex(oSlice[i])}</code>
      <span style="color:var(--muted);font-size:13px">(${byteToBin(oSlice[i])})</span>
      <span style="color:var(--muted)">=</span>
      <code style="color:var(--warn);font-size:13px;font-weight:700">${toHex(xSlice[i])}</code>
      <span style="color:var(--muted);font-size:13px">(${byteToBin(xSlice[i])})</span>
    </div>`).join('');

  return `
  <div class="card" style="animation:fadeIn .3s ease">
    <h3 style="margin-bottom:6px">${t('s4_title')}</h3>
    <div class="step-explain">${t('s4_explain')}</div>

    <div style="background:var(--bg);border-radius:8px;padding:12px;border:1px solid var(--border);margin-bottom:16px;font-size:13px">
      <span style="color:var(--accent2);font-weight:700">opad constant:</span>
      <code style="margin-left:8px;color:var(--error)">0x5C = 01011100</code>
      (decimal: 92)
      <div style="margin-top:8px;font-size:12px;color:var(--muted)">
        ipad = <code style="color:var(--success)">0x36 = 00110110</code> vs opad = <code style="color:var(--error)">0x5C = 01011100</code>
        — every bit differs! This is intentional.
      </div>
    </div>

    <div style="font-size:12px;color:var(--muted);margin-bottom:10px;font-weight:600">First 8 bytes — byte-by-byte XOR:</div>
    ${xorRows}

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin:16px 0">
      <div>
        <div style="font-size:11px;color:var(--accent2);font-weight:700;margin-bottom:6px">${t('s4_kp')}</div>
        <div class="hex-grid">${hexGridHTML(d.kPrime, 'key-orig', 8)}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--error);font-weight:700;margin-bottom:6px">${t('s4_opad')}</div>
        <div class="hex-grid">${hexGridHTML(d.opad, 'opad-byte', 8)}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--warn);font-weight:700;margin-bottom:6px">${t('s4_res')}</div>
        <div class="hex-grid">${hexGridHTML(d.kOpad, 'xor-result', 8)}</div>
      </div>
    </div>

    <button class="btn btn-primary" onclick="nextVizStep()">${t('viz_next')}</button>
  </div>`;
}

// ── STEP 5: Final HMAC ──
function renderStep5() {
  const d = vizData;
  const finalHmac = hex(d.outerHash);
  const innerHmac = hex(d.innerHash);

  return `
  <div class="card" style="animation:fadeIn .3s ease">
    <h3 style="margin-bottom:6px">${t('s5_title')}</h3>
    <div class="step-explain">${t('s5_explain')}</div>

    <div style="background:var(--bg);border-radius:10px;padding:14px;margin-bottom:12px;border:1px solid var(--border)">
      <div style="font-size:12px;color:var(--muted);margin-bottom:8px;font-weight:600">${t('s5_formula').replace('inner_hash','inner hash')}</div>
      <div style="font-family:monospace;font-size:12px">
        <span style="color:var(--warn)">[K'⊕opad]</span>
        <span style="color:var(--muted)"> ∥ </span>
        <span style="color:var(--accent)">[inner hash = ${innerHmac.substring(0,16)}...]</span>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:6px">Total: 64 + 32 = 96 bytes input to final SHA-256</div>
    </div>

    <div style="text-align:center;font-size:24px;margin:8px 0">⬇️ SHA-256 ⬇️</div>

    <div style="font-size:12px;color:var(--success);margin-bottom:8px;font-weight:600">${t('s5_output')}</div>
    <div class="result-box" style="border-color:var(--success);color:var(--success);font-size:14px;position:relative">
      ${finalHmac}
      <button class="copy-btn" onclick="navigator.clipboard.writeText('${finalHmac}').then(()=>showNotif(t('copy_ok'),'📋'))">Copy</button>
    </div>

    <div style="margin-top:14px">
      <div style="font-size:12px;color:var(--muted);margin-bottom:6px;font-weight:600">Final HMAC bit pattern (256 bits = 32 bytes):</div>
      <div style="display:flex;flex-wrap:wrap;gap:2px;">${hexToBits(finalHmac).map(b => `<div style="width:9px;height:9px;border-radius:2px;background:${b?'var(--success)':'var(--border)'};"></div>`).join('')}</div>
    </div>

    <div style="margin-top:16px;background:rgba(16,185,129,.08);border:1px solid var(--success);border-radius:10px;padding:16px">
      <div style="font-weight:700;color:var(--success);margin-bottom:8px;font-size:16px">${t('s5_done')}</div>
      <div style="font-size:13px;color:var(--muted);line-height:1.6">${t('s5_done_desc')}</div>
      <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('ver-expected').value='${finalHmac}';document.getElementById('ver-msg').value='${d.msgStr.replace(/'/g,"\\'")}';document.getElementById('ver-key').value='${d.keyStr.replace(/'/g,"\\'")}';navigate('verify')">📤 Send to Verification</button>
        <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${finalHmac}').then(()=>showNotif(t('copy_ok'),'📋'))">📋 Copy HMAC</button>
      </div>
    </div>

    <button class="btn btn-primary" style="margin-top:16px" onclick="nextVizStep()">${t('viz_restart')}</button>
  </div>`;
}

// ── Helpers to generate hex byte grids ──
function hexGridHTML(bytes, cls, max = 16, origLen = null) {
  let html = '';
  const arr = Array.from(bytes).slice(0, max);
  arr.forEach((b, i) => {
    let byteCls = cls;
    if (origLen !== null) {
      byteCls = i < origLen ? 'key-orig' : 'key-pad';
    }
    html += `<div class="hex-byte ${byteCls||''}" title="Byte[${i}] = 0x${toHex(b)} = ${b}">
      <span class="hex-val">${toHex(b)}</span>
    </div>`;
  });
  if (bytes.length > max) {
    html += `<div class="hex-byte" style="color:var(--muted);border:none">+${bytes.length-max}</div>`;
  }
  return html;
}

function hexGridAllHTML(bytes, origLen) {
  return Array.from(bytes).map((b, i) => {
    const cls = i < origLen ? 'key-orig' : 'key-pad';
    return `<div class="hex-byte ${cls}" title="[${i}] 0x${toHex(b)}">
      <span class="hex-val">${toHex(b)}</span>
    </div>`;
  }).join('');
}

window.startVisualization = startVisualization;
window.nextVizStep = nextVizStep;
window.vizData = null;
