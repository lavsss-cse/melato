// ─── 3AM Mode ───────────────────────────────────────────────────────────────

function check3AMMode() {
  const hour = new Date().getHours();
  const is3AM = hour >= 0 && hour < 4;

  if (is3AM && !document.getElementById('am3-overlay')) {
    inject3AMOverlay();
  }
}

function inject3AMOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'am3-overlay';
  overlay.innerHTML = `
    <div id="am3-inner">
      <div id="am3-moon">☽</div>
      <h2 id="am3-title">It's the middle of the night.</h2>
      <p id="am3-msg">Your mind is racing, but your body needs rest.<br/>You are safe. You are okay. It's time to sleep.</p>
      <div id="am3-breathe">
        <div id="am3-circle"></div>
        <div id="am3-breath-label">Breathe in...</div>
      </div>
      <div id="am3-actions">
        <a href="sound-room.html" id="am3-sounds">Play sleep sounds</a>
        <a href="thought-dump.html" id="am3-thoughts">Dump your thoughts</a>
        <button id="am3-dismiss" onclick="dismiss3AM()">I'm okay, continue →</button>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #am3-overlay {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: rgba(8, 6, 18, 0.97);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: am3-fade-in 1.5s ease forwards;
    }

    @keyframes am3-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    #am3-inner {
      text-align: center;
      padding: 40px 24px;
      max-width: 400px;
      width: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    #am3-moon {
      font-size: 3rem;
      animation: am3-float 4s ease-in-out infinite;
    }

    @keyframes am3-float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-10px); }
    }

    #am3-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 1.4rem;
      font-weight: 600;
      color: #e8e8ff;
      letter-spacing: -0.3px;
      line-height: 1.4;
    }

    #am3-msg {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.95rem;
      color: #9e9aba;
      line-height: 1.8;
    }

    #am3-breathe {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin: 8px 0;
    }

    #am3-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 2px solid rgba(179,157,219,0.4);
      background: rgba(179,157,219,0.08);
      animation: am3-breathe 8s ease-in-out infinite;
    }

    @keyframes am3-breathe {
      0%,  100% { transform: scale(1);    opacity: 0.5; }
      40%        { transform: scale(1.5);  opacity: 1;   }
      60%        { transform: scale(1.5);  opacity: 1;   }
    }

    #am3-breath-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.82rem;
      color: #b39ddb;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      min-height: 20px;
    }

    #am3-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }

    #am3-sounds, #am3-thoughts {
      display: block;
      padding: 12px 24px;
      border-radius: 10px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s;
    }

    #am3-sounds {
      background: rgba(179,157,219,0.15);
      color: #b39ddb;
      border: 1px solid rgba(179,157,219,0.2);
    }

    #am3-sounds:hover { background: rgba(179,157,219,0.25); }

    #am3-thoughts {
      background: rgba(232,165,152,0.1);
      color: #e8a598;
      border: 1px solid rgba(232,165,152,0.2);
    }

    #am3-thoughts:hover { background: rgba(232,165,152,0.2); }

    #am3-dismiss {
      background: transparent;
      border: none;
      color: #555570;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.8rem;
      cursor: pointer;
      padding: 8px;
      transition: color 0.2s;
    }

    #am3-dismiss:hover { color: #9e9aba; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
  start3AMBreathing();
}

function start3AMBreathing() {
  const label = document.getElementById('am3-breath-label');
  if (!label) return;

  const phases = [
    { text: 'Breathe in...', duration: 4000 },
    { text: 'Hold...',        duration: 2000 },
    { text: 'Breathe out...', duration: 4000 },
    { text: 'Rest...',        duration: 2000 },
  ];

  let i = 0;
  function next() {
    if (!document.getElementById('am3-breath-label')) return;
    label.textContent = phases[i].text;
    i = (i + 1) % phases.length;
    setTimeout(next, phases[i === 0 ? phases.length - 1 : i - 1].duration);
  }
  next();
}

function dismiss3AM() {
  const overlay = document.getElementById('am3-overlay');
  if (overlay) {
    overlay.style.transition = 'opacity 0.8s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 800);
  }
  // Don't show again for this session
  sessionStorage.setItem('am3-dismissed', '1');
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Only show 3AM mode if not already dismissed this session
  if (!sessionStorage.getItem('am3-dismissed')) {
    check3AMMode();
  }

  // Highlight active nav link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.navbar-links a, .bottom-nav-item').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
});