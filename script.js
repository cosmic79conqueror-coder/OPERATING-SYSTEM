document.addEventListener('DOMContentLoaded', () => {
  window.autoSettings = { boost: 14, tcs: false, launch: true, exhaust: true, drift: false };
  window.radioState = { band: 'FM', frequency: '98.3 MHz', signal: 'LOCK (5/5)' };

  // Boot Sequence
  const needle = document.getElementById('needle');
  const progressBar = document.getElementById('progressBar');
  const bootStatus = document.getElementById('bootStatus');
  const bootScreen = document.getElementById('bootScreen');
  const ignitionScreen = document.getElementById('ignitionScreen');
  const desktopScreen = document.getElementById('desktopScreen');
  const typeWriterElement = document.getElementById('typeWriter');
  const startEngineBtn = document.getElementById('startEngineBtn');

  // Boot Phase elements
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
      if (bootStatus) bootStatus.innerText = bootPhases[phaseIndex];
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
            if (bootScreen) {
              bootScreen.style.display = 'none';
              ignitionScreen.classList.remove('hidden');
              typeWriterEffect("WITHOUT ANY FURTHER TURBOLAG");
            }
          }, 800);
        }
      }, 700);
    }
  }, 140);

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
      }, 65);
    }
  }

  // Start Engine button
  if (startEngineBtn) {
    startEngineBtn.addEventListener('click', () => {
      ignitionScreen.style.opacity = '0';
      ignitionScreen.style.transform = 'scale(1.08)';
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

  // Tab switching - individual tabs
  const gTurboTab = document.querySelector('.g-tab[data-target="g-turbo"]');
  const gLaunchTab = document.querySelector('.g-tab[data-target="g-launch"]');
  const gShiftTab = document.querySelector('.g-tab[data-target="g-shift"]');
  const gTurboPanel = document.getElementById('g-turbo');
  const gLaunchPanel = document.getElementById('g-launch');
  const gShiftPanel = document.getElementById('g-shift');

  if (gTurboTab) {
    gTurboTab.addEventListener('click', () => {
      if (gTurboTab.classList.contains('active')) return;
      gTurboTab.classList.add('active');
      gLaunchTab.classList.remove('active');
      gShiftTab.classList.remove('active');
      gTurboPanel.classList.remove('hidden');
      gLaunchPanel.classList.add('hidden');
      gShiftPanel.classList.add('hidden');
    });
  }
  if (gLaunchTab) {
    gLaunchTab.addEventListener('click', () => {
      if (gLaunchTab.classList.contains('active')) return;
      gLaunchTab.classList.add('active');
      gTurboTab.classList.remove('active');
      gShiftTab.classList.remove('active');
      gLaunchPanel.classList.remove('hidden');
      gTurboPanel.classList.add('hidden');
      gShiftPanel.classList.add('hidden');
    });
  }
  if (gShiftTab) {
    gShiftTab.addEventListener('click', () => {
      if (gShiftTab.classList.contains('active')) return;
      gShiftTab.classList.add('active');
      gTurboTab.classList.remove('active');
      gLaunchTab.classList.remove('active');
      gShiftPanel.classList.remove('hidden');
      gTurboPanel.classList.add('hidden');
      gLaunchPanel.classList.add('hidden');
    });
  }

  // Game 1: Turbo Clicker
  let arcadeScore = 0;
  const highScoreValEl = document.getElementById('highScoreVal');
  let highScore = 0;
  const storedHighScore = localStorage.getItem('autoOsHighScore');
  if (storedHighScore) {
    highScore = parseInt(storedHighScore, 10);
    if (highScoreValEl) highScoreValEl.innerText = highScore;
  }
  let timeLeft = 15, timerActive = false;
  let timerInterval = null;
  const timerValEl = document.getElementById('timerVal');
  const arcadeCountEl = document.getElementById('turboCount');
  const revBtn = document.getElementById('revArcadeBtn');

  if (timerValEl) timerValEl.innerText = '15s';
  if (arcadeCountEl) arcadeCountEl.innerText = '0 RPM';

  if (revBtn) {
    revBtn.addEventListener('click', () => {
      if (!timerActive) {
        timerActive = true;
        arcadeScore = 0;
        timeLeft = 15;
        if (timerValEl) timerValEl.innerText = timeLeft + 's';
        if (arcadeCountEl) arcadeCountEl.innerText = "0 RPM";
        if (revBtn) revBtn.innerText = "JAM THROTTLE";

        timerInterval = setInterval(() => {
          timeLeft--;
          if (timerValEl) timerValEl.innerText = timeLeft + 's';
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerActive = false;
            if (revBtn) revBtn.innerText = "RESTART RUN";
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
  let launchState = 'idle';
  let launchStart = 0;
  const launchBestEl = document.getElementById('launchBest');
  let bestLaunch = '--';
  const storedLaunch = localStorage.getItem('autoOsLaunch');
  if (storedLaunch) {
    bestLaunch = storedLaunch;
    if (launchBestEl) launchBestEl.innerText = bestLaunch === '--' ? '-- ms' : bestLaunch + ' ms';
  }

  const launchBtn = document.getElementById('launchBtn');
  const launchLight = document.getElementById('launchLight');

  if (launchBtn) {
    launchBtn.addEventListener('click', () => {
      if (launchState === 'idle') {
        launchState = 'waiting';
        if (launchLight) {
          launchLight.innerText = 'WAIT FOR GREEN...';
          launchLight.style.color = 'var(--neon-red)';
        }
        setTimeout(() => {
          if (launchState === 'waiting') {
            launchState = 'go';
            launchStart = Date.now();
            if (launchLight) {
              launchLight.innerText = 'GO GO GO!';
              launchLight.style.color = 'var(--neon-green)';
            }
          }
        }, Math.random() * 2200 + 1000);
      } else if (launchState === 'waiting') {
        launchState = 'idle';
        if (launchLight) {
          launchLight.innerText = 'FALSE START!';
          launchLight.style.color = 'var(--neon-red)';
        }
      } else if (launchState === 'go') {
        const diff = Date.now() - launchStart;
        launchState = 'idle';
        if (launchLight) {
          launchLight.innerText = diff + ' ms';
          launchLight.style.color = 'var(--neon-blue)';
        }
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
      if (shiftScore) shiftScore.innerText = accuracy;
    });
  }

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
  const clockInterval = setInterval(updateClock, 1000);

  // App Icons - individual handlers
  const engineIcon = document.querySelector('.app-icon[data-name="Engine Control"]');
  const telemetryIcon = document.querySelector('.app-icon[data-name="Telemetry"]');
  const navIcon = document.querySelector('.app-icon[data-name="Nav System"]');
  const mediaIcon = document.querySelector('.app-icon[data-name="Media Deck"]');
  const garageIcon = document.querySelector('.app-icon[data-name="Garage"]');
  const calendarIcon = document.querySelector('.app-icon[data-name="Calendar"]');
  const consoleIcon = document.querySelector('.app-icon[data-name="Console"]');
  const diagnosticsIcon = document.querySelector('.app-icon[data-name="Diagnostics"]');

  // Engine Control
  if (engineIcon) {
    engineIcon.addEventListener('click', () => {
      const eIcon = engineIcon.querySelector('.icon-shape');
      if (eIcon) {
        eIcon.style.transform = "scale(0.9) skewX(10deg)";
        eIcon.style.borderColor = "#ff1a3d";
        eIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (eIcon) { eIcon.style.transform = ""; eIcon.style.borderColor = ""; eIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Engine Control');
    });
  }

  // Telemetry
  if (telemetryIcon) {
    telemetryIcon.addEventListener('click', () => {
      const tIcon = telemetryIcon.querySelector('.icon-shape');
      if (tIcon) {
        tIcon.style.transform = "scale(0.9) skewX(10deg)";
        tIcon.style.borderColor = "#ff1a3d";
        tIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (tIcon) { tIcon.style.transform = ""; tIcon.style.borderColor = ""; tIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Telemetry');
    });
  }

  // Nav System
  if (navIcon) {
    navIcon.addEventListener('click', () => {
      const nIcon = navIcon.querySelector('.icon-shape');
      if (nIcon) {
        nIcon.style.transform = "scale(0.9) skewX(10deg)";
        nIcon.style.borderColor = "#ff1a3d";
        nIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (nIcon) { nIcon.style.transform = ""; nIcon.style.borderColor = ""; nIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Nav System');
    });
  }

  // Media Deck
  if (mediaIcon) {
    mediaIcon.addEventListener('click', () => {
      const mIcon = mediaIcon.querySelector('.icon-shape');
      if (mIcon) {
        mIcon.style.transform = "scale(0.9) skewX(10deg)";
        mIcon.style.borderColor = "#ff1a3d";
        mIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (mIcon) { mIcon.style.transform = ""; mIcon.style.borderColor = ""; mIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Media Deck');
    });
  }

  // Garage
  if (garageIcon) {
    garageIcon.addEventListener('click', () => {
      const gIcon = garageIcon.querySelector('.icon-shape');
      if (gIcon) {
        gIcon.style.transform = "scale(0.9) skewX(10deg)";
        gIcon.style.borderColor = "#ff1a3d";
        gIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (gIcon) { gIcon.style.transform = ""; gIcon.style.borderColor = ""; gIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Garage');
    });
  }

  // Calendar
  if (calendarIcon) {
    calendarIcon.addEventListener('click', () => {
      const calIcon = calendarIcon.querySelector('.icon-shape');
      if (calIcon) {
        calIcon.style.transform = "scale(0.9) skewX(10deg)";
        calIcon.style.borderColor = "#ff1a3d";
        calIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (calIcon) { calIcon.style.transform = ""; calIcon.style.borderColor = ""; calIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Calendar');
    });
  }

  // Console
  if (consoleIcon) {
    consoleIcon.addEventListener('click', () => {
      const cIcon = consoleIcon.querySelector('.icon-shape');
      if (cIcon) {
        cIcon.style.transform = "scale(0.9) skewX(10deg)";
        cIcon.style.borderColor = "#ff1a3d";
        cIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (cIcon) { cIcon.style.transform = ""; cIcon.style.borderColor = ""; cIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Console');
    });
  }

  // Diagnostics
  if (diagnosticsIcon) {
    diagnosticsIcon.addEventListener('click', () => {
      const dIcon = diagnosticsIcon.querySelector('.icon-shape');
      if (dIcon) {
        dIcon.style.transform = "scale(0.9) skewX(10deg)";
        dIcon.style.borderColor = "#ff1a3d";
        dIcon.style.boxShadow = "0 0 30px #ff1a3d";
        setTimeout(() => {
          if (dIcon) { dIcon.style.transform = ""; dIcon.style.borderColor = ""; dIcon.style.boxShadow = ""; }
        }, 150);
      }
      openAppWindow('Diagnostics');
    });
  }

  function openAppWindow(name) {
    const winId = 'win-' + name.replace(/\s/g, '');
    const winExist = document.getElementById(winId);
    if (winExist) return;

    const win = document.createElement('div');
    win.className = 'app-window';
    win.id = winId;
    win.style.zIndex = 100 + Math.floor(Math.random() * 200);
    win.style.left = (Math.random() * 100 + 90) + 'px';
    win.style.top = (Math.random() * 60 + 60) + 'px';

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
      body.innerHTML = '<h3>LIVE DATA</h3><p>RPM: <span style="color:var(--neon-red); font-size:1.5rem;">8450</span></p><p>Boost: 14.2 psi</p><p>Oil Temp: 104°C</p><p>Coolant: 90°C</p><p>Intake Temp: 35°C</p>';
    } else if (name === 'Nav System') {
      body.innerHTML = `<h3>SATELLITE LINK</h3><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120638.0645226495!2d73.045437!3d18.989401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e8c71cc169b9%3A0x629b350415a77c38!2sPanvel%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1716382000000!5m2!1sen!2sin" width="100%" height="240" style="border:0; border-radius:5px;" allowfullscreen="" loading="lazy"></iframe><p style="text-align:center; color:var(--neon-blue); font-size:0.8rem; margin-top:8px;">GPS LOCKED: PANVEL, MAHARASHTRA</p>`;
    } else if (name === 'Media Deck') {
      body.innerHTML = `<h3>MEDIA & RADIO DECK</h3>
        <iframe style="border-radius:12px; margin-bottom:12px;" src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" width="100%" height="160" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        <div class="radio-panel">
          <div class="band-toggle">
            <button class="band-btn ${window.radioState.band === 'FM' ? 'active' : ''}" id="radio-fm-btn">FM BAND</button>
            <button class="band-btn ${window.radioState.band === 'AM' ? 'active' : ''}" id="radio-am-btn">AM BAND</button>
          </div>
          <p style="font-family:Syncopate; font-size:0.75rem; color:var(--neon-amber);" id="radio-display">FREQ: ${window.radioState.frequency} | ${window.radioState.signal}</p>
          <button class="flash-btn" id="radio-tune-btn" style="border-color:var(--neon-amber); color:var(--neon-amber); margin-top:10px;">SEEK FREQUENCY</button>
        </div>`;
    } else if (name === 'Garage') {
      body.innerHTML = `<h3>FILESYSTEM</h3><ul style="max-height: 200px; overflow-y: auto;"><li><span>logs_2026/</span></li><li><span>dyno_runs/</span></li><li class="map-file" data-map="base"><span>map_v1_base.bin (LOAD)</span> <span style="color:#666">2.0 MB</span></li><li class="map-file" data-map="pops"><span>map_v2_pops.bin (LOAD)</span> <span style="color:#666">2.1 MB</span></li><li><span>suspension_track.txt</span> <span style="color:#666">4 KB</span></li><li><span>datalog_13-09-2026.csv</span> <span style="color:#666">14.5 MB</span></li></ul>`;
    } else if (name === 'Calendar') {
      body.innerHTML = `<h3>SCHEDULER / CALENDAR</h3><label>Select Date (Up to 2100):</label><input type="date" id="cal-date" min="2026-01-01" max="2100-12-31" style="width:100%;margin-bottom:10px;box-sizing:border-box;"><div style="display:flex;gap:10px;margin-bottom:10px;"><input type="text" id="rem-text" placeholder="Reminder..." style="flex:1;"><button class="flash-btn" id="add-rem-btn" style="width:auto;padding:5px 15px;">ADD</button></div><ul id="reminder-list" style="max-height:90px;overflow-y:auto;border:1px solid rgba(255,255,255,0.1);padding:5px;"><li><span>2026-09-15: Track day</span></li></ul>`;
    } else if (name === 'Console') {
      body.innerHTML = `<h3>TTY CONSOLE</h3><div id="tty-out" style="font-family:monospace;font-size:0.75rem;height:160px;overflow-y:auto;background:#000;padding:10px;border:1px solid #222;">BOOT SEQUENCE OK<br>CAN-BUS SYNCED<br>OIL PRESSURE NOMINAL<br>TURBO SPOOL READY</div><input type="text" id="tty-in" placeholder="type command (help/clear/boost)..." style="width:100%;margin-top:10px;box-sizing:border-box;">`;
    } else {
      body.innerHTML = '<p>LOADING...</p>';
    }

    win.appendChild(header);
    win.appendChild(body);
    document.body.appendChild(win);

    // Close button
    const closeBtn = header.querySelector('.win-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => win.remove());
    }

    // Window dragging
    let isDragging = false, startX, startY, initialX, initialY;
    header.addEventListener('mousedown', (e) => {
      if (e.target === closeBtn) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = win.offsetLeft;
      initialY = win.offsetTop;
      win.style.zIndex = 200 + Math.floor(Math.random() * 100);
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

    // Console TTY input
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

  // Boost setting input
  const boostInput = document.getElementById('setting-boost');
  const boostVal = document.getElementById('boost-val');
  const topBarBoost = document.getElementById('topBarBoost');
  if (boostInput) {
    boostInput.addEventListener('input', () => {
      window.autoSettings.boost = boostInput.value;
      if (boostVal) boostVal.innerText = boostInput.value;
      if (topBarBoost) topBarBoost.innerText = boostInput.value;
    });
  }

  // Setting change events - individual
  const tcsInput = document.getElementById('setting-tcs');
  const launchInput = document.getElementById('setting-launch');
  const exhaustInput = document.getElementById('setting-exhaust');
  const driftInput = document.getElementById('setting-drift');

  if (tcsInput) {
    tcsInput.addEventListener('change', () => {
      window.autoSettings.tcs = tcsInput.checked;
    });
  }
  if (launchInput) {
    launchInput.addEventListener('change', () => {
      window.autoSettings.launch = launchInput.checked;
    });
  }
  if (exhaustInput) {
    exhaustInput.addEventListener('change', () => {
      window.autoSettings.exhaust = exhaustInput.checked;
    });
  }
  if (driftInput) {
    driftInput.addEventListener('change', () => {
      window.autoSettings.drift = driftInput.checked;
    });
  }

  // Click events - individual elements
  const flashEcuBtn = document.getElementById('flash-ecu-btn');
  if (flashEcuBtn) {
    flashEcuBtn.addEventListener('click', (e) => {
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

  const addRemBtn = document.getElementById('add-rem-btn');
  if (addRemBtn) {
    addRemBtn.addEventListener('click', () => {
      const dateVal = document.getElementById('cal-date').value;
      const textVal = document.getElementById('rem-text').value;
      if (dateVal && textVal) {
        const list = document.getElementById('reminder-list');
        if (list) list.innerHTML += `<li><span>${dateVal}: ${textVal}</span></li>`;
      }
      const remText = document.getElementById('rem-text');
      if (remText) remText.value = '';
    });
  }

  const clearObdBtn = document.getElementById('clear-obd-btn');
  if (clearObdBtn) {
    clearObdBtn.addEventListener('click', () => {
      clearObdBtn.innerText = "CLEARING DTC...";
      setTimeout(() => { clearObdBtn.innerText = "DTC CLEAR SUCCESS"; }, 800);
    });
  }

  const radioFmBtn = document.getElementById('radio-fm-btn');
  const radioAmBtn = document.getElementById('radio-am-btn');
  const radioTuneBtn = document.getElementById('radio-tune-btn');
  const radioDisplay = document.getElementById('radio-display');
  const hudBand = document.getElementById('hudBand');

  if (radioFmBtn) {
    radioFmBtn.addEventListener('click', () => {
      window.radioState.band = 'FM';
      window.radioState.frequency = '98.3 MHz';
      if (updateRadioDisplay) updateRadioDisplay();
    });
  }
  if (radioAmBtn) {
    radioAmBtn.addEventListener('click', () => {
      window.radioState.band = 'AM';
      window.radioState.frequency = '1040 kHz';
      if (updateRadioDisplay) updateRadioDisplay();
    });
  }
  if (radioTuneBtn) {
    radioTuneBtn.addEventListener('click', () => {
      const pool = window.radioState.band === 'FM' ? ['91.1 MHz', '94.3 MHz', '98.3 MHz', '104.8 MHz'] : ['540 kHz', '810 kHz', '1040 kHz', '1260 kHz'];
      window.radioState.frequency = pool[Math.floor(Math.random() * pool.length)];
      if (updateRadioDisplay) updateRadioDisplay();
    });
  }

  function updateRadioDisplay() {
    if (radioDisplay) radioDisplay.innerText = `FREQ: ${window.radioState.frequency} | ${window.radioState.signal}`;
    if (hudBand) hudBand.innerText = `${window.radioState.band} ${window.radioState.frequency}`;
    if (radioFmBtn) {
      radioFmBtn.className = `band-btn ${window.radioState.band === 'FM' ? 'active' : ''}`;
      radioAmBtn.className = `band-btn ${window.radioState.band === 'AM' ? 'active' : ''}`;
    }
  }

  // Cursor tracking
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
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    if (cursorRing) {
      cursorRing.style.left = rx + "px";
      cursorRing.style.top = ry + "px";
    }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  window.addEventListener('mousedown', () => {
    if (cursorRing) {
      cursorRing.style.width = '24px';
      cursorRing.style.height = '24px';
      cursorRing.style.borderColor = 'var(--neon-red)';
    }
  });

  window.addEventListener('mouseup', () => {
    if (cursorRing) {
      const isHover = cursorRing.classList.contains('hovered');
      cursorRing.style.width = isHover ? '50px' : '36px';
      cursorRing.style.height = isHover ? '50px' : '36px';
      cursorRing.style.borderColor = isHover ? 'var(--neon-red)' : 'var(--neon-blue)';
    }
  });

  // Button hover states - individual handlers (human-written style)
  const gTurbo = document.querySelector('.g-tab[data-target="g-turbo"]');
  const gLaunch = document.querySelector('.g-tab[data-target="g-launch"]');
  const gShift = document.querySelector('.g-tab[data-target="g-shift"]');
  const revArcadeBtn = document.getElementById('revArcadeBtn');
  const launchBtn = document.getElementById('launchBtn');
  const shiftBtn = document.getElementById('shiftBtn');
  const flashEcuBtn = document.getElementById('flash-ecu-btn');
  const addRemBtn = document.getElementById('add-rem-btn');
  const clearObdBtn = document.getElementById('clear-obd-btn');
  const radioFmBtn = document.getElementById('radio-fm-btn');
  const radioAmBtn = document.getElementById('radio-am-btn');
  const radioTuneBtn = document.getElementById('radio-tune-btn');
  const bandBtns = document.querySelectorAll('.band-btn'); // needed for class toggling

  // Turbo tab hover
  if (gTurbo) {
    gTurbo.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    gTurbo.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Launch tab hover
  if (gLaunch) {
    gLaunch.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    gLaunch.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Shift tab hover
  if (gShift) {
    gShift.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    gShift.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Arcade button hover
  if (revArcadeBtn) {
    revArcadeBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    revArcadeBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Launch button hover
  if (launchBtn) {
    launchBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    launchBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Shift button hover
  if (shiftBtn) {
    shiftBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    shiftBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Flash ECU button hover
  if (flashEcuBtn) {
    flashEcuBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    flashEcuBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Add reminder button hover
  if (addRemBtn) {
    addRemBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    addRemBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Clear DTC button hover
  if (clearObdBtn) {
    clearObdBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    clearObdBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Radio FM button hover
  if (radioFmBtn) {
    radioFmBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    radioFmBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Radio AM button hover
  if (radioAmBtn) {
    radioAmBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    radioAmBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
  // Radio tune button hover
  if (radioTuneBtn) {
    radioTuneBtn.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.classList.add('hovered'); });
    radioTuneBtn.addEventListener('mouseleave', () => { if (cursorRing) { cursorRing.classList.remove('hovered'); cursorRing.style.width = '36px'; cursorRing.style.height = '36px'; cursorRing.style.borderColor = 'var(--neon-blue)'; } });
  }
});