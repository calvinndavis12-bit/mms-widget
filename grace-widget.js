<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modern Med Spa — Grace Widget</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── Demo page backdrop ── */
body {
  font-family: 'DM Sans', sans-serif;
  background: linear-gradient(135deg, #eef2f8 0%, #f7f9fc 60%, #eaf5f4 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.demo-note {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #1A2B4A;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  padding: 8px 18px;
  border-radius: 20px;
  opacity: 0.7;
  white-space: nowrap;
  pointer-events: none;
}

/* ── Floating launcher ── */
#grace-launcher {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9998;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #1A2B4A, #0F1E38);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 14px 22px 14px 18px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 6px 28px rgba(26,43,74,0.4);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}
#grace-launcher:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(26,43,74,0.5); }
#grace-launcher.hidden { opacity: 0; pointer-events: none; transform: translateY(10px); }
#grace-launcher .pulse-dot {
  width: 9px; height: 9px;
  background: #6EDDD3;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.65;transform:scale(1.35)} }

/* ── Widget container ── */
#grace-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  width: 400px;
  max-width: calc(100vw - 32px);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 12px 60px rgba(26,43,74,0.2), 0 2px 12px rgba(26,43,74,0.1);
  border: 1px solid #dde4ee;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: min(680px, calc(100vh - 48px));
  opacity: 0;
  transform: translateY(16px) scale(0.97);
  pointer-events: none;
  transition: opacity 0.22s ease, transform 0.22s ease;
}
#grace-widget.open {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

/* Header */
.w-header {
  background: linear-gradient(135deg, #1A2B4A 0%, #0F1E38 100%);
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}
.w-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4A9B8E, #2d7a6e);
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Serif Display', serif;
  font-size: 18px;
  color: #fff;
  flex-shrink: 0;
}
.w-header-text { flex: 1; min-width: 0; }
.w-name { font-size: 14px; font-weight: 600; color: #fff; }
.w-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 1px; }
.w-status { display: flex; align-items: center; gap: 5px; margin-top: 3px; }
.w-status-dot { width: 6px; height: 6px; background: #6EDDD3; border-radius: 50%; animation: pulse 2s infinite; }
.w-status-text { font-size: 10px; color: #6EDDD3; }
.w-close {
  background: rgba(255,255,255,0.1);
  border: none;
  color: rgba(255,255,255,0.7);
  width: 28px; height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  line-height: 28px;
  text-align: center;
  transition: background 0.15s;
  flex-shrink: 0;
}
.w-close:hover { background: rgba(255,255,255,0.2); color: #fff; }

/* Messages */
.w-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;
}
.w-messages::-webkit-scrollbar { width: 4px; }
.w-messages::-webkit-scrollbar-track { background: transparent; }
.w-messages::-webkit-scrollbar-thumb { background: #dde4ee; border-radius: 2px; }

.msg { display: flex; gap: 8px; align-items: flex-end; }
.msg.user { flex-direction: row-reverse; }
.bot-avatar {
  width: 28px; height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4A9B8E, #2d7a6e);
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Serif Display', serif;
  font-size: 13px;
  color: #fff;
  flex-shrink: 0;
}
.bubble {
  max-width: 80%;
  padding: 10px 13px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.55;
}
.msg.bot .bubble {
  background: #F7F9FC;
  border: 1px solid #eef1f7;
  color: #1A2B4A;
  border-bottom-left-radius: 4px;
}
.msg.user .bubble {
  background: linear-gradient(135deg, #1A2B4A, #0F1E38);
  color: #fff;
  border-bottom-right-radius: 4px;
}

/* Typing indicator */
.typing-dots { display: flex; gap: 4px; padding: 4px 2px; }
.typing-dots span {
  width: 6px; height: 6px;
  background: #7A8BA0;
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

/* Quick replies */
.quick-replies { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.qr-btn {
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid #dde4ee;
  background: #fff;
  color: #1A2B4A;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.qr-btn:hover { background: #EEF1F7; border-color: #4A9B8E; color: #4A9B8E; }

/* Service cards */
.service-cards { display: flex; flex-direction: column; gap: 8px; max-width: 280px; }
.service-card {
  background: #fff;
  border: 1px solid #dde4ee;
  border-radius: 12px;
  padding: 12px;
  transition: border-color 0.15s;
}
.service-card:hover { border-color: #4A9B8E; }
.sc-tag { font-size: 10px; font-weight: 600; color: #4A9B8E; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
.sc-name { font-size: 13px; font-weight: 600; color: #1A2B4A; margin-bottom: 4px; }
.sc-desc { font-size: 12px; color: #7A8BA0; line-height: 1.45; margin-bottom: 8px; }
.sc-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.sc-badge {
  font-size: 10px;
  color: #7A8BA0;
  background: #F7F9FC;
  border: 1px solid #eef1f7;
  border-radius: 6px;
  padding: 2px 7px;
}
.sc-book {
  width: 100%;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  padding: 7px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #1A2B4A, #0F1E38);
  color: #fff;
  cursor: pointer;
  transition: opacity 0.15s;
}
.sc-book:hover { opacity: 0.85; }
.sc-book.booked { background: #4A9B8E; }

/* Deal banner */
.deal-banner {
  background: linear-gradient(135deg, #EAF5F4, #f0faf9);
  border: 1px solid #c8e8e4;
  border-radius: 12px;
  padding: 12px;
  max-width: 280px;
}
.deal-name { font-size: 13px; font-weight: 600; color: #1A2B4A; margin-bottom: 4px; }
.deal-desc { font-size: 12px; color: #5a7a78; line-height: 1.45; margin-bottom: 10px; }
.deal-cta {
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  padding: 7px 14px;
  border-radius: 8px;
  border: none;
  background: #4A9B8E;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}
.deal-cta:hover { background: #3a8578; }

/* Input */
.w-input-area {
  padding: 12px 14px;
  border-top: 1px solid #eef1f7;
  display: flex;
  gap: 8px;
  align-items: flex-end;
  flex-shrink: 0;
  background: #fff;
}
.w-input {
  flex: 1;
  font-size: 13px;
  font-family: 'DM Sans', sans-serif;
  padding: 9px 12px;
  border: 1px solid #dde4ee;
  border-radius: 10px;
  resize: none;
  outline: none;
  line-height: 1.4;
  max-height: 90px;
  overflow-y: auto;
  color: #1A2B4A;
  transition: border-color 0.15s;
}
.w-input:focus { border-color: #4A9B8E; }
.w-input::placeholder { color: #aab5c4; }
.w-send {
  width: 36px; height: 36px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #1A2B4A, #0F1E38);
  color: #fff;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;
}
.w-send:hover { opacity: 0.85; }
.w-send:disabled { opacity: 0.4; cursor: not-allowed; }

/* Powered by */
.w-powered {
  text-align: center;
  font-size: 10px;
  color: #c0c8d4;
  padding: 6px 0 10px;
  flex-shrink: 0;
}
.w-powered a { color: #4A9B8E; text-decoration: none; }
</style>
</head>
<body>

<div class="demo-note">Shopflow widget demo — embed snippet below replaces this page</div>

<!-- Launcher button -->
<button id="grace-launcher" onclick="toggleWidget()">
  <span class="pulse-dot"></span>
  Chat with Grace
</button>

<!-- Widget panel -->
<div id="grace-widget">
  <div class="w-header">
    <div class="w-avatar">G</div>
    <div class="w-header-text">
      <div class="w-name">Grace</div>
      <div class="w-sub">Modern Med Spa Concierge</div>
      <div class="w-status">
        <div class="w-status-dot"></div>
        <div class="w-status-text">Online now</div>
      </div>
    </div>
    <button class="w-close" onclick="toggleWidget()">×</button>
  </div>

  <div class="w-messages" id="w-messages"></div>

  <div class="w-input-area">
    <textarea class="w-input" id="w-input" placeholder="Ask about treatments, pricing, specials..." rows="1"
      onkeydown="handleKey(event)" oninput="autoResize(this)"></textarea>
    <button class="w-send" id="w-send" onclick="sendMessage()">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
    </button>
  </div>
  <div class="w-powered">Powered by <a href="https://gocannaflow.com" target="_blank">Shopflow</a></div>
</div>

<script>
// ── Config ────────────────────────────────────────────
const CFG = {
  PROXY_URL:  'https://lux-proxy-production.up.railway.app/mms/api/chat',
  CONFIG_URL: 'https://lux-proxy-production.up.railway.app/mms/config',
  MODEL:      'claude-haiku-4-5-20251001',
  MAX_TOKENS: 700,
  TRACK_URL: 'https://lux-proxy-production.up.railway.app/mms/api/track',
  SITE:       'https://www.modernmedspautah.com',
  BOT_NAME:   'Grace',
  SPA_NAME:   'Modern Med Spa',
};

// ── State ─────────────────────────────────────────────
let isOpen    = false;
let isBusy    = false;
let hasOpened = false;
let chatHistory = [];
let configData  = { services: [], deals: [] };
let dealIndex   = 0;

// ── Load config from proxy ────────────────────────────
async function loadConfig() {
  try {
    const res = await fetch(CFG.CONFIG_URL);
    if (res.ok) {
      const data = await res.json();
      configData.services = data.services || [];
      configData.deals    = data.deals    || [];
      console.log(`[Grace] Config loaded — ${configData.services.length} services, ${configData.deals.length} deals`);
    }
  } catch (e) {
    console.warn('[Grace] Config load failed, using fallback');
  }
}

// ── Widget toggle ─────────────────────────────────────
function toggleWidget() {
  isOpen = !isOpen;
  document.getElementById('grace-widget').classList.toggle('open', isOpen);
  document.getElementById('grace-launcher').classList.toggle('hidden', isOpen);
  if (isOpen && !hasOpened) {
    hasOpened = true;
    startConversation();
  }
  if (isOpen) setTimeout(() => document.getElementById('w-input').focus(), 250);
}

// ── Opening flow ──────────────────────────────────────
async function startConversation() {
  await loadConfig();
  addBotMessage(`Hi! I'm **Grace**, your concierge at Modern Med Spa Utah. 👋\n\nI'm here to help you find the perfect treatment and answer any questions. What brings you in today?`);
  setTimeout(() => showQuickReplies([
    '💉 Smooth lines & wrinkles',
    '✨ Improve skin texture',
    '🔦 Dark spots or redness',
    '💊 Weight loss or wellness',
    '🔍 Just exploring options',
  ]), 400);
}

// ── Quick replies ─────────────────────────────────────
function showQuickReplies(opts) {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `<div style="width:28px;flex-shrink:0"></div><div class="quick-replies">${
    opts.map(o => `<button class="qr-btn" onclick="selectQuickReply(this,'${o.replace(/'/g,"\\'")}')">
      ${o}</button>`).join('')
  }</div>`;
  document.getElementById('w-messages').appendChild(div);
  scrollBottom();
}

function selectQuickReply(btn, val) {
  // Disable all quick replies in this group
  btn.closest('.quick-replies').querySelectorAll('.qr-btn').forEach(b => {
    b.disabled = true; b.style.opacity = '0.5';
  });
  addUserMessage(val);
  processInput(val);
}

// ── Send message ──────────────────────────────────────
async function sendMessage() {
  const input = document.getElementById('w-input');
  const text  = input.value.trim();
  if (!text || isBusy) return;
  addUserMessage(text);
  input.value = '';
  input.style.height = 'auto';
  await processInput(text);
}

async function processInput(text) {
  chatHistory.push({ role: 'user', content: text });
  const typing = showTyping();
  isBusy = true;
  document.getElementById('w-send').disabled = true;

  try {
    const resp = await fetch(CFG.PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      CFG.MODEL,
        max_tokens: CFG.MAX_TOKENS,
        system:     buildSystemPrompt(),
        messages:   chatHistory,
      }),
    });

    removeEl(typing);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data  = await resp.json();
    const reply = data.content?.[0]?.text || "I'm sorry, I had trouble with that. Please try again.";
    chatHistory.push({ role: 'assistant', content: reply });
    addBotMessage(reply);

    // Show deal banner occasionally
    if (chatHistory.length === 4 || chatHistory.length === 8) showDealBanner();

  } catch {
    removeEl(typing);
    addBotMessage("I'm having a little trouble right now. Feel free to reach out or book online at modernmedspautah.com — the team is happy to help! 💙");
  }

  isBusy = false;
  document.getElementById('w-send').disabled = false;
}

// ── System prompt ─────────────────────────────────────
function buildSystemPrompt() {
  const serviceList = configData.services.length
    ? configData.services.map(s => `• ${s.name} (${s.category}) — ${s.description.substring(0,90)}...`).join('\n')
    : '• Services loading...';

  const dealList = configData.deals.length
    ? configData.deals.map(d => `• ${d.name}: ${d.description}`).join('\n')
    : '• Modern Beauty Bank Membership available';

  return `You are Grace, the AI treatment concierge for Modern Med Spa Utah. You are warm, knowledgeable, and professional — like a trusted friend who happens to be an aesthetics expert.

ABOUT MODERN MED SPA:
- Medical Director: Dr. Grace Jeffers, DNP, FNP — 9+ years in aesthetic and wellness medicine
- Team: Hailey Knight (RN-BSN Injector), Sophie Binns (Lead Master Aesthetician), Nathalie Rodriguez (Master Aesthetician)
- Mission: Natural, results-driven treatments that help clients feel confident and radiant
- Website: modernmedspautah.com

OUR SERVICES:
${serviceList}

CURRENT PROMOTIONS:
${dealList}

MODERN BEAUTY BANK MEMBERSHIP:
- Members pay monthly into a personal beauty account — balance never expires
- Use balance on ANY service or product at Modern Med Spa
- Members get exclusive discounts on top of that
- Ideal for series treatments, ongoing maintenance, or budget-conscious clients

YOUR ROLE:
- Help visitors find treatments that match their goals
- Weave in current specials naturally when relevant
- Mention the membership when someone is considering a series or ongoing treatments
- Always encourage a free consultation as the easiest next step
- Be honest about downtime and what to expect
- Never make specific medical claims or diagnose conditions
- Keep responses warm and concise — 2–4 sentences max unless explaining a treatment
- Always end with an invitation to book or ask more questions

BOOKING: All bookings at modernmedspautah.com/book or via their contact page.`;
}

// ── Service cards ─────────────────────────────────────
function showServiceCards(services) {
  if (!services.length) return;
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  const cards = services.slice(0, 3).map(s => `
    <div class="service-card">
      ${s.tag ? `<div class="sc-tag">${s.tag}</div>` : ''}
      <div class="sc-name">${s.name}</div>
      <div class="sc-desc">${s.description.substring(0,100)}...</div>
      <div class="sc-meta">
        ${s.downtime ? `<span class="sc-badge">⏱ ${s.downtime}</span>` : ''}
        ${s.results  ? `<span class="sc-badge">✨ ${s.results}</span>`  : ''}
      </div>
      <button class="sc-book" onclick="bookService(this,'${s.name.replace(/'/g,"\\'")}')">Book Consultation →</button>
    </div>`).join('');
  wrap.innerHTML = `<div class="bot-avatar">G</div><div><div class="service-cards">${cards}</div></div>`;
  document.getElementById('w-messages').appendChild(wrap);
  scrollBottom();
}

function bookService(btn, name) {
  btn.textContent = '✓ Requested!';
  btn.classList.add('booked');
  fetch(CFG.TRACK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event:'book'})}).catch(()=>{});
  addBotMessage(`Love it! You can book your free **${name}** consultation at [modernmedspautah.com](${CFG.SITE}/book) — Dr. Jeffers and the team will build you a personalized plan. 🌿`);
  setTimeout(() => showDealBanner('membership'), 800);
}

// ── Deal banner ───────────────────────────────────────
function showDealBanner(id) {
  const deals = configData.deals.filter(d => id ? d.id === id : d.active);
  if (!deals.length) return;
  const deal = deals[dealIndex % deals.length];
  dealIndex++;
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  wrap.innerHTML = `<div class="bot-avatar">G</div>
    <div><div class="deal-banner">
      <div class="deal-name">${deal.name}</div>
      <div class="deal-desc">${deal.description}</div>
      <button class="deal-cta" onclick="window.open('${CFG.SITE}${deal.url||deal.shop_url||''}','_blank')">${deal.cta} →</button>
    </div></div>`;
  document.getElementById('w-messages').appendChild(wrap);
  scrollBottom();
}

// ── Helpers ───────────────────────────────────────────
function addBotMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `<div class="bot-avatar">G</div><div class="bubble">${fmt(text)}</div>`;
  document.getElementById('w-messages').appendChild(div);
  scrollBottom();
}
function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'msg user';
  div.innerHTML = `<div class="bubble">${esc(text)}</div>`;
  document.getElementById('w-messages').appendChild(div);
  scrollBottom();
}
function showTyping() {
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.innerHTML = `<div class="bot-avatar">G</div><div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  document.getElementById('w-messages').appendChild(div);
  scrollBottom();
  return div;
}
function removeEl(el) { el?.remove(); }
function scrollBottom() {
  const m = document.getElementById('w-messages');
  setTimeout(() => m.scrollTop = m.scrollHeight, 60);
}
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 90) + 'px';
}
function fmt(t) {
  return t
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" style="color:#4A9B8E;text-decoration:underline">$1</a>')
    .replace(/\n/g,'<br>');
}
function esc(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Preload config
loadConfig();
</script>

<!--
═══════════════════════════════════════════════════════════
  EMBED SNIPPET — paste into <head> of modernmedspautah.com
═══════════════════════════════════════════════════════════

<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://YOUR_CLOUDFLARE_URL/grace-widget.js"></script>

OR simply copy everything between the <style> and </script> tags
above and paste before </body> on their site.
═══════════════════════════════════════════════════════════
-->

</body>
</html>
