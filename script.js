// ─── 3AM Mode ───────────────────────────────────────────────────────────────

function check3AMMode() {
  const hour = new Date().getHours();
  const is3AM = true;

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
      <div id="am3-actions">
        <a href="sound-room.html" id="am3-sounds" onclick="dismiss3AM()">Play sleep sounds</a>
        <a href="thought-dump.html" id="am3-thoughts" onclick="dismiss3AM()">Dump your thoughts</a>
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
      font-size: 3.5rem;
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

    #am3-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 100%;
      margin-top: 8px;
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
      cursor: pointer;
    }

    #am3-sounds {
      background: rgba(179,157,219,0.15);
      color: #b39ddb;
      border: 1px solid rgba(179,157,219,0.2);
    }

    #am3-sounds:hover { background: rgba(179,157,219,0.28); }

    #am3-thoughts {
      background: rgba(232,165,152,0.1);
      color: #e8a598;
      border: 1px solid rgba(232,165,152,0.2);
    }

    #am3-thoughts:hover { background: rgba(232,165,152,0.22); }

    #am3-dismiss {
      background: transparent;
      border: none;
      color: #555570;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.8rem;
      cursor: pointer;
      padding: 8px;
      transition: color 0.2s;
      margin-top: 4px;
    }

    #am3-dismiss:hover { color: #9e9aba; }
  `;

  document.head.appendChild(style);
  document.body.appendChild(overlay);
}

function dismiss3AM() {
  const overlay = document.getElementById('am3-overlay');
  if (overlay) {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
  }
  sessionStorage.setItem('am3-dismissed', '1');
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
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
