/* ═══════════════════════════════════════
   main.js — State, Auth, Navigation,
             Generator, Compare, Verify,
             History, Settings
   ═══════════════════════════════════════ */

// ── AUTH STATE ───────────────────────────────────────────────────────────────
let currentUser = null;   // null = guest | { username, email, token }

function getStore()   { return currentUser ? localStorage : sessionStorage; }
function getKey(base) { return currentUser ? `hmac_${currentUser.username}_${base}` : `hmac_guest_${base}`; }

// ── APP STATE ────────────────────────────────────────────────────────────────
let state = { history:[], stats:{total:0,verified:0,practice:0,theory:0}, dark: localStorage.getItem('hmac_theme') !== 'light' };

function loadStateFromStore() {
  const s = getStore();
  return {
    history: JSON.parse(s.getItem(getKey('history')) || '[]'),
    stats:   JSON.parse(s.getItem(getKey('stats'))   || '{"total":0,"verified":0,"practice":0,"theory":0}'),
    dark:    localStorage.getItem('hmac_theme') !== 'light'
  };
}

function saveState() {
  const s = getStore();
  s.setItem(getKey('history'), JSON.stringify(state.history));
  s.setItem(getKey('stats'),   JSON.stringify(state.stats));
}

function reloadState() {
  const fresh = loadStateFromStore();
  state.history = fresh.history;
  state.stats   = fresh.stats;
  updateDashboard();
  renderHistory();
}

// ── AUTH MODAL ───────────────────────────────────────────────────────────────
function showAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'flex';
    showAuthStep('mode-select');
    ['auth-error','reg-error'].forEach(id => {
      const e = document.getElementById(id);
      if (e) { e.style.display = 'none'; e.textContent = ''; }
    });
    ['auth-username','auth-password','reg-username','reg-email','reg-password'].forEach(id => {
      const i = document.getElementById(id); if (i) i.value = '';
    });
  }
}

function closeAuthModal() {
  const m = document.getElementById('auth-modal');
  if (m) m.style.display = 'none';
}

function showAuthStep(step) {
  ['mode-select','login-form','register-form'].forEach(id => {
    const el = document.getElementById('auth-' + id);
    if (el) el.style.display = id === step ? 'block' : 'none';
  });
}

function continueAsGuest() {
  currentUser = null;
  closeAuthModal();
  reloadState();
  updateUserUI();
  showNotif(t('auth_guest_msg'), '👤');
}

async function handleLogin() {
  const username = document.getElementById('auth-username').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl    = document.getElementById('auth-error');
  errEl.style.display = 'none';

  if (!username || !password) { errEl.textContent = t('auth_fill'); errEl.style.display='block'; return; }

  const btn = document.getElementById('login-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳...'; }

  try {
    const res  = await fetch('/api/auth/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      currentUser = { username: data.user.username, email: data.user.email, token: data.token };
      localStorage.setItem('hmac_user', JSON.stringify(currentUser));
      closeAuthModal();
      reloadState();
      updateUserUI();
      showNotif(`${t('auth_welcome')} ${currentUser.username}! 👋`, '✅');
    } else {
      errEl.textContent = data.error || t('auth_wrong');
      errEl.style.display = 'block';
    }
  } catch {
    errEl.textContent = t('auth_offline');
    errEl.style.display = 'block';
  }
  if (btn) { btn.disabled = false; btn.textContent = t('auth_login_btn'); }
}

async function handleRegister() {
  const username = document.getElementById('reg-username').value.trim();
  const email    = document.getElementById('reg-email').value.trim();
  const password = document.getElementById('reg-password').value;
  const errEl    = document.getElementById('reg-error');
  errEl.style.display = 'none';

  if (!username || !email || !password) { errEl.textContent = t('auth_fill'); errEl.style.display='block'; return; }
  if (password.length < 6) { errEl.textContent = t('auth_pw_short'); errEl.style.display='block'; return; }

  const btn = document.getElementById('register-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = '⏳...'; }

  try {
    const res  = await fetch('/api/auth/register', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (res.ok) {
      currentUser = { username: data.user.username, email: data.user.email, token: data.token };
      localStorage.setItem('hmac_user', JSON.stringify(currentUser));
      closeAuthModal();
      reloadState();
      updateUserUI();
      showNotif(`${t('auth_welcome')} ${currentUser.username}! 🎉`, '✅');
    } else {
      errEl.textContent = data.error || t('auth_reg_fail');
      errEl.style.display = 'block';
    }
  } catch {
    errEl.textContent = t('auth_offline');
    errEl.style.display = 'block';
  }
  if (btn) { btn.disabled = false; btn.textContent = t('auth_reg_btn'); }
}

function logoutUser() {
  if (!confirm(t('auth_logout_q'))) return;
  currentUser = null;
  localStorage.removeItem('hmac_user');
  state.history = [];
  state.stats   = { total:0, verified:0, practice:0, theory:0 };
  updateDashboard();
  updateUserUI();
  navigate('dashboard');
  showAuthModal();
}

function updateUserUI() {
  const btn = document.getElementById('user-btn');
  if (btn) btn.textContent = currentUser ? `👤 ${currentUser.username}` : `👤 ${t('user_guest')}`;
  updateSettingsAccount();
  applyTranslations();
}

// Admin email list — add badge but no special permissions in backend
const ADMIN_EMAILS = ['nurdanbekqanat@gmail.com'];
function isAdmin() { return currentUser && ADMIN_EMAILS.includes(currentUser.email); }

function updateSettingsAccount() {
  const card = document.getElementById('account-settings-card');
  if (!card) return;
  if (currentUser) {
    const adminBadge = isAdmin()
      ? '<span style="font-size:11px;color:#fff;background:#F59E0B;padding:3px 10px;border-radius:20px;margin-left:8px;font-weight:700">⭐ Admin</span>'
      : '';
    const roleBadge = isAdmin()
      ? '<span style="font-size:11px;color:#F59E0B;padding:4px 10px;background:rgba(245,158,11,.12);border-radius:20px;display:inline-block;margin-top:6px;border:1px solid rgba(245,158,11,.3)">⭐ Platform Administrator</span>'
      : '<span style="font-size:11px;color:var(--accent);padding:4px 10px;background:rgba(59,130,246,.1);border-radius:20px;display:inline-block;margin-top:6px">' + t('set_acc_user') + '</span>';
    card.innerHTML = `
      <h3 style="margin-bottom:16px;font-size:16px">👤 ${t('set_account')}</h3>
      <div style="padding:14px 0;border-bottom:1px solid var(--border)">
        <div style="font-weight:700;font-size:16px;display:flex;align-items:center;flex-wrap:wrap;gap:6px">
          ${currentUser.username}${adminBadge}
        </div>
        <div style="font-size:13px;color:var(--muted);margin-top:4px">${currentUser.email}</div>
        ${roleBadge}
      </div>
      <div style="padding:14px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--muted)">
        ${t('set_acc_stats')}: 🔐 <b>${state.stats.total}</b> &nbsp;✅ <b>${state.stats.verified}</b> &nbsp;🧪 <b>${state.stats.practice}</b>
      </div>
      <div style="padding:14px 0">
        <button class="btn btn-danger" onclick="logoutUser()">${t('auth_logout_btn')}</button>
      </div>`;
  } else {
    card.innerHTML = `
      <h3 style="margin-bottom:16px;font-size:16px">👤 ${t('set_account')}</h3>
      <div style="color:var(--muted);font-size:14px;line-height:1.7;padding:12px 0;border-bottom:1px solid var(--border)">${t('set_acc_guest_msg')}</div>
      <div style="padding:14px 0">
        <button class="btn btn-primary" onclick="showAuthModal()">${t('auth_signin_btn')}</button>
      </div>`;
  }
}

// ── HINTS ─────────────────────────────────────────────────────────────────────
function toggleHint(id) {
  const hint = document.getElementById(id);
  const btn  = document.getElementById(id + '-btn');
  if (!hint) return;
  const showing = hint.style.display !== 'none';
  hint.style.display = showing ? 'none' : 'block';
  if (btn) btn.textContent = showing ? `💡 ${t('hint_show')}` : `🙈 ${t('hint_hide')}`;
}

// ── NAVIGATION ───────────────────────────────────────────────────────────────
const PAGE_TITLE_KEYS = {
  dashboard:'title_dashboard', theory:'title_theory',   generator:'title_generator',
  stepviz:'title_stepviz',     compare:'title_compare', verify:'title_verify',
  practice:'title_practice',   history:'title_history', settings:'title_settings'
};

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  if (pageEl) pageEl.classList.add('active');

  const navEl = document.querySelector(`[data-nav="${page}"]`);
  if (navEl) navEl.classList.add('active');

  document.getElementById('page-title').textContent = t(PAGE_TITLE_KEYS[page]);
  updateDashboard();

  if (page === 'history')  renderHistory();
  if (page === 'compare')  runCompare();
  if (page === 'theory')   loadTheoryQuiz();
  if (page === 'practice') initPractice();
  if (page === 'settings') updateSettingsAccount();
}

// ── DASHBOARD ────────────────────────────────────────────────────────────────
function updateDashboard() {
  const tp = Math.min(100, state.stats.theory || 0);
  const gp = Math.min(100, (state.stats.total || 0) * 20);
  const pp = Math.min(100, (state.stats.practice || 0) * 2);
  setText('stat-total',    state.stats.total    || 0);
  setText('stat-verified', state.stats.verified || 0);
  setText('stat-practice', state.stats.practice || 0);
  setText('stat-theory',   tp + '%');
  setProgress('prog-theory','prog-theory-lbl', tp);
  setProgress('prog-gen',   'prog-gen-lbl',    gp);
  setProgress('prog-prac',  'prog-prac-lbl',   pp);
}

function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setProgress(barId, lblId, pct) {
  const bar = document.getElementById(barId), lbl = document.getElementById(lblId);
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = pct + '%';
}

// ── GENERATOR ────────────────────────────────────────────────────────────────
async function generateHMAC() {
  const msg = document.getElementById('gen-msg').value.trim();
  const key = document.getElementById('gen-key').value.trim();
  if (!msg || !key) { showNotif(t('enter_both'), '⚠️'); return; }

  const btn = document.querySelector('#page-generator .btn-primary');
  if (btn) { btn.textContent = '⏳ ' + t('computing'); btn.disabled = true; }

  const hmacResult = await hmacSha256(key, msg);
  const shaResult  = hex(await sha256(enc(msg)));

  if (btn) { btn.textContent = t('gen_btn'); btn.disabled = false; }

  setResultText('gen-sha-result',  shaResult);
  setResultText('gen-hmac-result', hmacResult);
  document.getElementById('gen-result').style.display = 'block';

  addHistory({ msg, key: key.substring(0, 20), hmac: hmacResult, type: 'generate' });
  state.stats.total++;
  state.stats.theory = Math.min(100, (state.stats.theory || 0) + 5);
  saveState();
  updateDashboard();
  showNotif(t('gen_ok'), '✅');
}

function genRandomKey() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  let k = '';
  for (let i = 0; i < 20; i++) k += chars[Math.floor(Math.random() * chars.length)];
  document.getElementById('gen-key').value = k;
}

function sendToVerify() {
  const hmac = getResultText('gen-hmac-result');
  document.getElementById('ver-msg').value      = document.getElementById('gen-msg').value;
  document.getElementById('ver-key').value      = document.getElementById('gen-key').value;
  document.getElementById('ver-expected').value = hmac;
  navigate('verify');
}

// ── VERIFICATION ─────────────────────────────────────────────────────────────
async function verifyHMAC() {
  const msg      = document.getElementById('ver-msg').value.trim();
  const key      = document.getElementById('ver-key').value.trim();
  const expected = document.getElementById('ver-expected').value.trim().toLowerCase();
  if (!msg || !key || !expected) { showNotif(t('fill_all'), '⚠️'); return; }

  const computed = await hmacSha256(key, msg);
  const match    = computed === expected;

  const res = document.getElementById('ver-result');
  res.style.display = 'block';
  setResultText('ver-expected-display', expected);
  setResultText('ver-computed-display', computed);
  document.getElementById('ver-computed-display').style.color = match ? 'var(--success)' : 'var(--error)';

  const verdict = document.getElementById('ver-verdict');
  if (match) {
    verdict.textContent  = t('ver_valid');
    verdict.style.cssText = 'background:rgba(16,185,129,.1);color:var(--success);border:1px solid var(--success);padding:20px;border-radius:12px;text-align:center;font-size:18px;font-weight:800;margin-top:8px';
    res.classList.add('success-anim'); setTimeout(() => res.classList.remove('success-anim'), 1200);
  } else {
    verdict.textContent  = t('ver_invalid');
    verdict.style.cssText = 'background:rgba(247,7,7,.08);color:var(--error);border:1px solid var(--error);padding:20px;border-radius:12px;text-align:center;font-size:18px;font-weight:800;margin-top:8px';
    res.classList.add('fail-anim'); setTimeout(() => res.classList.remove('fail-anim'), 600);
  }

  addHistory({ msg: msg.substring(0, 60), key: key.substring(0, 20), hmac: computed, type: 'verify', match });
  state.stats.verified++;
  saveState();
  updateDashboard();
}

function loadTestVector() {
  document.getElementById('ver-msg').value      = 'The quick brown fox jumps over the lazy dog';
  document.getElementById('ver-key').value      = 'key';
  document.getElementById('ver-expected').value = 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8';
}

// ── COMPARE ───────────────────────────────────────────────────────────────────
async function runCompare() {
  const a = (document.getElementById('cmp-a')   || {}).value;
  const b = (document.getElementById('cmp-b')   || {}).value;
  const k = (document.getElementById('cmp-key') || {}).value;
  if (!a || !b || !k) return;

  const [ha, hb] = await Promise.all([hmacSha256(k, a), hmacSha256(k, b)]);
  document.getElementById('cmp-result').style.display = 'grid';
  document.getElementById('cmp-stats').style.display  = 'block';
  document.getElementById('cmp-msg-a').textContent = '"' + a + '"';
  document.getElementById('cmp-msg-b').textContent = '"' + b + '"';
  setResultText('cmp-hash-a', ha);
  setResultText('cmp-hash-b', hb);

  const bitsA = hexToBits(ha), bitsB = hexToBits(hb);
  let diff = 0;
  bitsA.forEach((bit, i) => { if (bit !== bitsB[i]) diff++; });

  renderBitPattern('cmp-bits-a', bitsA, bitsA, bitsB, false);
  renderBitPattern('cmp-bits-b', bitsB, bitsA, bitsB, true);

  document.getElementById('cmp-diff-bits').textContent = diff;
  document.getElementById('cmp-diff-pct').textContent  = (diff / 256 * 100).toFixed(1) + '%';
  document.getElementById('cmp-same-bits').textContent = 256 - diff;
  document.getElementById('cmp-bar').style.width       = (diff / 256 * 100) + '%';
}

function renderBitPattern(cId, bits, bA, bB, showDiff) {
  const el = document.getElementById(cId); if (!el) return;
  el.innerHTML = bits.map((b, i) =>
    `<div class="hash-bit ${showDiff ? (bA[i]!==bB[i]?'diff':'same') : 'same'}"></div>`).join('');
}

// ── HISTORY ───────────────────────────────────────────────────────────────────
function addHistory(record) {
  record.time = new Date().toLocaleString();
  state.history.unshift(record);
  if (state.history.length > 100) state.history.pop();
  saveState();
}

function renderHistory() {
  const search = (document.getElementById('hist-search') || {value:''}).value.toLowerCase();
  const list   = state.history.filter(h =>
    h.msg.toLowerCase().includes(search) || h.hmac.toLowerCase().includes(search));

  const badge = document.getElementById('hist-count-badge');
  if (badge) badge.textContent = list.length + ' ' + t('hist_badge');

  const container = document.getElementById('history-list'); if (!container) return;
  if (!list.length) {
    container.innerHTML = `<div style="text-align:center;color:var(--muted);padding:40px;font-size:14px">${search ? t('hist_none') : t('hist_empty')}</div>`;
    return;
  }

  container.innerHTML = list.map((h, i) => {
    let badgeTxt, badgeCls;
    if (h.type === 'verify') { badgeTxt = h.match ? t('hist_ver_ok') : t('hist_ver_fail'); badgeCls = h.match ? 'badge-success' : 'badge-error'; }
    else { badgeTxt = t('hist_gen'); badgeCls = 'badge-info'; }
    return `
    <div class="history-item">
      <div class="history-info">
        <div class="msg">${h.msg.length > 60 ? h.msg.substring(0,60)+'…' : h.msg}</div>
        <div class="hash">${h.hmac}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px">${h.time}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
        <span class="badge ${badgeCls}">${badgeTxt}</span>
        <button onclick="deleteHistoryItem(${i})" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:18px;transition:color .2s" onmouseover="this.style.color='var(--error)'" onmouseout="this.style.color='var(--muted)'">🗑</button>
      </div>
    </div>`;
  }).join('');
}

function deleteHistoryItem(idx) { state.history.splice(idx,1); saveState(); renderHistory(); }
function clearHistory() {
  if (confirm(t('clear_q'))) { state.history=[]; saveState(); renderHistory(); showNotif(t('hist_clear'),'🗑'); }
}

// ── THEME ─────────────────────────────────────────────────────────────────────
function toggleTheme() {
  state.dark = !state.dark;
  document.body.classList.toggle('light', !state.dark);
  localStorage.setItem('hmac_theme', state.dark ? 'dark' : 'light');
  const btn = document.getElementById('theme-settings-btn');
  if (btn) btn.textContent = t(state.dark ? 'set_light_btn' : 'set_dark_btn');
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function setResultText(id, text) {
  const el = document.getElementById(id); if (!el) return;
  let tn = null;
  for (const node of el.childNodes) { if (node.nodeType === Node.TEXT_NODE) { tn = node; break; } }
  if (tn) tn.textContent = text;
  else el.insertBefore(document.createTextNode(text), el.firstChild);
}
function getResultText(id) {
  const el = document.getElementById(id); if (!el) return '';
  for (const node of el.childNodes) { if (node.nodeType === Node.TEXT_NODE) return node.textContent.trim(); }
  return el.textContent.trim();
}
function copyResult(id) { navigator.clipboard.writeText(getResultText(id)).then(() => showNotif(t('copy_ok'),'📋')); }
function showNotif(msg, icon='ℹ️') {
  const el = document.createElement('div'); el.className='notif';
  el.innerHTML = `${icon} ${msg}`; document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}


// ── SIDEBAR TOGGLE ────────────────────────────────────────────────────────────
function toggleSidebar() {
  const collapsed = document.body.classList.toggle('sb-collapsed');
  localStorage.setItem('hmac_sidebar', collapsed ? '1' : '0');
  const btn = document.getElementById('sb-toggle-btn');
  if (btn) btn.textContent = collapsed ? '▶' : '◀';
}

function restoreSidebar() {
  if (localStorage.getItem('hmac_sidebar') === '1') {
    document.body.classList.add('sb-collapsed');
    const btn = document.getElementById('sb-toggle-btn');
    if (btn) btn.textContent = '▶';
  }
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('hmac_user');
  if (stored) { try { currentUser = JSON.parse(stored); } catch { currentUser = null; } }

  const fresh = loadStateFromStore();
  state.history = fresh.history;
  state.stats   = fresh.stats;
  state.dark    = fresh.dark;

  if (!state.dark) document.body.classList.add('light');
  applyTranslations();

  document.querySelectorAll('.result-box').forEach(rb => {
    if (rb.firstChild && rb.firstChild.nodeType === 1)
      rb.insertBefore(document.createTextNode(''), rb.firstChild);
  });

  restoreSidebar();
  updateDashboard();
  loadTheoryQuiz();
  runCompare();
  updateUserUI();

  const btn = document.getElementById('theme-settings-btn');
  if (btn) btn.textContent = t(state.dark ? 'set_light_btn' : 'set_dark_btn');

  if (!currentUser) showAuthModal();
});

// expose globals
Object.assign(window, {
  toggleSidebar, restoreSidebar,
  state, saveState, reloadState, navigate, updateDashboard,
  generateHMAC, genRandomKey, sendToVerify, verifyHMAC, loadTestVector,
  runCompare, renderHistory, deleteHistoryItem, clearHistory,
  toggleTheme, copyResult, showNotif, setResultText, getResultText,
  showAuthModal, closeAuthModal, showAuthStep,
  continueAsGuest, handleLogin, handleRegister, logoutUser,
  updateUserUI, updateSettingsAccount, toggleHint
});
