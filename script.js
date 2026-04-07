/* ================================================================
   EESHLETICS v2 — MASTER SCRIPT (js/script.js)
   Include on EVERY page. All shared logic lives here.
   ================================================================ */

/* ─── THEME ──────────────────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('eeTheme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '☀️' : '🌙';
})();

document.getElementById('themeToggle')?.addEventListener('click', () => {
  const cur  = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('eeTheme', next);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = next === 'dark' ? '☀️' : '🌙';
});

/* ─── STICKY HEADER ──────────────────────────────────────────────── */
const _header = document.querySelector('.header');
if (_header) {
  window.addEventListener('scroll', () => {
    _header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
}

/* ─── HAMBURGER ──────────────────────────────────────────────────── */
const _ham = document.querySelector('.hamburger');
const _nav = document.querySelector('.nav-links');
if (_ham && _nav) {
  _ham.addEventListener('click', () => {
    const open = _nav.classList.toggle('open');
    _ham.classList.toggle('open', open);
    _ham.setAttribute('aria-expanded', open);
  });
  _nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      _nav.classList.remove('open');
      _ham.classList.remove('open');
      _ham.setAttribute('aria-expanded', false);
    });
  });
  document.addEventListener('click', e => {
    if (!_header?.contains(e.target)) {
      _nav.classList.remove('open');
      _ham.classList.remove('open');
    }
  });
}

/* ─── AUTO ACTIVE NAV ────────────────────────────────────────────── */
const _page = document.body.dataset.page;
document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
  if (a.dataset.nav === _page) a.classList.add('active');
});

/* ─── SCROLL REVEAL (IntersectionObserver) ───────────────────────── */
const _revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      _revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => _revealObs.observe(el));

/* ─── SMOOTH ANCHORS ─────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ─── TOAST ──────────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  let el = document.getElementById('_eeToast');
  if (!el) {
    el = document.createElement('div');
    el.id = '_eeToast';
    Object.assign(el.style, {
      position:'fixed', bottom:'28px', left:'50%',
      transform:'translateX(-50%) translateY(100px)',
      background:'var(--surface2)', border:'1px solid var(--border2)',
      borderRadius:'10px', padding:'14px 28px',
      fontSize:'14px', fontWeight:'600', zIndex:'9999',
      transition:'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s',
      opacity:'0', maxWidth:'90vw', textAlign:'center',
      boxShadow:'0 10px 40px rgba(0,0,0,0.5)', fontFamily:'var(--font-body)',
    });
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.borderColor = type === 'success' ? 'var(--cyan)'    : 'var(--danger)';
  el.style.color       = type === 'success' ? 'var(--cyan)'    : 'var(--danger)';
  el.style.opacity     = '1';
  el.style.transform   = 'translateX(-50%) translateY(0)';
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3800);
}
window.showToast = showToast;

/* ─── NUMBER COUNTER ANIMATION ───────────────────────────────────── */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const pct = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - pct, 3);
    el.textContent = Math.round(ease * target).toLocaleString();
    if (pct < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(update);
}
// Trigger counters when visible
document.querySelectorAll('[data-count]').forEach(el => {
  const obs = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      animateCounter(el, +el.dataset.count);
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(el);
});

/* ─── TYPED TEXT EFFECT ──────────────────────────────────────────── */
function typeText(el, words, speed = 80, pause = 2000) {
  if (!el || !words.length) return;
  let wi = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? speed / 2 : speed;
    if (!deleting && ci > word.length)  { delay = pause; deleting = true; }
    if (deleting  && ci < 0)            { deleting = false; wi = (wi + 1) % words.length; ci = 0; }
    setTimeout(tick, delay);
  };
  tick();
}

/* ─── REGISTRATION FORM ──────────────────────────────────────────── */
document.getElementById('gymForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const f = id => document.getElementById(id)?.value.trim();
  const data = { name: f('name'), age: +f('age'), gender: f('gender'), location: f('location'), email: f('email'), phone: f('phone') };
  if (data.age < 10 || data.age > 80) return showToast('Age must be 10–80', 'error');
  if (!data.gender) return showToast('Please select a gender', 'error');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return showToast('Invalid email address', 'error');
  localStorage.setItem('eeUser', JSON.stringify(data));
  showToast('Welcome to Eeshletics! 💪 Registration saved.');
  e.target.reset();
});

/* ─── BMI QUICK CALC ─────────────────────────────────────────────── */
function calculateBMI() {
  const w = parseFloat(document.getElementById('weight')?.value);
  const h = parseFloat(document.getElementById('height')?.value) / 100;
  const el = document.getElementById('bmiResult');
  if (!el) return;
  if (!w || !h || h <= 0 || w <= 0) { el.innerHTML = '<span style="color:var(--danger)">Please enter valid values.</span>'; return; }
  const bmi = (w / (h * h)).toFixed(1);
  const cats  = [[18.5,'Underweight','#67e8f9'],[25,'Normal','var(--success)'],[30,'Overweight','var(--warning)'],[999,'Obese','var(--danger)']];
  const [, cat, col] = cats.find(([lim]) => +bmi < lim);
  el.innerHTML = `BMI: <strong style="color:${col}">${bmi}</strong> — <em style="color:${col}">${cat}</em>`;
}
window.calculateBMI = calculateBMI;

/* ─── FITNESS CALCULATOR ─────────────────────────────────────────── */
function calculateFitness() {
  const v = id => document.getElementById(id)?.value;
  const age = +v('fcAge'), weight = +v('fcWeight'), height = +v('fcHeight');
  const gender = v('fcGender'), activity = +v('fcActivity');
  if (!age || !weight || !height || !gender || !activity)
    return showToast('Please fill in all fields', 'error');

  const bmi = +(weight / ((height / 100) ** 2)).toFixed(1);
  const bmiMeta = [[18.5,'Underweight','#67e8f9'],[25,'Normal','var(--success)'],[30,'Overweight','var(--warning)'],[999,'Obese','var(--danger)']];
  const [, bmiLabel, bmiCol] = bmiMeta.find(([l]) => bmi < l);

  const bmr = gender === 'male'
    ? 10*weight + 6.25*height - 5*age + 5
    : 10*weight + 6.25*height - 5*age - 161;
  const tdee = Math.round(bmr * activity);
  const bodyType = bmi < 18.5 ? 'Ectomorph' : bmi < 25 ? 'Mesomorph' : 'Endomorph';
  const bodyDesc = {
    Ectomorph: 'Lean build, fast metabolism. Prioritise caloric surplus & compound lifts.',
    Mesomorph: 'Athletic build, responds quickly to training. Balance strength and cardio.',
    Endomorph: 'Higher fat-storage tendency. Focus on cardio + disciplined calorie deficit.',
  };

  const setText = (id, html) => { const el = document.getElementById(id); if(el) el.innerHTML = html; };
  setText('fcBMI',      `<span style="color:${bmiCol}">${bmi}</span><small> — ${bmiLabel}</small>`);
  setText('fcBMR',      `${Math.round(bmr)}<small> kcal/day at rest</small>`);
  setText('fcCalories', `<span style="color:var(--cyan)">${tdee}</span><small> kcal/day (with activity)</small>`);
  setText('fcBodyType', `${bodyType}<small> — ${bodyDesc[bodyType]}</small>`);

  // Activate result panels
  document.querySelectorAll('.result-panel').forEach(p => p.classList.add('has-result'));

  // Update BMI gauge
  const needle = document.getElementById('bmiNeedle');
  if (needle) {
    const pct = Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100));
    needle.style.left = pct + '%';
    needle.style.background = bmiCol;
  }

  // Save to history
  const hist = JSON.parse(localStorage.getItem('eeCalcHist') || '[]');
  hist.unshift({ date: new Date().toLocaleDateString('en-GB'), bmi, bmiLabel, bmr: Math.round(bmr), tdee, bodyType });
  localStorage.setItem('eeCalcHist', JSON.stringify(hist.slice(0, 20)));
  renderCalcHistory?.();
}
window.calculateFitness = calculateFitness;

function renderCalcHistory() {
  const el = document.getElementById('calcHistory');
  if (!el) return;
  const hist = JSON.parse(localStorage.getItem('eeCalcHist') || '[]');
  if (!hist.length) { el.innerHTML = '<p class="text-muted2" style="text-align:center;padding:24px">No history yet — calculate above to track changes.</p>'; return; }
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:10px">
      <h3 class="font-display" style="font-size:22px;letter-spacing:1px;font-weight:900">CALCULATION HISTORY</h3>
      <button class="btn btn-ghost btn-sm" onclick="localStorage.removeItem('eeCalcHist');renderCalcHistory()">Clear</button>
    </div>
    <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:13.5px">
      <thead><tr style="border-bottom:1px solid var(--border2)">
        ${['Date','BMI','Status','BMR','TDEE','Body Type'].map(h =>
          `<th style="padding:10px 14px;text-align:left;color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1.5px;white-space:nowrap">${h}</th>`
        ).join('')}
      </tr></thead>
      <tbody>
        ${hist.map(r => `<tr style="border-bottom:1px solid var(--border)">
          <td style="padding:12px 14px;color:var(--text3)">${r.date}</td>
          <td style="padding:12px 14px;font-weight:700;color:var(--cyan)">${r.bmi}</td>
          <td style="padding:12px 14px"><span class="badge badge-ghost">${r.bmiLabel}</span></td>
          <td style="padding:12px 14px">${r.bmr} kcal</td>
          <td style="padding:12px 14px;font-weight:700">${r.tdee} kcal</td>
          <td style="padding:12px 14px;color:var(--text2)">${r.bodyType}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}
window.renderCalcHistory = renderCalcHistory;

/* ─── PROGRESS LOGGER ────────────────────────────────────────────── */
function logProgress() {
  const val = id => document.getElementById(id)?.value;
  const entry = {
    id:        Date.now(),
    date:      new Date().toLocaleDateString('en-GB'),
    ts:        Date.now(),
    weight:    parseFloat(val('logWeight'))  || null,
    workout:   parseFloat(val('logWorkout')) || null,
    calories:  parseFloat(val('logCal'))     || null,
    water:     parseFloat(val('logWater'))   || null,
    note:      val('logNote')?.trim()        || '',
  };
  if (!entry.weight) return showToast('Weight is required to save an entry', 'error');
  const logs = JSON.parse(localStorage.getItem('eeLogs') || '[]');
  logs.unshift(entry);
  localStorage.setItem('eeLogs', JSON.stringify(logs));
  showToast('Entry saved — keep pushing! 🔥');
  document.getElementById('progressForm')?.reset();
  renderDashboard();
}
window.logProgress = logProgress;

function clearLogs() {
  if (!confirm('Clear ALL progress logs?')) return;
  localStorage.removeItem('eeLogs');
  renderDashboard();
  showToast('All logs cleared');
}
window.clearLogs = clearLogs;

function renderDashboard() {
  renderProgressTable();
  updateDashSummary();
  renderWeightBars();
  renderGoals();
}

function renderProgressTable() {
  const el = document.getElementById('progressHistory');
  if (!el) return;
  const logs = JSON.parse(localStorage.getItem('eeLogs') || '[]');
  if (!logs.length) {
    el.innerHTML = '<p style="text-align:center;padding:32px;color:var(--text3)">No entries yet. Log your first session above!</p>';
    return;
  }
  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:10px">
      <h3 class="font-display" style="font-size:22px;letter-spacing:1px;font-weight:900">WORKOUT LOG</h3>
      <button class="btn btn-ghost btn-sm" onclick="clearLogs()">Clear All</button>
    </div>
    <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;font-size:13.5px">
      <thead><tr style="border-bottom:1px solid var(--border2)">
        ${['Date','Weight (kg)','Duration (min)','Cal. Burned','Water (L)','Notes'].map(h =>
          `<th style="padding:10px 14px;text-align:left;color:var(--text3);font-size:10px;text-transform:uppercase;letter-spacing:1.5px;white-space:nowrap">${h}</th>`
        ).join('')}
      </tr></thead>
      <tbody>
        ${logs.map(e => `<tr style="border-bottom:1px solid var(--border)">
          <td style="padding:12px 14px;color:var(--text3)">${e.date}</td>
          <td style="padding:12px 14px;font-weight:700;color:var(--cyan)">${e.weight ?? '—'}</td>
          <td style="padding:12px 14px">${e.workout ?? '—'}</td>
          <td style="padding:12px 14px">${e.calories ?? '—'}</td>
          <td style="padding:12px 14px">${e.water ?? '—'}</td>
          <td style="padding:12px 14px;color:var(--text3);font-size:12.5px">${e.note || '—'}</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

function updateDashSummary() {
  const logs = JSON.parse(localStorage.getItem('eeLogs') || '[]');
  const set = (id, val) => { const el=document.getElementById(id); if(el) el.textContent = val; };
  set('sumEntries',  logs.length);
  set('sumWeight',   logs[0]?.weight ?? '—');
  set('sumWorkout',  logs.reduce((s,l) => s + (l.workout||0), 0) || '—');
  set('sumCalories', logs.reduce((s,l) => s + (l.calories||0), 0) || '—');
}

function renderWeightBars() {
  const el = document.getElementById('weightBars');
  if (!el) return;
  const logs = JSON.parse(localStorage.getItem('eeLogs') || '[]').filter(l => l.weight).slice(0, 12).reverse();
  if (!logs.length) { el.innerHTML = '<p style="color:var(--text3);font-size:13px">No weight data yet.</p>'; return; }
  const vals = logs.map(l => l.weight);
  const min = Math.min(...vals) - 1, max = Math.max(...vals) + 1;
  el.innerHTML = logs.map(l => {
    const h = Math.max(10, ((l.weight - min) / (max - min)) * 88 + 10);
    return `<div class="w-bar" style="height:${h}%;flex:1;min-width:12px;border-radius:4px 4px 0 0;background:var(--cyan-dim);border:1px solid var(--cyan-border);position:relative;transition:var(--transition);cursor:default" title="${l.weight}kg — ${l.date}" onmouseenter="this.style.background='var(--cyan-glow)'" onmouseleave="this.style.background='var(--cyan-dim)'"></div>`;
  }).join('');
}

function renderGoals() {
  const weekAgo = Date.now() - 7*24*60*60*1000;
  const week = JSON.parse(localStorage.getItem('eeLogs') || '[]').filter(l => l.ts >= weekAgo);
  const days = week.length;
  const mins = week.reduce((s,l) => s+(l.workout||0), 0);
  const cals = week.reduce((s,l) => s+(l.calories||0), 0);
  const fill = (id, cur, max) => {
    const el = document.getElementById(id);
    if (el) el.style.width = Math.min(100, (cur/max)*100) + '%';
  };
  const setText = (id, val) => { const el=document.getElementById(id); if(el) el.textContent = val; };
  fill('gDaysFill', days, 5);  setText('gDaysVal', `${days} / 5`);
  fill('gMinsFill', mins, 300); setText('gMinsVal', `${mins} / 300`);
  fill('gCalsFill', cals, 2000);setText('gCalsVal', `${cals.toLocaleString()} / 2,000`);
}

/* ─── CONTACT FORM (Web3Forms) ───────────────────────────────────── */
document.getElementById('contactForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const btn = e.target.querySelector('[type="submit"]');
  const orig = btn.textContent; btn.textContent = 'Sending…'; btn.disabled = true;
  try {
    const res  = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
    });
    const data = await res.json();
    if (data.success) { showToast('Message sent! We\'ll reply within 24 hrs ✓'); e.target.reset(); }
    else showToast('Something went wrong. Please try again.', 'error');
  } catch { showToast('Network error. Check your connection.', 'error'); }
  finally { btn.textContent = orig; btn.disabled = false; }
});

/* ─── PRICING TOGGLE ─────────────────────────────────────────────── */
let _isAnnual = false;
document.getElementById('billingToggle')?.addEventListener('click', () => {
  _isAnnual = !_isAnnual;
  const btn = document.getElementById('billingToggle');
  btn?.classList.toggle('active', _isAnnual);
  btn?.setAttribute('aria-pressed', _isAnnual);
  document.getElementById('billingLabel').textContent = _isAnnual ? 'Annual' : 'Monthly';
  document.querySelectorAll('[data-monthly]').forEach(el => {
    el.textContent = _isAnnual ? el.dataset.annual : el.dataset.monthly;
  });
});

/* ─── FAQ ACCORDION ──────────────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item    = q.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ─── INIT ───────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderCalcHistory();
  renderDashboard();
});
