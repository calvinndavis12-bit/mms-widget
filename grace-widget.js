(function() {
  'use strict';

  // ── Config ──────────────────────────────────────────
  var CFG = {
    PROXY_URL:  'https://lux-proxy-production.up.railway.app/mms/api/chat',
    CONFIG_URL: 'https://lux-proxy-production.up.railway.app/mms/config',
    SITE:       'https://www.modernmedspautah.com',
    BOT_NAME:   'Grace',
    SPA_NAME:   'Modern Med Spa',
    MODEL:      'claude-haiku-4-5-20251001',
    MAX_TOKENS: 700,
  };

  // ── State ───────────────────────────────────────────
  var isOpen      = false;
  var isBusy      = false;
  var hasOpened   = false;
  var chatHistory = [];
  var configData  = { services: [], deals: [] };
  var dealIndex   = 0;

  // ── Inject styles ───────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    '#grace-launcher{position:fixed;bottom:24px;right:24px;z-index:2147483646;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#1A2B4A,#0F1E38);color:#fff;border:none;border-radius:50px;padding:13px 22px 13px 16px;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px;font-weight:500;box-shadow:0 6px 28px rgba(26,43,74,.4);transition:transform .2s,box-shadow .2s,opacity .2s}',
    '#grace-launcher:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(26,43,74,.5)}',
    '#grace-launcher.gw-hidden{opacity:0;pointer-events:none;transform:translateY(10px)}',
    '#grace-launcher .gw-dot{width:9px;height:9px;background:#6EDDD3;border-radius:50%;flex-shrink:0;animation:gwPulse 2s infinite}',
    '@keyframes gwPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.65;transform:scale(1.35)}}',
    '#grace-widget{position:fixed;bottom:24px;right:24px;z-index:2147483647;width:400px;max-width:calc(100vw - 32px);background:#fff;border-radius:18px;box-shadow:0 12px 60px rgba(26,43,74,.2),0 2px 12px rgba(26,43,74,.1);border:1px solid #dde4ee;display:flex;flex-direction:column;overflow:hidden;max-height:min(680px,calc(100vh - 48px));opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:opacity .22s,transform .22s;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}',
    '#grace-widget.gw-open{opacity:1;transform:translateY(0) scale(1);pointer-events:all}',
    '.gw-header{background:linear-gradient(135deg,#1A2B4A,#0F1E38);padding:16px 18px;display:flex;align-items:center;gap:12px;flex-shrink:0}',
    '.gw-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#4A9B8E,#2d7a6e);display:flex;align-items:center;justify-content:center;font-size:18px;color:#fff;flex-shrink:0;font-style:italic;font-weight:400}',
    '.gw-htext{flex:1;min-width:0}.gw-name{font-size:14px;font-weight:600;color:#fff}.gw-sub{font-size:11px;color:rgba(255,255,255,.6);margin-top:1px}',
    '.gw-status{display:flex;align-items:center;gap:5px;margin-top:3px}.gw-sdot{width:6px;height:6px;background:#6EDDD3;border-radius:50%;animation:gwPulse 2s infinite}.gw-stxt{font-size:10px;color:#6EDDD3}',
    '.gw-close{background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.7);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:16px;line-height:28px;text-align:center;flex-shrink:0;transition:background .15s}',
    '.gw-close:hover{background:rgba(255,255,255,.2);color:#fff}',
    '.gw-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth}',
    '.gw-msgs::-webkit-scrollbar{width:4px}.gw-msgs::-webkit-scrollbar-thumb{background:#dde4ee;border-radius:2px}',
    '.gw-msg{display:flex;gap:8px;align-items:flex-end}.gw-msg.gw-user{flex-direction:row-reverse}',
    '.gw-bavatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#4A9B8E,#2d7a6e);display:flex;align-items:center;justify-content:center;font-size:13px;color:#fff;flex-shrink:0;font-style:italic}',
    '.gw-bubble{max-width:80%;padding:10px 13px;border-radius:14px;font-size:13px;line-height:1.55}',
    '.gw-msg.gw-bot .gw-bubble{background:#F7F9FC;border:1px solid #eef1f7;color:#1A2B4A;border-bottom-left-radius:4px}',
    '.gw-msg.gw-user .gw-bubble{background:linear-gradient(135deg,#1A2B4A,#0F1E38);color:#fff;border-bottom-right-radius:4px}',
    '.gw-dots{display:flex;gap:4px;padding:4px 2px}.gw-dots span{width:6px;height:6px;background:#7A8BA0;border-radius:50%;animation:gwBounce 1.2s infinite}',
    '.gw-dots span:nth-child(2){animation-delay:.2s}.gw-dots span:nth-child(3){animation-delay:.4s}',
    '@keyframes gwBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}',
    '.gw-qrs{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}',
    '.gw-qr{font-size:12px;font-family:inherit;padding:6px 12px;border-radius:20px;border:1px solid #dde4ee;background:#fff;color:#1A2B4A;cursor:pointer;transition:all .15s;white-space:nowrap}',
    '.gw-qr:hover{background:#EEF1F7;border-color:#4A9B8E;color:#4A9B8E}',
    '.gw-cards{display:flex;flex-direction:column;gap:8px;max-width:280px}',
    '.gw-card{background:#fff;border:1px solid #dde4ee;border-radius:12px;padding:12px;transition:border-color .15s}',
    '.gw-card:hover{border-color:#4A9B8E}',
    '.gw-ctag{font-size:10px;font-weight:600;color:#4A9B8E;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px}',
    '.gw-cname{font-size:13px;font-weight:600;color:#1A2B4A;margin-bottom:4px}',
    '.gw-cdesc{font-size:12px;color:#7A8BA0;line-height:1.45;margin-bottom:8px}',
    '.gw-cmeta{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px}',
    '.gw-cbadge{font-size:10px;color:#7A8BA0;background:#F7F9FC;border:1px solid #eef1f7;border-radius:6px;padding:2px 7px}',
    '.gw-cbook{width:100%;font-size:12px;font-family:inherit;font-weight:500;padding:7px;border-radius:8px;border:none;background:linear-gradient(135deg,#1A2B4A,#0F1E38);color:#fff;cursor:pointer;transition:opacity .15s}',
    '.gw-cbook:hover{opacity:.85}.gw-cbook.gw-booked{background:#4A9B8E}',
    '.gw-deal{background:linear-gradient(135deg,#EAF5F4,#f0faf9);border:1px solid #c8e8e4;border-radius:12px;padding:12px;max-width:280px}',
    '.gw-dname{font-size:13px;font-weight:600;color:#1A2B4A;margin-bottom:4px}',
    '.gw-ddesc{font-size:12px;color:#5a7a78;line-height:1.45;margin-bottom:10px}',
    '.gw-dcta{font-size:12px;font-family:inherit;font-weight:500;padding:7px 14px;border-radius:8px;border:none;background:#4A9B8E;color:#fff;cursor:pointer;transition:background .15s}',
    '.gw-dcta:hover{background:#3a8578}',
    '.gw-input-area{padding:12px 14px;border-top:1px solid #eef1f7;display:flex;gap:8px;align-items:flex-end;flex-shrink:0;background:#fff}',
    '.gw-input{flex:1;font-size:13px;font-family:inherit;padding:9px 12px;border:1px solid #dde4ee;border-radius:10px;resize:none;outline:none;line-height:1.4;max-height:90px;overflow-y:auto;color:#1A2B4A;transition:border-color .15s}',
    '.gw-input:focus{border-color:#4A9B8E}',
    '.gw-send{width:36px;height:36px;border-radius:10px;border:none;background:linear-gradient(135deg,#1A2B4A,#0F1E38);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:opacity .15s}',
    '.gw-send:hover{opacity:.85}.gw-send:disabled{opacity:.4;cursor:not-allowed}',
    '.gw-powered{text-align:center;font-size:10px;color:#c0c8d4;padding:6px 0 10px;flex-shrink:0}',
    '.gw-powered a{color:#4A9B8E;text-decoration:none}',
  ].join('');
  document.head.appendChild(style);

  // ── Build HTML ──────────────────────────────────────
  var launcher = document.createElement('button');
  launcher.id = 'grace-launcher';
  launcher.innerHTML = '<span class="gw-dot"></span>Chat with Grace';
  launcher.onclick = toggleWidget;
  document.body.appendChild(launcher);

  var widget = document.createElement('div');
  widget.id = 'grace-widget';
  widget.innerHTML = [
    '<div class="gw-header">',
    '  <div class="gw-avatar">G</div>',
    '  <div class="gw-htext">',
    '    <div class="gw-name">Grace</div>',
    '    <div class="gw-sub">Modern Med Spa Concierge</div>',
    '    <div class="gw-status"><div class="gw-sdot"></div><div class="gw-stxt">Online now</div></div>',
    '  </div>',
    '  <button class="gw-close" onclick="document.getElementById(\'grace-launcher\').classList.remove(\'gw-hidden\');document.getElementById(\'grace-widget\').classList.remove(\'gw-open\')">×</button>',
    '</div>',
    '<div class="gw-msgs" id="gw-msgs"></div>',
    '<div class="gw-input-area">',
    '  <textarea class="gw-input" id="gw-input" placeholder="Ask about treatments, specials..." rows="1"></textarea>',
    '  <button class="gw-send" id="gw-send">',
    '    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    '  </button>',
    '</div>',
    '<div class="gw-powered">Powered by <a href="https://gocannaflow.com" target="_blank">Shopflow</a></div>',
  ].join('');
  document.body.appendChild(widget);

  // Wire up events
  document.getElementById('gw-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });
  document.getElementById('gw-input').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 90) + 'px';
  });
  document.getElementById('gw-send').addEventListener('click', sendMessage);

  // ── Load config ─────────────────────────────────────
  function loadConfig() {
    fetch(CFG.CONFIG_URL)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        configData.services = d.services || d.products || [];
        configData.deals    = d.deals    || [];
      })
      .catch(function() {});
  }

  // ── Toggle ───────────────────────────────────────────
  function toggleWidget() {
    isOpen = !isOpen;
    widget.classList.toggle('gw-open', isOpen);
    launcher.classList.toggle('gw-hidden', isOpen);
    if (isOpen && !hasOpened) { hasOpened = true; startConversation(); }
    if (isOpen) setTimeout(function() { document.getElementById('gw-input').focus(); }, 250);
  }

  // ── Conversation start ───────────────────────────────
  function startConversation() {
    addBotMsg('Hi! I\'m <strong>Grace</strong>, your concierge at Modern Med Spa Utah. 👋<br><br>I\'m here to help you find the perfect treatment. What brings you in today?');
    setTimeout(function() {
      showQuickReplies(['💉 Smooth lines & wrinkles','✨ Improve skin texture','🔦 Dark spots or redness','💊 Weight loss or wellness','🔍 Just exploring']);
    }, 400);
  }

  // ── Quick replies ────────────────────────────────────
  function showQuickReplies(opts) {
    var wrap = document.createElement('div');
    wrap.className = 'gw-msg gw-bot';
    var btns = opts.map(function(o) {
      return '<button class="gw-qr" onclick="(function(b,v){b.closest(\'.gw-qrs\').querySelectorAll(\'.gw-qr\').forEach(function(x){x.disabled=true;x.style.opacity=\'.5\'});window._graceSelect(v)})(this,\'' + o.replace(/'/g, "\\'") + '\')">' + o + '</button>';
    }).join('');
    wrap.innerHTML = '<div style="width:28px;flex-shrink:0"></div><div class="gw-qrs">' + btns + '</div>';
    msgs().appendChild(wrap);
    scrollBottom();
  }

  window._graceSelect = function(val) {
    addUserMsg(val);
    processInput(val);
  };

  // ── Send ─────────────────────────────────────────────
  function sendMessage() {
    var input = document.getElementById('gw-input');
    var text  = input.value.trim();
    if (!text || isBusy) return;
    addUserMsg(text);
    input.value = '';
    input.style.height = 'auto';
    processInput(text);
  }

  async function processInput(text) {
    chatHistory.push({ role: 'user', content: text });
    var typing = showTyping();
    isBusy = true;
    document.getElementById('gw-send').disabled = true;

    try {
      var resp = await fetch(CFG.PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model:      CFG.MODEL,
          max_tokens: CFG.MAX_TOKENS,
          system:     buildSystemPrompt(),
          messages:   chatHistory,
        }),
      });
      typing.remove();
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data  = await resp.json();
      var reply = (data.content && data.content[0] && data.content[0].text) || 'I\'m sorry, I had trouble with that. Please try again.';
      chatHistory.push({ role: 'assistant', content: reply });
      addBotMsg(fmt(reply));
      if (chatHistory.length === 4 || chatHistory.length === 8) showDeal();
    } catch(e) {
      typing.remove();
      addBotMsg('I\'m having a little trouble right now. Feel free to book online at <a href="' + CFG.SITE + '" target="_blank" style="color:#4A9B8E">modernmedspautah.com</a> — the team is happy to help! 💙');
    }

    isBusy = false;
    document.getElementById('gw-send').disabled = false;
  }

  // ── System prompt ────────────────────────────────────
  function buildSystemPrompt() {
    var svcList = configData.services.length
      ? configData.services.map(function(s) { return '• ' + s.name + ' (' + (s.category||s.collection) + ') — ' + (s.description||'').substring(0,90) + '...'; }).join('\n')
      : '• Services loading...';
    var dealList = configData.deals.length
      ? configData.deals.map(function(d) { return '• ' + d.name + ': ' + d.description; }).join('\n')
      : '• Modern Beauty Bank Membership available';

    return 'You are Grace, the AI treatment concierge for Modern Med Spa Utah. You are warm, knowledgeable, and professional — like a trusted friend who happens to be an aesthetics expert.\n\nABOUT MODERN MED SPA:\n- Medical Director: Dr. Grace Jeffers, DNP, FNP — 9+ years in aesthetic and wellness medicine\n- Team: Hailey Knight (RN-BSN Injector), Sophie Binns (Lead Master Aesthetician), Nathalie Rodriguez (Master Aesthetician)\n- Website: modernmedspautah.com\n\nOUR SERVICES:\n' + svcList + '\n\nCURRENT PROMOTIONS:\n' + dealList + '\n\nMODERN BEAUTY BANK MEMBERSHIP:\n- Members pay monthly into a personal beauty account — balance never expires\n- Use on ANY service or product at Modern Med Spa\n- Members get exclusive discounts\n- Ideal for series treatments or ongoing maintenance\n\nYOUR ROLE:\n- Help visitors find treatments that match their goals\n- Weave in current specials naturally\n- Mention membership for series or ongoing treatments\n- Always encourage a free consultation as the easiest next step\n- Be honest about downtime and what to expect\n- Never make specific medical claims or diagnose conditions\n- Keep responses warm and concise — 2–4 sentences max\n- Always end with an invitation to book or ask more questions\n\nBOOKING: All bookings at modernmedspautah.com/book';
  }

  // ── Deal banner ──────────────────────────────────────
  function showDeal(id) {
    var deals = id ? configData.deals.filter(function(d){ return d.id===id; }) : configData.deals.filter(function(d){ return d.active!==false; });
    if (!deals.length) return;
    var deal = deals[dealIndex % deals.length];
    dealIndex++;
    var wrap = document.createElement('div');
    wrap.className = 'gw-msg gw-bot';
    wrap.innerHTML = '<div class="gw-bavatar">G</div><div><div class="gw-deal"><div class="gw-dname">' + deal.name + '</div><div class="gw-ddesc">' + deal.description + '</div><button class="gw-dcta" onclick="window.open(\'' + CFG.SITE + (deal.url||deal.shopUrl||'') + '\',\'_blank\')">' + deal.cta + ' →</button></div></div>';
    msgs().appendChild(wrap);
    scrollBottom();
  }

  // ── Helpers ──────────────────────────────────────────
  function msgs() { return document.getElementById('gw-msgs'); }
  function scrollBottom() { var m = msgs(); setTimeout(function(){ m.scrollTop = m.scrollHeight; }, 60); }

  function addBotMsg(html) {
    var d = document.createElement('div');
    d.className = 'gw-msg gw-bot';
    d.innerHTML = '<div class="gw-bavatar">G</div><div class="gw-bubble">' + html + '</div>';
    msgs().appendChild(d);
    scrollBottom();
  }
  function addUserMsg(text) {
    var d = document.createElement('div');
    d.className = 'gw-msg gw-user';
    d.innerHTML = '<div class="gw-bubble">' + esc(text) + '</div>';
    msgs().appendChild(d);
    scrollBottom();
  }
  function showTyping() {
    var d = document.createElement('div');
    d.className = 'gw-msg gw-bot';
    d.innerHTML = '<div class="gw-bavatar">G</div><div class="gw-bubble"><div class="gw-dots"><span></span><span></span><span></span></div></div>';
    msgs().appendChild(d);
    scrollBottom();
    return d;
  }
  function fmt(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" style="color:#4A9B8E;text-decoration:underline">$1</a>')
      .replace(/\n/g,'<br>');
  }
  function esc(t) { return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // Preload config on script load
  loadConfig();

})();
