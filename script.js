document.addEventListener('DOMContentLoaded', () => {
  window.autoSettings = { boost: 14, tcs: false, launch: true, exhaust: true, drift: false };
  window.radioState = { band: 'FM', frequency: '98.3 MHz', signal: 'LOCK (5/5)' };

  // UI State tracking
  let highestZ = 100;

  // Boot Sequence
  const needle = document.getElementById('needle');
  const progressBar = document.getElementById('progressBar');
  const bootStatus = document.getElementById('bootStatus');
  const bootScreen = document.getElementById('bootScreen');
  const ignitionScreen = document.getElementById('ignitionScreen');
  const desktopScreen = document.getElementById('desktopScreen');
  const typeWriterElement = document.getElementById('typeWriter');
  const startEngineBtn = document.getElementById('startEngineBtn');

  const bootPhases = ["ECU MAPPING...", "SPOOLING TWIN TURBOS...", "INJECTORS AT 100%...", "LAUNCH CONTROL ACTIVE."];
  let progress = 0, phaseIndex = 0;
  
  const bootInterval = setInterval(() => {
    progress += Math.random() * 8.5;
    const revBase = (progress / 100) * 180;
    const revSpike = Math.random() > 0.5 ? Math.random() * 45 : Math.random() * -12;
    const finalRev = Math.min(180, Math.max(0, revBase + revSpike));
    
    if (needle) needle.style.transform = `rotate(${finalRev}deg)`;
    if (progressBar) progressBar.style.width = Math.min(100, progress) + "%";

    const expectedPhase = Math.floor((progress / 100) * bootPhases.length);
    if (expectedPhase > phaseIndex && expectedPhase < bootPhases.length) {
      phaseIndex = expectedPhase;
      if (bootStatus) {
        bootStatus.innerText = bootPhases[phaseIndex];
        bootStatus.setAttribute('data-text', bootPhases[phaseIndex]); // Update glitch text
      }
    }

    if (progress >= 100) {
      clearInterval(bootInterval);
      if (needle) {
        needle.style.transform = "rotate(185deg)";
        needle.style.boxShadow = "0 0 40px #ff1a3d, 0 0 15px #fff";
      }
      setTimeout(() => {
        if (bootScreen) {
          bootScreen.style.opacity = '0';
          setTimeout(() => {
            bootScreen.style.display = 'none';
            ignitionScreen.classList.remove('hidden');
            typeWriterEffect("SYSTEM ONLINE. NO LAG DETECTED.");
          }, 800);
        }
      }, 700);
    }
  }, 120);

  function typeWriterEffect(text) {
    let i = 0;
    if (typeWriterElement) {
      typeWriterElement.innerHTML = "";
      const typing = setInterval(() => {
        if (i < text.length) {
          typeWriterElement.innerHTML += text.charAt(i++);
        } else {
          clearInterval(typing);
        }
      }, 50);
    }
  }

  // Ignition Button
  if (startEngineBtn) {
    startEngineBtn.addEventListener('click', () => {
      ignitionScreen.style.opacity = '0';
      ignitionScreen.style.transform = 'scale(1.1)';
      setTimeout(() => {
        ignitionScreen.style.display = 'none';
        desktopScreen.classList.remove('hidden');
      }, 800);
    });
  }

  // Arcade Trigger & Close
  const gsTrigger = document.getElementById('gsTrigger');
  const gsDrawer = document.getElementById('gsDrawer');
  const gsClose = document.getElementById('gsClose');
  if (gsTrigger) gsTrigger.addEventListener('click', () => gsDrawer.classList.toggle('hidden'));
  if (gsClose) gsClose.addEventListener('click', () => gsDrawer.classList.add('hidden'));

  // Tab switching
  const gTabs = document.querySelectorAll('.g-tab');
  const gPanels = document.querySelectorAll('.g-panel');
  
  gTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      gTabs.forEach(t => t.classList.remove('active'));
      gPanels.forEach(p => p.classList.add('hidden'));
      
      tab.classList.add('active');
      document.getElementById(tab.dataset.target).classList.remove('hidden');
    });
  });

  // Game 1: Turbo Clicker
  let arcadeScore = 0;
  const highScoreValEl = document.getElementById('highScoreVal');
  let highScore = parseInt(localStorage.getItem('autoOsHighScore')) || 0;
  if (highScoreValEl) highScoreValEl.innerText = highScore;
  
  let timeLeft = 15, timerActive = false, timerInterval = null;
  const timerValEl = document.getElementById('timerVal');
  const arcadeCountEl = document.getElementById('turboCount');
  const revBtn = document.getElementById('revArcadeBtn');

  if (revBtn) {
    revBtn.addEventListener('click', () => {
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
  }

  // Game 2: Launch Reaction Test
  let launchState = 'idle', launchStart = 0;
  const launchBestEl = document.getElementById('launchBest');
  let bestLaunch = localStorage.getItem('autoOsLaunch') || '--';
  if (launchBestEl) launchBestEl.innerText = bestLaunch === '--' ? '-- ms' : bestLaunch + ' ms';

  const launchBtn = document.getElementById('launchBtn');
  const launchLight = document.getElementById('launchLight');

  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      if (launchState === 'idle') {
        launchState = 'waiting';
        launchLight.innerText = 'WAIT FOR GREEN...';
        launchLight.style.color = 'var(--neon-red)';
        setTimeout(() => {
          if (launchState === 'waiting') {
            launchState = 'go';
            launchStart = Date.now();
            launchLight.innerText = 'GO GO GO!';
            launchLight.style.color = 'var(--neon-green)';
          }
        }, Math.random() * 2200 + 1000);
      } else if (launchState === 'waiting') {
        launchState = 'idle';
        launchLight.innerText = 'FALSE START!';
        launchLight.style.color = 'var(--neon-red)';
      } else if (launchState === 'go') {
        const diff = Date.now() - launchStart;
        launchState = 'idle';
        launchLight.innerText = diff + ' ms';
        launchLight.style.color = 'var(--neon-blue)';
        if (bestLaunch === '--' || diff < parseInt(bestLaunch, 10)) {
          bestLaunch = diff;
          localStorage.setItem('autoOsLaunch', bestLaunch);
          if (launchBestEl) launchBestEl.innerText = bestLaunch + ' ms';
        }
      }
    });
  }

  // Game 3: Shift Timing Test
  const shiftTarget = 8800;
  const shiftBtn = document.getElementById('shiftBtn');
  const shiftRpm = document.getElementById('shiftRpm');
  const shiftScore = document.getElementById('shiftScore');

  if (shiftBtn) {
    shiftBtn.addEventListener('click', () => {
      const rpmVal = Math.floor(Math.random() * 2200 + 7400);
      if (shiftRpm) shiftRpm.innerText = rpmVal + ' RPM';
      const accuracy = Math.max(0, Math.round(100 - Math.abs(rpmVal - shiftTarget) / 12));
      if (shiftScore) shiftScore.innerText = accuracy + '%';
    });
  }

  // Clock
  function updateClock() {
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    document.getElementById('hours').textContent = h < 10 ? '0' + h : h;
    document.getElementById('minutes').textContent = m < 10 ? '0' + m : m;
    document.getElementById('seconds').textContent = s < 10 ? '0' + s : s;
    document.getElementById('ampm').textContent = ampm;
    
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    document.getElementById('dateDisplay').textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Desktop Icons
  document.querySelectorAll('.app-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const shape = icon.querySelector('.icon-shape');
      shape.style.transform = "scale(0.9) skewX(10deg)";
      shape.style.borderColor = "#ff1a3d";
      shape.style.boxShadow = "0 0 30px #ff1a3d";
      setTimeout(() => {
        shape.style.transform = ""; 
        shape.style.borderColor = ""; 
        shape.style.boxShadow = "";
      }, 150);
      openAppWindow(icon.dataset.name);
    });
  });

  // App Window Logic
  function openAppWindow(name) {
    const winId = 'win-' + name.replace(/\s/g, '');
    if (document.getElementById(winId)) {
      // Bring to front if already exists
      highestZ++;
      document.getElementById(winId).style.zIndex = highestZ;
      return;
    }

    highestZ++; // Increment Global Z-Index

    const win = document.createElement('div');
    win.className = 'app-window';
    win.id = winId;
    win.style.zIndex = highestZ;
    
    // Spawn near center
    const spawnX = window.innerWidth / 2 - 230 + (Math.random() * 60 - 30);
    const spawnY = window.innerHeight / 2 - 200 + (Math.random() * 60 - 30);
    win.style.left = spawnX + 'px';
    win.style.top = spawnY + 'px';

    // Clicking window brings it to front
    win.addEventListener('mousedown', () => {
      highestZ++;
      win.style.zIndex = highestZ;
    });

    const header = document.createElement('div');
    header.className = 'window-header';
    header.innerHTML = `<span>${name}</span><button class="win-close">X</button>`;

    const body = document.createElement('div');
    body.className = 'window-body';
    
    if (name === 'Engine Control') {
      body.innerHTML = `<h3>ECU MAPPING & DYNAMICS</h3>
        <label>Boost Target (PSI): <span id="boost-val">${window.autoSettings.boost}</span></label>
        <input type="range" id="setting-boost" min="10" max="30" value="${window.autoSettings.boost}"><br>
        <div class="setting-row"><span>Traction Control (TCS)</span><input type="checkbox" id="setting-tcs" ${window.autoSettings.tcs ? 'checked' : ''}></div>
        <div class="setting-row"><span>Launch Control</span><input type="checkbox" id="setting-launch" ${window.autoSettings.launch ? 'checked' : ''}></div>
        <div class="setting-row"><span>Active Exhaust Valves</span><input type="checkbox" id="setting-exhaust" ${window.autoSettings.exhaust ? 'checked' : ''}></div>
        <div class="setting-row"><span>Drift Mode</span><input type="checkbox" id="setting-drift" ${window.autoSettings.drift ? 'checked' : ''}></div>
        <button class="flash-btn" id="flash-ecu-btn">FLASH ECU</button>`;
    } else if (name === 'Telemetry') {
      body.innerHTML = '<h3>LIVE DATA</h3><p>RPM: <span style="color:var(--neon-red); font-size:1.6rem; font-family:Syncopate;">8450</span></p><p>Boost: 14.2 psi</p><p>Oil Temp: 104°C</p><p>Coolant: 90°C</p><p>Intake Temp: 35°C</p>';
    } else if (name === 'Nav System') {
      body.innerHTML = `<h3>SATELLITE LINK</h3><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.0645226495!2d73.045437!3d18.989401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e8c71cc169b9%3A0x629b350415a77c38!2sPanvel%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1716382000000!5m2!1sen!2sin" width="100%" height="260" style="border:0; border-radius:6px; box-shadow: 0 0 15px rgba(0,0,0,0.8);" allowfullscreen="" loading="lazy"></iframe><p style="text-align:center; color:var(--neon-blue); font-size:0.85rem; margin-top:12px; font-family:Syncopate;">GPS LOCKED: PANVEL, MH</p>`;
    } else if (name === 'Media Deck') {
      body.innerHTML = `<h3>MEDIA & RADIO DECK</h3>
        <iframe style="border-radius:12px; margin-bottom:15px; box-shadow: 0 0 15px rgba(0,0,0,0.8);" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" width="100%" height="160" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        <div class="radio-panel">
          <div class="band-toggle">
            <button class="band-btn ${window.radioState.band === 'FM' ? 'active' : ''}" id="radio-fm-btn">FM BAND</button>
            <button class="band-btn ${window.radioState.band === 'AM' ? 'active' : ''}" id="radio-am-btn">AM BAND</button>
          </div>
          <p style="font-family:Syncopate; font-size:0.8rem; color:var(--neon-amber); text-align:center;" id="radio-display">FREQ: ${window.radioState.frequency} | ${window.radioState.signal}</p>
          <button class="flash-btn" id="radio-tune-btn" style="border-color:var(--neon-amber); color:var(--neon-amber); margin-top:15px;">SEEK FREQUENCY</button>
        </div>`;
    } else if (name === 'Garage') {
      body.innerHTML = `<h3>FILESYSTEM</h3><ul style="max-height: 250px; overflow-y: auto;"><li><span>logs_2026/</span></li><li><span>dyno_runs/</span></li><li class="map-file" data-map="base"><span>map_v1_base.bin (LOAD)</span> <span style="color:#666">2.0 MB</span></li><li class="map-file" data-map="pops"><span>map_v2_pops.bin (LOAD)</span> <span style="color:#666">2.1 MB</span></li><li><span>suspension_track.txt</span> <span style="color:#666">4 KB</span></li><li><span>datalog_13-09-2026.csv</span> <span style="color:#666">14.5 MB</span></li></ul>`;
    } else if (name === 'Calendar') {
      body.innerHTML = `<h3>SCHEDULER</h3><label>Select Date:</label><input type="date" id="cal-date" min="2026-01-01" max="2100-12-31" style="width:100%;margin-bottom:12px;"><div style="display:flex;gap:10px;margin-bottom:15px;"><input type="text" id="rem-text" placeholder="Reminder text..." style="flex:1;"><button class="flash-btn" id="add-rem-btn" style="width:auto;margin:0;padding:0 20px;">ADD</button></div><ul id="reminder-list" style="max-height:120px;overflow-y:auto;border:1px solid rgba(255,255,255,0.1);padding:8px; border-radius:4px;"><li><span>2026-09-15: Track day</span></li></ul>`;
    } else if (name === 'Console') {
      body.innerHTML = `<h3>TTY CONSOLE</h3><div id="tty-out" style="font-family:monospace;font-size:0.85rem;height:180px;overflow-y:auto;background:rgba(0,0,0,0.8);padding:15px;border:1px solid rgba(255,255,255,0.2); border-radius:4px;">BOOT SEQUENCE OK<br>CAN-BUS SYNCED<br>OIL PRESSURE NOMINAL<br>TURBO SPOOL READY</div><input type="text" id="tty-in" placeholder="type command (help/clear/boost)..." style="width:100%;margin-top:15px;">`;
    } else {
      body.innerHTML = '<h3>DIAGNOSTICS</h3><p style="color:var(--neon-green); font-family:Syncopate;">ALL SYSTEMS NOMINAL.</p>';
    }

    win.appendChild(header);
    win.appendChild(body);
    document.body.appendChild(win);

    // --- Dynamic Event Listeners ---

    if (name === 'Engine Control') {
      win.querySelector('#setting-boost').addEventListener('input', (e) => {
        window.autoSettings.boost = e.target.value;
        win.querySelector('#boost-val').innerText = e.target.value;
        document.getElementById('topBarBoost').innerText = e.target.value;
      });
      win.querySelector('#setting-tcs').addEventListener('change', e => window.autoSettings.tcs = e.target.checked);
      win.querySelector('#setting-launch').addEventListener('change', e => window.autoSettings.launch = e.target.checked);
      win.querySelector('#setting-exhaust').addEventListener('change', e => window.autoSettings.exhaust = e.target.checked);
      win.querySelector('#setting-drift').addEventListener('change', e => window.autoSettings.drift = e.target.checked);
      
      win.querySelector('#flash-ecu-btn').addEventListener('click', (e) => {
        e.target.innerText = "FLASHING...";
        e.target.style.background = "var(--neon-red)";
        e.target.style.color = "#000";
        setTimeout(() => {
          e.target.innerText = "FLASH ECU";
          e.target.style.background = "transparent";
          e.target.style.color = "var(--neon-red)";
        }, 1000);
      });
    }

    if (name === 'Calendar') {
      win.querySelector('#add-rem-btn').addEventListener('click', () => {
        const dateVal = win.querySelector('#cal-date').value;
        const textVal = win.querySelector('#rem-text').value;
        if (dateVal && textVal) {
          win.querySelector('#reminder-list').innerHTML += `<li><span>${dateVal}: ${textVal}</span></li>`;
          win.querySelector('#rem-text').value = '';
        }
      });
    }

    if (name === 'Media Deck') {
      const updateRadio = () => {
        win.querySelector('#radio-display').innerText = `FREQ: ${window.radioState.frequency} | ${window.radioState.signal}`;
        document.getElementById('hudBand').innerText = `${window.radioState.band} ${window.radioState.frequency}`;
        win.querySelector('#radio-fm-btn').className = `band-btn ${window.radioState.band === 'FM' ? 'active' : ''}`;
        win.querySelector('#radio-am-btn').className = `band-btn ${window.radioState.band === 'AM' ? 'active' : ''}`;
      };

      win.querySelector('#radio-fm-btn').addEventListener('click', () => {
        window.radioState.band = 'FM';
        window.radioState.frequency = '98.3 MHz';
        updateRadio();
      });
      win.querySelector('#radio-am-btn').addEventListener('click', () => {
        window.radioState.band = 'AM';
        window.radioState.frequency = '1040 kHz';
        updateRadio();
      });
      win.querySelector('#radio-tune-btn').addEventListener('click', () => {
        const pool = window.radioState.band === 'FM' ? ['91.1 MHz', '94.3 MHz', '98.3 MHz', '104.8 MHz'] : ['540 kHz', '810 kHz', '1040 kHz', '1260 kHz'];
        window.radioState.frequency = pool[Math.floor(Math.random() * pool.length)];
        updateRadio();
      });
    }

    if (name === 'Console') {
      const ttyIn = win.querySelector('#tty-in');
      const ttyOut = win.querySelector('#tty-out');
      ttyIn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = ttyIn.value.trim().toLowerCase();
          ttyOut.innerHTML += `<br>> <span style="color:var(--neon-green)">${ttyIn.value}</span>`;
          if (cmd === 'clear') ttyOut.innerHTML = '';
          else if (cmd === 'boost') ttyOut.innerHTML += `<br>CURRENT BOOST: ${window.autoSettings.boost} PSI`;
          else if (cmd === 'help') ttyOut.innerHTML += `<br>CMDS: clear, boost, help`;
          else ttyOut.innerHTML += `<br>UNKNOWN CMD`;
          ttyIn.value = '';
          ttyOut.scrollTop = ttyOut.scrollHeight;
        }
      });
    }

    // Window Dragging Logic (With Iframe pointer-events fix)
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
      
      // Add dragging class to body to disable iframe pointer events globally while dragging
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
  }

  // Cursor Tracking Loop
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mx + "px";
      cursorDot.style.top = my + "px";
    }
  });

  function animCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (cursorRing) {
      cursorRing.style.left = rx + "px";
      cursorRing.style.top = ry + "px";
    }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // Global hover state delegation 
  document.body.addEventListener('mouseover', (e) => {
    if (e.target.matches('button, .g-tab, .app-icon, input, .win-close, .map-file')) {
      if (cursorRing) cursorRing.classList.add('hovered');
    }
  });
  
  document.body.addEventListener('mouseout', (e) => {
    if (e.target.matches('button, .g-tab, .app-icon, input, .win-close, .map-file')) {
      if (cursorRing) cursorRing.classList.remove('hovered');
    }
  });
});