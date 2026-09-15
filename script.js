document.addEventListener('DOMContentLoaded', () => {
  window.autoSettings = { boost: 14, tcs: false, launch: true, exhaust: true, drift: false };
  window.radioState = { band: 'FM', frequency: '98.3 MHz', signal: 'LOCK (5/5)' };

  const needle = document.getElementById('needle');
  const progressBar = document.getElementById('progressBar');
  const bootStatus = document.getElementById('bootStatus');
  const bootScreen = document.getElementById('bootScreen');
  const ignitionScreen = document.getElementById('ignitionScreen');
  const desktopScreen = document.getElementById('desktopScreen');
  const typeWriterElement = document.getElementById('typeWriter');
  const startEngineBtn = document.getElementById('startEngineBtn');

  // Boot Sequence
  const bootPhases = ["ECU MAPPING...", "SPOOLING TWIN TURBOS...", "INJECTORS AT 100%...", "LAUNCH CONTROL ACTIVE."];
  let progress = 0, phaseIndex = 0;
  const bootInterval = setInterval(() => {
    progress += Math.random() * 8.5;
    const revBase = (progress / 100) * 180;
    const revSpike = Math.random() > 0.5 ? Math.random() * 45 : Math.random() * -12;
    const finalRev = Math.min(180, Math.max(0, revBase + revSpike));
    needle.style.transform = `rotate(${finalRev}deg)`;
    progressBar.style.width = Math.min(100, progress) + "%";

    const expectedPhase = Math.floor((progress / 100) * bootPhases.length);
    if (expectedPhase > phaseIndex && expectedPhase < bootPhases.length) {
      phaseIndex = expectedPhase;
      bootStatus.innerText = bootPhases[phaseIndex];
    }

    if (progress >= 100) {
      clearInterval(bootInterval);
      needle.style.transform = "rotate(185deg)";
      needle.style.boxShadow = "0 0 40px #ff1a3d, 0 0 15px #fff";
      setTimeout(() => {
        bootScreen.style.opacity = '0';
        setTimeout(() => {
          bootScreen.style.display = 'none';
          ignitionScreen.classList.remove('hidden');
          typeWriterEffect("WITHOUT ANY FURTHER TURBOLAG");
        }, 800);
      }, 700);
    }
  }, 140);

  function typeWriterEffect(text) {
    let i = 0;
    typeWriterElement.innerHTML = "";
    const typing = setInterval(() => {
      if (i < text.length) {
        typeWriterElement.innerHTML += text.charAt(i++);
      } else {
        clearInterval(typing);
      }
    }, 65);
  }

  startEngineBtn.addEventListener('click', () => {
    ignitionScreen.style.opacity = '0';
    ignitionScreen.style.transform = 'scale(1.08)';
    setTimeout(() => {
      ignitionScreen.style.display = 'none';
      desktopScreen.classList.remove('hidden');
    }, 800);
  });

  // Arcade Drawer & Tabs
  const gsTrigger = document.getElementById('gsTrigger');
  const gsDrawer = document.getElementById('gsDrawer');
  const gsClose = document.getElementById('gsClose');
  if (gsTrigger) gsTrigger.addEventListener('click', () => gsDrawer.classList.toggle('hidden'));
  if (gsClose) gsClose.addEventListener('click', () => gsDrawer.classList.add('hidden'));

  document.querySelectorAll('.g-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.g-panel').forEach(p => p.classList.add('hidden'));
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-target')).classList.remove('hidden');
    });
  });

  // Game 1: Turbo Clicker
  let arcadeScore = 0;
  let highScore = localStorage.getItem('autoOsHighScore') ? parseInt(localStorage.getItem('autoOsHighScore'), 10) : 0;
  let timeLeft = 15, timerActive = false, timerInterval = null;
  const highScoreValEl = document.getElementById('highScoreVal');
  if (highScoreValEl) highScoreValEl.innerText = highScore;

  document.getElementById('revArcadeBtn').addEventListener('click', () => {
    const timerValEl = document.getElementById('timerVal');
    const arcadeCountEl = document.getElementById('turboCount');
    const revBtn = document.getElementById('revArcadeBtn');

    if (!timerActive) {
      timerActive = true;
      arcadeScore = 0;
      timeLeft = 15;
      if (timerValEl) timerValEl.innerText = timeLeft + 's';
      if (arcadeCountEl) arcadeCountEl.innerText = "0 RPM";
      revBtn.innerText = "JAM THROTTLE";

      timerInterval = setInterval(() => {
        timeLeft--;
        if (timerValEl) timerValEl.innerText = timeLeft + 's';
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          timerActive = false;
          revBtn.innerText = "RESTART RUN";
          if (arcadeScore > highScore) {
            highScore = arcadeScore;
            localStorage.setItem('autoOsHighScore', highScore);
            if (highScoreValEl) highScoreValEl.innerText = highScore;
          }
        }
      }, 1000);
    }

    if (timerActive) {
      arcadeScore += Math.floor(Math.random() * 500 + 200);
      if (arcadeCountEl) arcadeCountEl.innerText = arcadeScore + " RPM";
      const qPsi = document.getElementById('quickPsi');
      if (qPsi) qPsi.innerText = "BOOST: " + (arcadeScore > 7500 ? "26.4 PSI" : "16.8 PSI");
    }
  });

  // Game 2: Launch Reaction Test
  let launchState = 'idle', launchStart = 0;
  let bestLaunch = localStorage.getItem('autoOsLaunch') || '--';
  const launchBestEl = document.getElementById('launchBest');
  if (launchBestEl) launchBestEl.innerText = bestLaunch === '--' ? '-- ms' : bestLaunch + ' ms';

  document.getElementById('launchBtn').addEventListener('click', () => {
    const light = document.getElementById('launchLight');
    if (launchState === 'idle') {
      launchState = 'waiting';
      light.innerText = 'WAIT FOR GREEN...';
      light.style.color = 'var(--neon-red)';
      setTimeout(() => {
        if (launchState === 'waiting') {
          launchState = 'go';
          launchStart = Date.now();
          light.innerText = 'GO GO GO!';
          light.style.color = 'var(--neon-green)';
        }
      }, Math.random() * 2200 + 1000);
    } else if (launchState === 'waiting') {
      launchState = 'idle';
      light.innerText = 'FALSE START!';
      light.style.color = 'var(--neon-red)';
    } else if (launchState === 'go') {
      const diff = Date.now() - launchStart;
      launchState = 'idle';
      light.innerText = diff + ' ms';
      light.style.color = 'var(--neon-blue)';
      if (bestLaunch === '--' || diff < parseInt(bestLaunch, 10)) {
        bestLaunch = diff;
        localStorage.setItem('autoOsLaunch', bestLaunch);
        if (launchBestEl) launchBestEl.innerText = bestLaunch + ' ms';
      }
    }
  });

  // Game 3: Shift Timing Test
  const shiftTarget = 8800;
  document.getElementById('shiftBtn').addEventListener('click', () => {
    const rpmVal = Math.floor(Math.random() * 2200 + 7400);
    const rpmEl = document.getElementById('shiftRpm');
    if (rpmEl) rpmEl.innerText = rpmVal + ' RPM';
    const accuracy = Math.max(0, Math.round(100 - Math.abs(rpmVal - shiftTarget) / 12));
    const scoreEl = document.getElementById('shiftScore');
    if (scoreEl) scoreEl.innerText = accuracy;
  });

  // Clock
  const hEl = document.getElementById('hours');
  const mEl = document.getElementById('minutes');
  const sEl = document.getElementById('seconds');
  const ampmEl = document.getElementById('ampm');
  const dateEl = document.getElementById('dateDisplay');
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;

    if (hEl) hEl.textContent = h < 10 ? '0' + h : h;
    if (mEl) mEl.textContent = m < 10 ? '0' + m : m;
    if (sEl) sEl.textContent = s < 10 ? '0' + s : s;
    if (ampmEl) ampmEl.textContent = ampm;
    if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // App Contents & Window Management
  function getSettingsHTML() {
    return `<h3>ECU MAPPING & DYNAMICS</h3>
      <label>Boost Target (PSI): <span id="boost-val">${window.autoSettings.boost}</span></label>
      <input type="range" id="setting-boost" min="10" max="30" value="${window.autoSettings.boost}"><br>
      <div class="setting-row"><span>Traction Control (TCS)</span><input type="checkbox" id="setting-tcs" ${window.autoSettings.tcs ? 'checked' : ''}></div>
      <div class="setting-row"><span>Launch Control</span><input type="checkbox" id="setting-launch" ${window.autoSettings.launch ? 'checked' : ''}></div>
      <div class="setting-row"><span>Active Exhaust Valves</span><input type="checkbox" id="setting-exhaust" ${window.autoSettings.exhaust ? 'checked' : ''}></div>
      <div class="setting-row"><span>Drift Mode</span><input type="checkbox" id="setting-drift" ${window.autoSettings.drift ? 'checked' : ''}></div>
      <button class="flash-btn" id="flash-ecu-btn">FLASH ECU</button>`;
  }

  const consoleLogs = ["BOOT SEQUENCE OK", "CAN-BUS SYNCED", "OIL PRESSURE NOMINAL", "TURBO SPOOL READY"];
  const appContentData = {
    'Telemetry': '<h3>LIVE DATA</h3><p>RPM: <span style="color:var(--neon-red); font-size:1.5rem;">8450</span></p><p>Boost: 14.2 psi</p><p>Oil Temp: 104°C</p><p>Coolant: 90°C</p><p>Intake Temp: 35°C</p>',
    'Nav System': `<h3>SATELLITE LINK</h3><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.0645226495!2d73.045437!3d18.989401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e8c71cc169b9%3A0x629b350415a77c38!2sPanvel%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1716382000000!5m2!1sen!2sin" width="100%" height="240" style="border:0; border-radius:5px;" allowfullscreen="" loading="lazy"></iframe><p style="text-align:center; color:var(--neon-blue); font-size:0.8rem; margin-top:8px;">GPS LOCKED: PANVEL, MAHARASHTRA</p>`,
    'Media Deck': `<h3>MEDIA & RADIO DECK</h3>
      <iframe style="border-radius:12px; margin-bottom:12px;" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" width="100%" height="160" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      <div class="radio-panel">
        <div class="band-toggle">
          <button class="band-btn ${window.radioState.band === 'FM' ? 'active' : ''}" id="radio-fm-btn">FM BAND</button>
          <button class="band-btn ${window.radioState.band === 'AM' ? 'active' : ''}" id="radio-am-btn">AM BAND</button>
        </div>
        <p style="font-family:Syncopate; font-size:0.75rem; color:var(--neon-amber);" id="radio-display">FREQ: ${window.radioState.frequency} | ${window.radioState.signal}</p>
        <button class="flash-btn" id="radio-tune-btn" style="border-color:var(--neon-amber); color:var(--neon-amber); margin-top:10px;">SEEK FREQUENCY</button>
      </div>`,
    'Garage': `<h3>FILESYSTEM</h3><ul style="max-height: 200px; overflow-y: auto;"><li><span>logs_2026/</span></li><li><span>dyno_runs/</span></li><li class="map-file" data-map="base"><span>map_v1_base.bin (LOAD)</span> <span style="color:#666">2.0 MB</span></li><li class="map-file" data-map="pops"><span>map_v2_pops.bin (LOAD)</span> <span style="color:#666">2.1 MB</span></li><li><span>suspension_track.txt</span> <span style="color:#666">4 KB</span></li><li><span>datalog_13-09-2026.csv</span> <span style="color:#666">14.5 MB</span></li></ul>`,
    'Calendar': `<h3>SCHEDULER / CALENDAR</h3><label>Select Date (Up to 2100):</label><input type="date" id="cal-date" min="2026-01-01" max="2100-12-31" style="width:100%;margin-bottom:10px;box-sizing:border-box;"><div style="display:flex;gap:10px;margin-bottom:10px;"><input type="text" id="rem-text" placeholder="Reminder..." style="flex:1;"><button class="flash-btn" id="add-rem-btn" style="width:auto;padding:5px 15px;">ADD</button></div><ul id="reminder-list" style="max-height:90px;overflow-y:auto;border:1px solid rgba(255,255,255,0.1);padding:5px;"><li><span>2026-09-15: Track day</span></li></ul>`,
    'Console': `<h3>TTY CONSOLE</h3><div id="tty-out" style="font-family:monospace;font-size:0.75rem;height:160px;overflow-y:auto;background:#000;padding:10px;border:1px solid #222;">${consoleLogs.map(l => '> ' + l).join('<br>')}</div><input type="text" id="tty-in" placeholder="type command (help/clear/boost)..." style="width:100%;margin-top:10px;box-sizing:border-box;">`,
    'Diagnostics': `<h3>DIAGNOSTICS & OBD-II</h3><p>BATTERY LOAD: 14.2V NOMINAL</p><p>CAM TIMING: -2.4 DEG</p><p>MAF SENSOR: 38.4 g/s</p><p>MISFIRE COUNTER: 0/4 CYL</p><button class="flash-btn" id="clear-obd-btn">CLEAR DTC CODES</button>`
  };

  let zIndexCounter = 100;
  document.querySelectorAll('.app-icon').forEach(app => {
    app.addEventListener('click', () => {
      const icon = app.querySelector('.icon-shape');
      if (icon) {
        icon.style.transform = "scale(0.9) skewX(10deg)";
        icon.style.borderColor = "#ff1a3d";
        icon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => { icon.style.transform = ""; icon.style.borderColor = ""; icon.style.boxShadow = ""; }, 150);
      }
      const appName = app.getAttribute('data-name');
      if (appName) openAppWindow(appName);
    });
  });

  function openAppWindow(name) {
    const winId = 'win-' + name.replace(/\s/g, '');
    if (document.getElementById(winId)) return;

    const win = document.createElement('div');
    win.className = 'app-window';
    win.id = winId;
    win.style.zIndex = ++zIndexCounter;
    win.style.left = (Math.random() * 100 + 90) + 'px';
    win.style.top = (Math.random() * 60 + 60) + 'px';

    const header = document.createElement('div');
    header.className = 'window-header';
    header.innerHTML = `<span>${name}</span><button class="win-close">X</button>`;

    const body = document.createElement('div');
    body.className = 'window-body';
    body.innerHTML = name === 'Engine Control' ? getSettingsHTML() : (appContentData[name] || '<p>LOADING...</p>');

    win.appendChild(header);
    win.appendChild(body);
    document.body.appendChild(win);

    const closeBtn = header.querySelector('.win-close');
    closeBtn.addEventListener('click', () => win.remove());

    let isDragging = false, startX, startY, initialX, initialY;
    header.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = win.offsetLeft;
      initialY = win.offsetTop;
      win.style.zIndex = ++zIndexCounter;
      document.body.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      win.style.left = (initialX + e.clientX - startX) + 'px';
      win.style.top = (initialY + e.clientY - startY) + 'px';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.classList.remove('is-dragging');
    });

    if (name === 'Console') {
      const ttyIn = body.querySelector('#tty-in');
      const ttyOut = body.querySelector('#tty-out');
      if (ttyIn && ttyOut) {
        ttyIn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            const cmd = ttyIn.value.trim().toLowerCase();
            ttyOut.innerHTML += `<br>> ${ttyIn.value}`;
            if (cmd === 'clear') ttyOut.innerHTML = '';
            else if (cmd === 'boost') ttyOut.innerHTML += `<br>CURRENT BOOST: ${window.autoSettings.boost} PSI`;
            else if (cmd === 'help') ttyOut.innerHTML += `<br>CMDS: clear, boost, help`;
            else ttyOut.innerHTML += `<br>UNKNOWN CMD`;
            ttyIn.value = '';
            ttyOut.scrollTop = ttyOut.scrollHeight;
          }
        });
      }
    }
  }

  document.addEventListener('input', (e) => {
    if (e.target.id === 'setting-boost') {
      window.autoSettings.boost = e.target.value;
      const val = document.getElementById('boost-val');
      if (val) val.innerText = e.target.value;
      const topBarBoost = document.getElementById('topBarBoost');
      if (topBarBoost) topBarBoost.innerText = e.target.value;
    }
  });

  document.addEventListener('change', (e) => {
    if (e.target.id === 'setting-tcs') window.autoSettings.tcs = e.target.checked;
    if (e.target.id === 'setting-launch') window.autoSettings.launch = e.target.checked;
    if (e.target.id === 'setting-exhaust') window.autoSettings.exhaust = e.target.checked;
    if (e.target.id === 'setting-drift') window.autoSettings.drift = e.target.checked;
  });

  document.addEventListener('click', (e) => {
    const mapFile = e.target.closest('.map-file');
    if (mapFile) {
      const type = mapFile.dataset.map;
      if (type === 'base') window.autoSettings = { boost: 14, tcs: true, launch: true, exhaust: false, drift: false };
      else if (type === 'pops') window.autoSettings = { boost: 22, tcs: false, launch: true, exhaust: true, drift: true };
      const topBarBoost = document.getElementById('topBarBoost');
      if (topBarBoost) topBarBoost.innerText = window.autoSettings.boost;
      const settingsBody = document.querySelector('#win-EngineControl .window-body');
      if (settingsBody) {
        settingsBody.innerHTML = getSettingsHTML();
        const win = document.getElementById('win-EngineControl');
        if (win) {
          win.style.boxShadow = "0 0 40px var(--neon-blue)";
          setTimeout(() => { win.style.boxShadow = "0 25px 60px rgba(0,0,0,0.95), inset 0 0 15px rgba(0,240,255,0.15)"; }, 400);
        }
      }
      mapFile.style.color = "var(--neon-red)";
      setTimeout(() => { mapFile.style.color = ""; }, 300);
    }

    if (e.target.id === 'flash-ecu-btn') {
      e.target.innerText = "FLASHING...";
      e.target.style.background = "var(--neon-red)";
      e.target.style.color = "#000";
      setTimeout(() => {
        e.target.innerText = "FLASH ECU";
        e.target.style.background = "transparent";
        e.target.style.color = "var(--neon-red)";
      }, 1000);
    }

    if (e.target.id === 'add-rem-btn') {
      const dateVal = document.getElementById('cal-date').value;
      const textVal = document.getElementById('rem-text').value;
      if (dateVal && textVal) {
        const list = document.getElementById('reminder-list');
        if (list) list.innerHTML += `<li><span>${dateVal}: ${textVal}</span></li>`;
        const remText = document.getElementById('rem-text');
        if (remText) remText.value = '';
      }
    }

    if (e.target.id === 'clear-obd-btn') {
      e.target.innerText = "CLEARING DTC...";
      setTimeout(() => { e.target.innerText = "DTC CLEAR SUCCESS"; }, 800);
    }

    if (e.target.id === 'radio-fm-btn') {
      window.radioState.band = 'FM';
      window.radioState.frequency = '98.3 MHz';
      updateRadioDisplay();
    }
    if (e.target.id === 'radio-am-btn') {
      window.radioState.band = 'AM';
      window.radioState.frequency = '1040 kHz';
      updateRadioDisplay();
    }
    if (e.target.id === 'radio-tune-btn') {
      const pool = window.radioState.band === 'FM' ? ['91.1 MHz', '94.3 MHz', '98.3 MHz', '104.8 MHz'] : ['540 kHz', '810 kHz', '1040 kHz', '1260 kHz'];
      window.radioState.frequency = pool[Math.floor(Math.random() * pool.length)];
      updateRadioDisplay();
    }
  });

  function updateRadioDisplay() {
    const display = document.getElementById('radio-display');
    const hudBand = document.getElementById('hudBand');
    if (display) display.innerText = `FREQ: ${window.radioState.frequency} | ${window.radioState.signal}`;
    if (hudBand) hudBand.innerText = `${window.radioState.band} ${window.radioState.frequency}`;
    const fmBtn = document.getElementById('radio-fm-btn');
    const amBtn = document.getElementById('radio-am-btn');
    if (fmBtn && amBtn) {
      fmBtn.className = `band-btn ${window.radioState.band === 'FM' ? 'active' : ''}`;
      amBtn.className = `band-btn ${window.radioState.band === 'AM' ? 'active' : ''}`;
    }
  }

  // Cursor Tracking Loop
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (cursorDot) { cursorDot.style.left = mx + "px"; cursorDot.style.top = my + "px"; }
  });

  function animCursor() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    if (cursorRing) { cursorRing.style.left = rx + "px"; cursorRing.style.top = ry + "px"; }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  window.addEventListener('mousedown', () => {
    if (cursorRing) { cursorRing.style.width = '24px'; cursorRing.style.height = '24px'; cursorRing.style.borderColor = 'var(--neon-red)'; }
  });

  window.addEventListener('mouseup', () => {
    if (cursorRing) {
      const isHover = cursorRing.classList.contains('hovered');
      cursorRing.style.width = isHover ? '50px' : '36px';
      cursorRing.style.height = isHover ? '50px' : '36px';
      cursorRing.style.borderColor = isHover ? 'var(--neon-red)' : 'var(--neon-blue)';
    }
  });

  document.querySelectorAll('button, .app-icon, .map-file, .band-btn, .g-tab').forEach(btn => {
    btn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    btn.addEventListener('mouseleave', () => {
      if (cursorRing) {
        cursorRing.classList.remove('hovered');
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'var(--neon-blue)';
      }
    });
  });
});