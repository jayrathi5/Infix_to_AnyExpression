// app.js — UI wiring

const input      = document.getElementById('infixInput');
const convertBtn = document.getElementById('convertBtn');
const clearBtn   = document.getElementById('clearBtn');
const postfixRes = document.getElementById('postfixResult');
const prefixRes  = document.getElementById('prefixResult');
const errorMsg   = document.getElementById('errorMsg');
const results    = document.getElementById('results');
const stepsSection = document.getElementById('stepsSection');
const toast      = document.getElementById('toast');

// ── Convert ──────────────────────────────────────────────────────────────────
convertBtn.addEventListener('click', convert);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') convert(); });

function convert() {
  const expr = input.value.trim();
  clearError();

  const err = validate(expr);
  if (err) { showError(err); return; }

  const postfix = infixToPostfix(expr);
  const prefix  = infixToPrefix(expr);

  // Animate result boxes
  results.classList.add('visible');
  animateResult(postfixRes, postfix.result);
  animateResult(prefixRes,  prefix.result);

  // Populate step tables
  populateSteps('postfixStepsBody', postfix.steps);
  populateSteps('prefixStepsBody',  prefix.steps);
  stepsSection.style.display = 'block';
  stepsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function animateResult(el, text) {
  el.textContent = '';
  el.classList.remove('pop');
  void el.offsetWidth; // reflow
  el.textContent = text;
  el.classList.add('pop');
}

function populateSteps(tbodyId, steps) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = '';
  steps.forEach((s, i) => {
    const tr = document.createElement('tr');
    tr.style.animationDelay = `${i * 30}ms`;
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td class="mono">${esc(s.symbol)}</td>
      <td class="mono">${esc(s.stack)}</td>
      <td class="mono">${esc(s.output)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function esc(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

// ── Clear ────────────────────────────────────────────────────────────────────
clearBtn.addEventListener('click', () => {
  input.value = '';
  postfixRes.textContent = '—';
  prefixRes.textContent  = '—';
  results.classList.remove('visible');
  stepsSection.style.display = 'none';
  clearError();
  input.focus();
});

// ── Copy ─────────────────────────────────────────────────────────────────────
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    const text = target.textContent;
    if (text === '—') return;
    navigator.clipboard.writeText(text).then(() => showToast());
  });
});

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.remove('hidden');
  });
});

// ── Error helpers ────────────────────────────────────────────────────────────
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add('visible');
  input.classList.add('input-error');
}

function clearError() {
  errorMsg.textContent = '';
  errorMsg.classList.remove('visible');
  input.classList.remove('input-error');
}
