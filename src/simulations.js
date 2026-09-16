// Interactive Physics Visualizations for Semiconductor Masterclass

export function initSimulation(containerId, type) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  container.innerHTML = ''; // clean slate

  switch (type) {
    case 'drift-sim':
      return createDriftSimulator(container);
    case 'hall-effect-sim':
      return createHallEffectSimulator(container);
    case 'ek-diagram':
      return createEkDiagram(container);
    case 'fermi-dirac-plot':
      return createFermiDiracPlot(container);
    case 'poisson-pn-junction':
      return createPoissonPlot(container);
    case 'recombination-types':
      return createRecombinationVisualizer(container);
    case 'doping-visualizer':
      return createDopingVisualizer(container);
    case 'mobility-temp-plot':
      return createMobilityVisualizer(container);
    case 'charge-neutrality-sim':
      return createChargeNeutralitySim(container);
    default:
      return null;
  }
}

// -------------------------------------------------------------
// 1. CARRIER DRIFT SIMULATOR (Slide 11)
// -------------------------------------------------------------
function createDriftSimulator(container) {
  container.innerHTML = `
    <div class="sim-card">
      <div class="sim-header">
        <span class="sim-badge">LIVE TRANSPORT ENGINE</span>
        <span class="sim-title">Interactive Carrier Drift under Electric Field (E)</span>
      </div>
      <canvas class="sim-canvas" width="560" height="240"></canvas>
      <div class="sim-controls">
        <div class="sim-control-group">
          <label>Electric Field $\\mathcal{E}$ (V/cm): <span id="efield-val" class="text-cyan">0</span></label>
          <input type="range" id="efield-slider" min="-800" max="800" value="0" step="50" class="cyber-slider">
        </div>
        <div class="sim-stats-row">
          <div class="stat-pill"><span class="stat-label">v_d (electrons):</span> <span id="vd-elec" class="stat-val">0 cm/s</span></div>
          <div class="stat-pill"><span class="stat-label">v_d (holes):</span> <span id="vd-hole" class="stat-val">0 cm/s</span></div>
          <div class="stat-pill"><span class="stat-label">Net Current J:</span> <span id="j-net" class="stat-val">0 A/cm²</span></div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const slider = container.querySelector('#efield-slider');
  const eVal = container.querySelector('#efield-val');
  const vdElecEl = container.querySelector('#vd-elec');
  const vdHoleEl = container.querySelector('#vd-hole');
  const jNetEl = container.querySelector('#j-net');

  let eField = 0;
  slider.addEventListener('input', (e) => {
    eField = parseFloat(e.target.value);
    eVal.textContent = eField > 0 ? `+${eField}` : `${eField}`;
  });

  // Particle population
  const numElectrons = 35;
  const numHoles = 25;
  const particles = [];

  for (let i = 0; i < numElectrons; i++) {
    particles.push({
      type: 'electron',
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      charge: -1,
      color: '#00f2fe'
    });
  }

  for (let i = 0; i < numHoles; i++) {
    particles.push({
      type: 'hole',
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      charge: +1,
      color: '#ffaa33'
    });
  }

  let animId;
  function render() {
    ctx.fillStyle = 'rgba(7, 13, 27, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background crystal atomic grid (scattering centers)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let gx = 30; gx < canvas.width; gx += 40) {
      for (let gy = 25; gy < canvas.height; gy += 40) {
        ctx.beginPath();
        ctx.arc(gx, gy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw field indicator arrows
    if (Math.abs(eField) > 20) {
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 1.5;
      const arrowDir = eField > 0 ? 1 : -1;
      for (let y = 30; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 40 * arrowDir, y);
        ctx.lineTo(canvas.width / 2 + 40 * arrowDir, y);
        ctx.lineTo(canvas.width / 2 + 30 * arrowDir, y - 5);
        ctx.moveTo(canvas.width / 2 + 40 * arrowDir, y);
        ctx.lineTo(canvas.width / 2 + 30 * arrowDir, y + 5);
        ctx.stroke();
      }
    }

    // Drift physics parameters for Silicon
    const mu_n = 1400; // cm^2/V.s
    const mu_p = 450;  // cm^2/V.s
    const driftFactorElec = -eField * 0.004; // electrons drift opposite to E
    const driftFactorHole = eField * 0.0015; // holes drift along E

    particles.forEach((p) => {
      // Random thermal scattering
      if (Math.random() < 0.08) {
        p.vx = (Math.random() - 0.5) * (p.type === 'electron' ? 3.5 : 2.5);
        p.vy = (Math.random() - 0.5) * (p.type === 'electron' ? 3.5 : 2.5);
      }

      // Applied electric field drift velocity component
      const driftVx = p.type === 'electron' ? driftFactorElec : driftFactorHole;

      p.x += p.vx + driftVx;
      p.y += p.vy;

      // Periodic boundaries
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle glow & circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.type === 'electron' ? 4 : 5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw symbol (- or +)
      ctx.fillStyle = '#050b14';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.type === 'electron' ? '–' : '+', p.x, p.y);
    });

    // Update stats
    const vdE = Math.round(Math.abs(mu_n * eField));
    const vdH = Math.round(Math.abs(mu_p * eField));
    const currentDensity = ((1.6e-19 * (1e15 * mu_n + 1e14 * mu_p) * Math.abs(eField)) * 1e-15).toFixed(2);

    vdElecEl.textContent = `${(driftFactorElec < 0 ? '← ' : driftFactorElec > 0 ? '→ ' : '')}${vdE.toLocaleString()} cm/s`;
    vdHoleEl.textContent = `${(driftFactorHole < 0 ? '← ' : driftFactorHole > 0 ? '→ ' : '')}${vdH.toLocaleString()} cm/s`;
    jNetEl.textContent = `${currentDensity} mA/cm²`;

    animId = requestAnimationFrame(render);
  }

  render();

  return {
    destroy: () => cancelAnimationFrame(animId)
  };
}

// -------------------------------------------------------------
// 2. HALL EFFECT SIMULATOR (Slide 19)
// -------------------------------------------------------------
function createHallEffectSimulator(container) {
  container.innerHTML = `
    <div class="sim-card">
      <div class="sim-header">
        <span class="sim-badge">GALVANOMAGNETIC ENGINE</span>
        <span class="sim-title">Hall Effect Lorentz Deflection: $\\vec{F} = q(\\vec{v} \\times \\vec{B})$</span>
      </div>
      <canvas class="sim-canvas" width="560" height="240"></canvas>
      <div class="sim-controls">
        <div class="sim-control-group">
          <label>Perpendicular Magnetic Field $B_z$ (Tesla): <span id="bfield-val" class="text-cyan">+1.2 T</span></label>
          <input type="range" id="bfield-slider" min="-3.0" max="3.0" value="1.2" step="0.2" class="cyber-slider">
        </div>
        <div class="sim-stats-row">
          <div class="stat-pill"><span class="stat-label">Lorentz Force $F_y$:</span> <span id="f-lorentz" class="stat-val text-cyan">Pushing UP</span></div>
          <div class="stat-pill"><span class="stat-label">Measured $V_H$:</span> <span id="hall-voltage" class="stat-val text-amber">-48.2 mV</span></div>
          <div class="stat-pill"><span class="stat-label">Sample Type:</span> <span class="stat-val text-green">n-type (Electrons)</span></div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const slider = container.querySelector('#bfield-slider');
  const bVal = container.querySelector('#bfield-val');
  const fLorentzEl = container.querySelector('#f-lorentz');
  const vHallEl = container.querySelector('#hall-voltage');

  let bField = 1.2;
  slider.addEventListener('input', (e) => {
    bField = parseFloat(e.target.value);
    bVal.textContent = (bField >= 0 ? `+${bField.toFixed(1)}` : bField.toFixed(1)) + ' T';
  });

  // Current carrying electrons flowing from right to left (conventional current I flowing left to right)
  const carriers = [];
  for (let i = 0; i < 40; i++) {
    carriers.push({
      x: Math.random() * (canvas.width - 80) + 40,
      y: Math.random() * 120 + 60,
      vx: -(Math.random() * 1.5 + 2.0), // flow towards left
      vy: 0
    });
  }

  let animId;
  function render() {
    ctx.fillStyle = 'rgba(7, 13, 27, 0.35)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Semiconductor Slab
    const slabX = 50;
    const slabY = 50;
    const slabW = canvas.width - 100;
    const slabH = 140;

    // Slab body
    const grad = ctx.createLinearGradient(slabX, slabY, slabX, slabY + slabH);
    grad.addColorStop(0, 'rgba(14, 30, 60, 0.85)');
    grad.addColorStop(1, 'rgba(10, 20, 45, 0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(slabX, slabY, slabW, slabH);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(slabX, slabY, slabW, slabH);

    // Current electrodes (Left & Right)
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(slabX - 10, slabY + 30, 10, slabH - 60);
    ctx.fillRect(slabX + slabW, slabY + 30, 10, slabH - 60);

    // Current flow vector arrow (I_x)
    ctx.fillStyle = '#ffd166';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Current I →', slabX + slabW / 2 - 30, slabY + slabH + 25);

    // Magnetic field vector symbols (crosses if B > 0, dots if B < 0)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.font = '14px sans-serif';
    const sym = bField > 0 ? '⊗' : (bField < 0 ? '⊙' : '·');
    for (let mx = slabX + 30; mx < slabX + slabW; mx += 60) {
      for (let my = slabY + 30; my < slabY + slabH; my += 40) {
        ctx.fillText(sym, mx, my);
      }
    }

    // Upper and Lower Hall voltage sensing contacts
    const probeX = slabX + slabW / 2;
    ctx.fillStyle = '#00f2fe';
    ctx.fillRect(probeX - 12, slabY - 8, 24, 8);
    ctx.fillRect(probeX - 12, slabY + slabH, 24, 8);

    // Voltmeter lead lines
    ctx.strokeStyle = '#00f2fe';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(probeX, slabY - 8);
    ctx.lineTo(probeX, slabY - 25);
    ctx.lineTo(slabX + slabW - 30, slabY - 25);
    ctx.moveTo(probeX, slabY + slabH + 8);
    ctx.lineTo(probeX, slabY + slabH + 25);
    ctx.lineTo(slabX + slabW - 30, slabY + slabH + 25);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lorentz force deflection: F_y = -q (v_x * B_z)
    // Electrons move left (v_x < 0). Charge q = -e.
    // F_y = (-e) * (-vx * +Bz) = -y direction (deflects towards top!)
    const deflectionFactor = -bField * 0.45;

    carriers.forEach((c) => {
      c.x += c.vx;
      c.vy += (deflectionFactor - c.vy) * 0.1;
      c.y += c.vy;

      // Keep within slab boundaries
      if (c.x < slabX + 5) {
        c.x = slabX + slabW - 5;
        c.y = slabY + 20 + Math.random() * (slabH - 40);
        c.vy = 0;
      }
      if (c.y < slabY + 8) c.y = slabY + 8;
      if (c.y > slabY + slabH - 8) c.y = slabY + slabH - 8;

      // Draw electron
      ctx.beginPath();
      ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Update Hall metrics
    const hallV = (-bField * 38.5).toFixed(1);
    vHallEl.textContent = `${hallV} mV`;
    if (bField > 0.1) {
      fLorentzEl.textContent = 'Pushing TOP (Negative Top Plate)';
    } else if (bField < -0.1) {
      fLorentzEl.textContent = 'Pushing BOTTOM (Negative Bottom Plate)';
    } else {
      fLorentzEl.textContent = 'Zero Field (No Deflection)';
    }

    animId = requestAnimationFrame(render);
  }

  render();

  return {
    destroy: () => cancelAnimationFrame(animId)
  };
}

// -------------------------------------------------------------
// 3. E-k DISPERSION DIAGRAM (Slide 2)
// -------------------------------------------------------------
function createEkDiagram(container) {
  container.innerHTML = `
    <div class="sim-card">
      <div class="sim-header">
        <span class="sim-badge">BAND STRUCTURE</span>
        <span class="sim-title">Direct (GaAs) vs Indirect (Si) Recombination</span>
      </div>
      <canvas class="sim-canvas" width="560" height="240"></canvas>
      <div class="sim-controls">
        <div class="sim-btn-group">
          <button id="btn-direct" class="cyber-btn active">Direct Bandgap (GaAs)</button>
          <button id="btn-indirect" class="cyber-btn">Indirect Bandgap (Silicon)</button>
          <button id="btn-emit" class="cyber-btn accent">Emit Recombination</button>
        </div>
        <p id="ek-desc" class="sim-note">Direct transition: Conduction minimum aligns at k=0 with Valence maximum. Photon emitted directly!</p>
      </div>
    </div>
  `;

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const btnDirect = container.querySelector('#btn-direct');
  const btnIndirect = container.querySelector('#btn-indirect');
  const btnEmit = container.querySelector('#btn-emit');
  const descEl = container.querySelector('#ek-desc');

  let mode = 'direct'; // 'direct' or 'indirect'
  let photonPacket = null;
  let phononPacket = null;
  let electronPos = { x: 0, y: 0 };

  btnDirect.addEventListener('click', () => {
    mode = 'direct';
    btnDirect.classList.add('active');
    btnIndirect.classList.remove('active');
    descEl.textContent = 'Direct transition: Conduction minimum aligns at k=0 with Valence maximum. High optical efficiency (LEDs/Lasers)!';
    resetElectron();
  });

  btnIndirect.addEventListener('click', () => {
    mode = 'indirect';
    btnIndirect.classList.add('active');
    btnDirect.classList.remove('active');
    descEl.textContent = 'Indirect transition: Conduction minimum shifted at k≠0. Requires intermediate phonon (lattice vibration) emission!';
    resetElectron();
  });

  function resetElectron() {
    const cx = canvas.width / 2;
    if (mode === 'direct') {
      electronPos = { x: cx, y: 70 };
    } else {
      electronPos = { x: cx + 110, y: 70 };
    }
    photonPacket = null;
    phononPacket = null;
  }

  btnEmit.addEventListener('click', () => {
    const cx = canvas.width / 2;
    if (mode === 'direct') {
      // Direct drop: drop straight down
      photonPacket = { x: cx, y: 70, targetY: 170, progress: 0, type: 'photon' };
    } else {
      // Indirect: first move left emitting phonon, then drop emitting photon
      phononPacket = { x: cx + 110, y: 70, progress: 0 };
    }
  });

  resetElectron();

  let animId;
  function render() {
    ctx.fillStyle = 'rgba(7, 13, 27, 0.4)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    // Draw coordinate axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    // k-axis
    ctx.beginPath();
    ctx.moveTo(40, cy);
    ctx.lineTo(canvas.width - 40, cy);
    ctx.stroke();

    // E-axis
    ctx.beginPath();
    ctx.moveTo(cx, 20);
    ctx.lineTo(cx, canvas.height - 20);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '11px sans-serif';
    ctx.fillText('k = 0 (Γ point)', cx + 8, cy - 8);
    ctx.fillText('Energy E', cx + 8, 30);
    ctx.fillText('Wavevector k', canvas.width - 100, cy - 8);

    // Valence Band parabola: Maximum at k=0, curved downwards
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -180; x <= 180; x += 4) {
      const k = x / 80;
      const E = cy + 50 + k * k * 28;
      if (x === -180) ctx.moveTo(cx + x, E);
      else ctx.lineTo(cx + x, E);
    }
    ctx.stroke();
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('Valence Band (Ev)', cx - 180, cy + 65);

    // Conduction Band parabola
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    const cbOffsetK = mode === 'direct' ? 0 : 110;
    for (let x = -180; x <= 180; x += 4) {
      const k = (x - cbOffsetK) / 80;
      const E = cy - 50 - k * k * 28;
      if (x === -180) ctx.moveTo(cx + x, E);
      else ctx.lineTo(cx + x, E);
    }
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.fillText(mode === 'direct' ? 'Conduction Band (Ec at k=0)' : 'Conduction Band (Ec shifted k≠0)', cx + (mode === 'direct' ? 40 : -40), cy - 65);

    // Bandgap indicator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - 50);
    ctx.lineTo(cx, cy + 50);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#00ffaa';
    ctx.fillText('Eg', cx - 22, cy + 4);

    // Draw Recombination Animation
    if (photonPacket) {
      photonPacket.progress += 0.04;
      const currY = photonPacket.y + (photonPacket.targetY - photonPacket.y) * Math.min(photonPacket.progress, 1);
      
      // Photon wave packet
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let wx = -20; wx <= 20; wx += 2) {
        const wy = Math.sin(wx * 0.4 + photonPacket.progress * 10) * 8;
        if (wx === -20) ctx.moveTo(photonPacket.x + wx, currY + wy);
        else ctx.lineTo(photonPacket.x + wx, currY + wy);
      }
      ctx.stroke();

      ctx.fillStyle = '#00f2fe';
      ctx.fillText('Photon (hν)', photonPacket.x + 25, currY);

      if (photonPacket.progress >= 1.2) {
        photonPacket = null;
      }
    }

    if (phononPacket) {
      phononPacket.progress += 0.03;
      // Step 1: horizontal momentum shift via Phonon
      if (phononPacket.progress < 0.6) {
        const px = (cx + 110) - (110) * (phononPacket.progress / 0.6);
        electronPos.x = px;
        ctx.fillStyle = '#ff77aa';
        ctx.fillText('Phonon (Lattice Vibration)', px - 40, 50);
      } else if (!photonPacket) {
        // Step 2: vertical radiative drop
        electronPos.x = cx;
        photonPacket = { x: cx, y: 70, targetY: 170, progress: 0, type: 'photon' };
      }
      if (phononPacket.progress >= 1.2) {
        phononPacket = null;
        resetElectron();
      }
    }

    // Draw electron at conduction minimum
    ctx.beginPath();
    ctx.arc(electronPos.x, electronPos.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffd166';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    animId = requestAnimationFrame(render);
  }

  render();

  return {
    destroy: () => cancelAnimationFrame(animId)
  };
}

// -------------------------------------------------------------
// 4. FERMI-DIRAC DISTRIBUTION PLOT (Slide 5)
// -------------------------------------------------------------
function createFermiDiracPlot(container) {
  container.innerHTML = `
    <div class="sim-card">
      <div class="sim-header">
        <span class="sim-badge">STATISTICAL QUANTUM MECHANICS</span>
        <span class="sim-title">Fermi-Dirac Probability Distribution $f(E)$</span>
      </div>
      <canvas class="sim-canvas" width="560" height="240"></canvas>
      <div class="sim-controls">
        <div class="sim-control-group">
          <label>Temperature T (Kelvin): <span id="temp-val" class="text-cyan">300 K</span></label>
          <input type="range" id="temp-slider" min="0" max="800" value="300" step="50" class="cyber-slider">
        </div>
        <div class="sim-stats-row">
          <div class="stat-pill"><span class="stat-label">f(EF):</span> <span class="stat-val text-cyan">Exactly 0.50</span></div>
          <div class="stat-pill"><span class="stat-label">k_B T:</span> <span id="kbt-val" class="stat-val text-amber">25.9 meV</span></div>
          <div class="stat-pill"><span class="stat-label">Thermal Tail Width:</span> <span id="tail-val" class="stat-val text-green">~103 meV</span></div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const slider = container.querySelector('#temp-slider');
  const tempVal = container.querySelector('#temp-val');
  const kbtVal = container.querySelector('#kbt-val');
  const tailVal = container.querySelector('#tail-val');

  let T = 300;
  slider.addEventListener('input', (e) => {
    T = parseFloat(e.target.value);
    tempVal.textContent = `${T} K`;
    const kbt = (8.617e-5 * T * 1000).toFixed(1);
    kbtVal.textContent = `${kbt} meV`;
    tailVal.textContent = `~${(kbt * 4).toFixed(0)} meV`;
    draw();
  });

  function draw() {
    ctx.fillStyle = '#070d1b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const padLeft = 60;
    const padRight = 30;
    const padBottom = 40;
    const padTop = 30;
    const plotW = canvas.width - padLeft - padRight;
    const plotH = canvas.height - padTop - padBottom;

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop);
    ctx.lineTo(padLeft, padTop + plotH);
    ctx.lineTo(padLeft + plotW, padTop + plotH);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px sans-serif';
    ctx.fillText('1.0', padLeft - 28, padTop + 8);
    ctx.fillText('0.5', padLeft - 28, padTop + plotH / 2 + 4);
    ctx.fillText('0.0', padLeft - 28, padTop + plotH);
    ctx.fillText('Energy (E - EF) [eV]', padLeft + plotW / 2 - 40, padTop + plotH + 30);
    ctx.fillText('Probability f(E)', padLeft - 10, padTop - 12);

    // EF vertical guide line
    const efX = padLeft + plotW / 2;
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(efX, padTop);
    ctx.lineTo(efX, padTop + plotH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('E = EF', efX - 16, padTop + plotH + 16);

    // 0.5 horizontal guide line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(padLeft, padTop + plotH / 2);
    ctx.lineTo(padLeft + plotW, padTop + plotH / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot Fermi Dirac Curve
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    const kB = 8.617e-5; // eV/K
    const kBT = Math.max(kB * T, 1e-4);

    for (let px = 0; px <= plotW; px += 2) {
      // Map px to energy: -0.4 eV to +0.4 eV
      const deltaE = ((px - plotW / 2) / (plotW / 2)) * 0.4;
      let f;
      if (T === 0) {
        f = deltaE < 0 ? 1 : 0;
      } else {
        f = 1 / (1 + Math.exp(deltaE / kBT));
      }
      const py = padTop + plotH * (1 - f);
      if (px === 0) ctx.moveTo(padLeft + px, py);
      else ctx.lineTo(padLeft + px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  draw();

  return {
    destroy: () => {}
  };
}

// -------------------------------------------------------------
// 5. POISSON EQUATION & PN JUNCTION PROFILE (Slide 17)
// -------------------------------------------------------------
function createPoissonPlot(container) {
  container.innerHTML = `
    <div class="sim-card">
      <div class="sim-header">
        <span class="sim-badge">POISSON METROLOGY</span>
        <span class="sim-title">Space Charge $\\rho(x)$, Electric Field $\\mathcal{E}(x)$ & Potential $V(x)$</span>
      </div>
      <canvas class="sim-canvas" width="560" height="240"></canvas>
      <div class="sim-controls">
        <div class="sim-stats-row">
          <div class="stat-pill"><span class="stat-label">ρ(x):</span> <span class="stat-val text-amber">Step Depletion Charge</span></div>
          <div class="stat-pill"><span class="stat-label">E_max:</span> <span class="stat-val text-cyan">Peak at Junction (x=0)</span></div>
          <div class="stat-pill"><span class="stat-label">Built-in V_bi:</span> <span class="stat-val text-green">0.72 V (Silicon)</span></div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  function draw() {
    ctx.fillStyle = '#070d1b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const cx = w / 2;

    // Draw 3 panels: top = Charge, middle = E-field, bottom = Potential
    const p1 = 60;
    const p2 = 140;
    const p3 = 210;

    // Junction center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, 10);
    ctx.lineTo(cx, 230);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '10px sans-serif';
    ctx.fillText('Metallurgical Junction (x = 0)', cx - 60, 235);
    ctx.fillText('p-side (-xp)', cx - 160, 25);
    ctx.fillText('n-side (+xn)', cx + 110, 25);

    // 1. Charge Density rho(x)
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, p1);
    ctx.lineTo(cx - 90, p1);
    ctx.lineTo(cx - 90, p1 + 25);
    ctx.lineTo(cx, p1 + 25);
    ctx.lineTo(cx, p1 - 25);
    ctx.lineTo(cx + 90, p1 - 25);
    ctx.lineTo(cx + 90, p1);
    ctx.lineTo(w - 40, p1);
    ctx.stroke();
    ctx.fillStyle = '#ffd166';
    ctx.fillText('ρ(x): -q NA', cx - 80, p1 + 38);
    ctx.fillText('+q ND', cx + 45, p1 - 30);

    // 2. Electric Field E(x) (triangular distribution)
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, p2 - 25);
    ctx.lineTo(cx - 90, p2 - 25);
    ctx.lineTo(cx, p2 + 20); // peak field
    ctx.lineTo(cx + 90, p2 - 25);
    ctx.lineTo(w - 40, p2 - 25);
    ctx.stroke();
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('E(x) = (1/ε) ∫ ρ dx (Peak E_max)', cx + 12, p2 + 18);

    // 3. Potential V(x) (smooth parabola to plateau)
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, p3 + 10);
    ctx.lineTo(cx - 90, p3 + 10);
    ctx.quadraticCurveTo(cx - 40, p3 + 10, cx, p3 - 5);
    ctx.quadraticCurveTo(cx + 40, p3 - 20, cx + 90, p3 - 20);
    ctx.lineTo(w - 40, p3 - 20);
    ctx.stroke();
    ctx.fillStyle = '#00ffaa';
    ctx.fillText('V(x): Built-in Barrier V_bi = 0.72V', cx + 80, p3 - 10);
  }

  draw();

  return {
    destroy: () => {}
  };
}

// -------------------------------------------------------------
// 6. RECOMBINATION VISUALIZER (Slide 15)
// -------------------------------------------------------------
function createRecombinationVisualizer(container) {
  container.innerHTML = `
    <div class="sim-card">
      <div class="sim-header">
        <span class="sim-badge">LIFETIME DYNAMICS</span>
        <span class="sim-title">The Three Microscopic Recombination Mechanisms</span>
      </div>
      <div class="recomb-grid">
        <div class="recomb-item">
          <div class="recomb-title text-cyan">1. Radiative (Direct)</div>
          <div class="recomb-diagram">
            <span class="recomb-tag">Photon hν</span>
            <div class="recomb-desc">Band-to-band direct drop. Emits optical photon. Dominates in GaAs.</div>
          </div>
        </div>
        <div class="recomb-item">
          <div class="recomb-title text-amber">2. Shockley-Read-Hall</div>
          <div class="recomb-diagram">
            <span class="recomb-tag">Trap Et (Phonons)</span>
            <div class="recomb-desc">Midgap trap captures electron & hole. Dissipates heat. Dominates in Si.</div>
          </div>
        </div>
        <div class="recomb-item">
          <div class="recomb-title text-green">3. Auger (3-Carrier)</div>
          <div class="recomb-diagram">
            <span class="recomb-tag">e-h-e Collision</span>
            <div class="recomb-desc">Energy transfers to 3rd carrier as kinetic energy. Dominates at heavy doping.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  return {
    destroy: () => {}
  };
}

// -------------------------------------------------------------
// 7. DOPING CRYSTAL & 3D ANIMATION (Slide 4: n-type & p-type)
// -------------------------------------------------------------
function createDopingVisualizer(container) {
  container.innerHTML = `
    <div class="sim-card doping-card">
      <div class="sim-header">
        <span class="sim-badge">3D CRYSTAL LATTICE & DOPING</span>
        <span class="sim-title">Extrinsic Doping: n-type (P) vs p-type (In)</span>
      </div>

      <!-- Mode View Selector -->
      <div class="doping-tab-bar">
        <button id="tab-3d" class="cyber-btn active">3D Animated Model</button>
        <button id="tab-diagram" class="cyber-btn">Reference Diagram</button>
        <button id="tab-split" class="cyber-btn">Dual Comparison</button>
      </div>

      <!-- View 1: 3D Animated Canvas -->
      <div id="doping-anim-viewport" class="doping-view-panel active">
        <canvas id="doping-canvas" class="sim-canvas" width="560" height="230"></canvas>
        <div class="sim-controls">
          <div class="sim-btn-group">
            <button id="btn-mode-ntype" class="cyber-btn active">n-type (Phosphorus P)</button>
            <button id="btn-mode-ptype" class="cyber-btn">p-type (Indium In)</button>
            <button id="btn-ionize" class="cyber-btn accent">⚡ Trigger Ionization (Thermal kT)</button>
          </div>
          <div class="sim-stats-row">
            <div class="stat-pill">
              <span class="stat-label">Impurity Atom:</span>
              <span id="dopant-atom" class="stat-val text-amber">Phosphorus (Group V)</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Generated Carrier:</span>
              <span id="carrier-type" class="stat-val text-cyan">Free Electron (e⁻)</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Ionized State:</span>
              <span id="ion-state" class="stat-val text-green">Bound Core P⁺</span>
            </div>
          </div>
        </div>
      </div>

      <!-- View 2: Reference Image View -->
      <div id="doping-img-viewport" class="doping-view-panel" style="display: none;">
        <div class="ref-img-container">
          <img src="/doping_crystal.jpg" alt="n-type and p-type Doping Crystal Structure" class="doping-ref-img">
          <div class="ref-img-caption">
            <div class="ric-item"><strong class="text-cyan">n-type (Left):</strong> Pentavalent Phosphorus (P) donates 5th valence electron into conduction band.</div>
            <div class="ric-item"><strong class="text-amber">p-type (Right):</strong> Trivalent Indium (In) accepts electron, leaving a mobile hole in valence band.</div>
          </div>
        </div>
      </div>

      <!-- View 3: Split Dual View -->
      <div id="doping-split-viewport" class="doping-view-panel" style="display: none;">
        <div class="split-container">
          <div class="split-left">
            <img src="/doping_crystal.jpg" alt="Crystal Structure Diagram" class="split-img">
            <div class="split-tag">Reference Textbook Diagram</div>
          </div>
          <div class="split-right">
            <canvas id="split-canvas" class="sim-canvas" width="270" height="210"></canvas>
            <div class="split-tag">3D Interactive Dynamic Model</div>
          </div>
        </div>
      </div>

    </div>
  `;

  // Tab View Switcher Elements
  const tab3D = container.querySelector('#tab-3d');
  const tabDiagram = container.querySelector('#tab-diagram');
  const tabSplit = container.querySelector('#tab-split');

  const viewAnim = container.querySelector('#doping-anim-viewport');
  const viewImg = container.querySelector('#doping-img-viewport');
  const viewSplit = container.querySelector('#doping-split-viewport');

  // Control Buttons
  const btnNtype = container.querySelector('#btn-mode-ntype');
  const btnPtype = container.querySelector('#btn-mode-ptype');
  const btnIonize = container.querySelector('#btn-ionize');

  // Stat Labels
  const dopantAtomEl = container.querySelector('#dopant-atom');
  const carrierTypeEl = container.querySelector('#carrier-type');
  const ionStateEl = container.querySelector('#ion-state');

  // Canvases
  const canvasMain = container.querySelector('#doping-canvas');
  const canvasSplit = container.querySelector('#split-canvas');

  let currentMode = 'ntype'; // 'ntype' or 'ptype'
  let isIonized = false;
  let ionizationProgress = 0; // 0 to 1
  let activeTab = '3d'; // '3d', 'diagram', 'split'

  function switchTab(tab) {
    activeTab = tab;
    [tab3D, tabDiagram, tabSplit].forEach(t => t.classList.remove('active'));
    [viewAnim, viewImg, viewSplit].forEach(v => v.style.display = 'none');

    if (tab === '3d') {
      tab3D.classList.add('active');
      viewAnim.style.display = 'block';
    } else if (tab === 'diagram') {
      tabDiagram.classList.add('active');
      viewImg.style.display = 'block';
    } else if (tab === 'split') {
      tabSplit.classList.add('active');
      viewSplit.style.display = 'block';
    }
  }

  tab3D.addEventListener('click', () => switchTab('3d'));
  tabDiagram.addEventListener('click', () => switchTab('diagram'));
  tabSplit.addEventListener('click', () => switchTab('split'));

  btnNtype.addEventListener('click', () => {
    currentMode = 'ntype';
    isIonized = false;
    ionizationProgress = 0;
    btnNtype.classList.add('active');
    btnPtype.classList.remove('active');
    dopantAtomEl.textContent = 'Phosphorus P (Group V)';
    carrierTypeEl.textContent = 'Free Electron (e⁻)';
    ionStateEl.textContent = 'Bound Core P⁺ (Donor)';
  });

  btnPtype.addEventListener('click', () => {
    currentMode = 'ptype';
    isIonized = false;
    ionizationProgress = 0;
    btnPtype.classList.add('active');
    btnNtype.classList.remove('active');
    dopantAtomEl.textContent = 'Indium In (Group III)';
    carrierTypeEl.textContent = 'Mobile Hole (h⁺)';
    ionStateEl.textContent = 'Bound Core In⁻ (Acceptor)';
  });

  btnIonize.addEventListener('click', () => {
    isIonized = !isIonized;
    if (isIonized) {
      ionizationProgress = 0;
      btnIonize.textContent = '↺ Reset Bound State';
    } else {
      btnIonize.textContent = '⚡ Trigger Ionization (Thermal kT)';
    }
  });

  let animId;
  let time = 0;

  function drawLatticeOnCanvas(cvs) {
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = w < 400 ? 0.75 : 1.0;

    ctx.fillStyle = '#070d1b';
    ctx.fillRect(0, 0, w, h);

    // Coordinate offsets for the 4 Silicon neighbors in cross pattern
    const dist = 75 * scale;
    const neighbors = [
      { name: 'Si', x: cx, y: cy - dist, angle: -Math.PI / 2 },
      { name: 'Si', x: cx, y: cy + dist, angle: Math.PI / 2 },
      { name: 'Si', x: cx - dist, y: cy, angle: Math.PI },
      { name: 'Si', x: cx + dist, y: cy, angle: 0 }
    ];

    // 1. Draw Covalent Bonding Dotted Loops (Ovals)
    neighbors.forEach((nb) => {
      const midX = (cx + nb.x) / 2;
      const midY = (cy + nb.y) / 2;

      ctx.save();
      ctx.translate(midX, midY);
      ctx.rotate(nb.angle);

      // Dotted Oval
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.ellipse(0, 0, dist * 0.46, 14 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Shared electron pairs orbiting inside the bond
      const eDist = 12 * scale;
      const orbitOffset = Math.sin(time * 3) * 3;

      // Electron 1
      ctx.beginPath();
      ctx.arc(-eDist + orbitOffset, 0, 3.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2fe';
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Electron 2 (or vacancy if p-type missing bond)
      const isMissingBond = (currentMode === 'ptype' && nb.angle === -Math.PI / 2);

      if (!isMissingBond || (isIonized && ionizationProgress > 0.6)) {
        ctx.beginPath();
        ctx.arc(eDist - orbitOffset, 0, 3.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Draw Vacant Hole (pulsing dashed circle)
        const pulseR = (4.5 + Math.sin(time * 6) * 1.5) * scale;
        ctx.beginPath();
        ctx.arc(eDist, 0, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255, 209, 102, 0.2)';
        ctx.fill();
      }

      ctx.restore();
    });

    // 2. Draw 4 Silicon Atoms
    neighbors.forEach((nb) => {
      // Outer electron ring
      ctx.strokeStyle = 'rgba(79, 172, 254, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(nb.x, nb.y, 22 * scale, 0, Math.PI * 2);
      ctx.stroke();

      // Valence dots around Si outer circle (blue dots from user diagram)
      const valenceAngles = [0, Math.PI / 2, Math.PI, -Math.PI / 2];
      valenceAngles.forEach((a) => {
        const vx = nb.x + Math.cos(a + time * 0.5) * 22 * scale;
        const vy = nb.y + Math.sin(a + time * 0.5) * 22 * scale;
        ctx.beginPath();
        ctx.arc(vx, vy, 3.2 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
      });

      // 3D Spherical Core for Silicon
      const siGrad = ctx.createRadialGradient(
        nb.x - 4 * scale, nb.y - 4 * scale, 2 * scale,
        nb.x, nb.y, 16 * scale
      );
      siGrad.addColorStop(0, '#cbd5e1');
      siGrad.addColorStop(0.5, '#64748b');
      siGrad.addColorStop(1, '#1e293b');

      ctx.beginPath();
      ctx.arc(nb.x, nb.y, 16 * scale, 0, Math.PI * 2);
      ctx.fillStyle = siGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label "Si"
      ctx.fillStyle = '#ffffff';
      ctx.font = `italic bold ${Math.round(11 * scale)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Si', nb.x, nb.y);
    });

    // 3. Central Impurity Atom (Phosphorus P or Indium In)
    const centralName = currentMode === 'ntype' ? 'P' : 'In';

    // Outer orbit ring
    ctx.strokeStyle = currentMode === 'ntype' ? 'rgba(0, 255, 170, 0.4)' : 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 24 * scale, 0, Math.PI * 2);
    ctx.stroke();

    // 3D Spherical Central Core
    const coreGrad = ctx.createRadialGradient(
      cx - 4 * scale, cy - 4 * scale, 2 * scale,
      cx, cy, 18 * scale
    );
    if (currentMode === 'ntype') {
      coreGrad.addColorStop(0, '#86efac');
      coreGrad.addColorStop(0.5, '#22c55e');
      coreGrad.addColorStop(1, '#064e3b');
    } else {
      coreGrad.addColorStop(0, '#f0abfc');
      coreGrad.addColorStop(0.5, '#a855f7');
      coreGrad.addColorStop(1, '#3b0764');
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 18 * scale, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.shadowColor = currentMode === 'ntype' ? '#00ffaa' : '#a855f7';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Central Label
    ctx.fillStyle = '#ffffff';
    ctx.font = `italic bold ${Math.round(13 * scale)}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(centralName, cx, cy);

    // 4. THE 5th ELECTRON OR ACCEPTOR HOLE ANIMATION
    if (currentMode === 'ntype') {
      // 5th electron of Phosphorus
      let e5x, e5y;
      if (!isIonized) {
        // Bound orbit near P
        const e5Angle = -Math.PI / 4 + Math.sin(time * 2) * 0.2;
        e5x = cx + Math.cos(e5Angle) * 36 * scale;
        e5y = cy + Math.sin(e5Angle) * 36 * scale;

        // Draw orange arrow pointing outward
        ctx.strokeStyle = '#ff9900';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + 26 * scale, cy - 26 * scale);
        ctx.lineTo(cx + 46 * scale, cy - 46 * scale);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.moveTo(cx + 46 * scale, cy - 46 * scale);
        ctx.lineTo(cx + 44 * scale, cy - 36 * scale);
        ctx.lineTo(cx + 36 * scale, cy - 44 * scale);
        ctx.fill();

        // Label
        ctx.fillStyle = '#00ffaa';
        ctx.font = `italic ${Math.round(11 * scale)}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('Donor impurity', cx + 55 * scale, cy - 50 * scale);
        ctx.fillText('contributes free electrons', cx + 55 * scale, cy - 36 * scale);
      } else {
        // Ionized: electron flies out into conduction band
        if (ionizationProgress < 1) ionizationProgress += 0.02;
        const targetX = w - 40 * scale;
        const targetY = 30 * scale;
        e5x = (cx + 36 * scale) + (targetX - (cx + 36 * scale)) * ionizationProgress;
        e5y = (cy - 36 * scale) + (targetY - (cy - 36 * scale)) * ionizationProgress;

        // Free carrier glow & label
        ctx.fillStyle = '#00ffaa';
        ctx.font = `bold ${Math.round(11 * scale)}px sans-serif`;
        ctx.fillText('⚡ Free Electron in Conduction Band', e5x - 120 * scale, e5y + 20 * scale);
      }

      // Draw the 5th electron
      ctx.beginPath();
      ctx.arc(e5x, e5y, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffaa';
      ctx.shadowColor = '#00ffaa';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

    } else {
      // p-type: Indium Hole creation & electron hopping
      if (!isIonized) {
        // Arrow indicating incoming electron to create hole
        ctx.strokeStyle = '#ff9900';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + 45 * scale, cy - 35 * scale);
        ctx.lineTo(cx + 20 * scale, cy - 35 * scale);
        ctx.stroke();

        // Arrow head
        ctx.fillStyle = '#ff9900';
        ctx.beginPath();
        ctx.moveTo(cx + 20 * scale, cy - 35 * scale);
        ctx.lineTo(cx + 28 * scale, cy - 40 * scale);
        ctx.lineTo(cx + 28 * scale, cy - 30 * scale);
        ctx.fill();

        // Nearby valence electron ready to jump
        ctx.beginPath();
        ctx.arc(cx + 52 * scale, cy - 35 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();

        // Label
        ctx.fillStyle = '#ffd166';
        ctx.font = `italic ${Math.round(11 * scale)}px sans-serif`;
        ctx.textAlign = 'left';
        ctx.fillText('Acceptor impurity', cx + 45 * scale, cy - 58 * scale);
        ctx.fillText('creates a hole', cx + 45 * scale, cy - 44 * scale);
      } else {
        if (ionizationProgress < 1) ionizationProgress += 0.02;

        // Hopped electron is now in the Indium bond
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(cx + 12 * scale, cy - 35 * scale, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        // New Mobile Hole propagating through neighbor Si
        const holeX = cx + 52 * scale + ionizationProgress * 40 * scale;
        const holeY = cy - 35 * scale + Math.sin(time * 3) * 10;

        ctx.beginPath();
        ctx.arc(holeX, holeY, (5 + Math.sin(time * 6) * 1.5) * scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 2;
        ctx.setLineDash([2, 2]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(255, 209, 102, 0.3)';
        ctx.fill();

        ctx.fillStyle = '#ffd166';
        ctx.font = `bold ${Math.round(11 * scale)}px sans-serif`;
        ctx.fillText('⚡ Mobile Hole Travelling in VB (h⁺)', holeX - 110 * scale, holeY + 22 * scale);
      }
    }
  }

  function render() {
    time += 0.03;
    if (activeTab === '3d') {
      drawLatticeOnCanvas(canvasMain);
    } else if (activeTab === 'split') {
      drawLatticeOnCanvas(canvasSplit);
    }
    animId = requestAnimationFrame(render);
  }

  render();

  return {
    destroy: () => cancelAnimationFrame(animId)
  };
}

// -------------------------------------------------------------
// 8. MOBILITY TEMPERATURE DEPENDENCE & SCATTERING (Slide 13)
// -------------------------------------------------------------
function createMobilityVisualizer(container) {
  container.innerHTML = `
    <div class="sim-card mobility-card">
      <div class="sim-header">
        <span class="sim-badge">3D SCATTERING & METROLOGY</span>
        <span class="sim-title">Temperature Dependence of Mobility in Si (Fig 2.2.38)</span>
      </div>

      <!-- Mode View Selector -->
      <div class="mobility-tab-bar">
        <button id="mtab-3d" class="cyber-btn active">3D Animated Physics</button>
        <button id="mtab-diagram" class="cyber-btn">Figure 2.2.38 Diagram</button>
        <button id="mtab-split" class="cyber-btn">Dual Comparison</button>
      </div>

      <!-- View 1: 3D Animated Canvas -->
      <div id="mobility-anim-viewport" class="mobility-view-panel active">
        <canvas id="mobility-canvas" class="sim-canvas" width="560" height="230"></canvas>
        <div class="sim-controls">
          <div class="sim-control-group">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label>Temperature T (Kelvin): <span id="mtemp-val" class="text-cyan">300 K</span></label>
              <div class="sim-btn-group" style="margin:0;">
                <button id="btn-t-low" class="cyber-btn" style="padding:3px 8px; font-size:0.75rem;">50K (Low T)</button>
                <button id="btn-t-peak" class="cyber-btn" style="padding:3px 8px; font-size:0.75rem;">160K (Peak)</button>
                <button id="btn-t-room" class="cyber-btn active" style="padding:3px 8px; font-size:0.75rem;">300K (Room T)</button>
              </div>
            </div>
            <input type="range" id="mtemp-slider" min="30" max="600" value="300" step="10" class="cyber-slider">
          </div>
          <div class="sim-stats-row">
            <div class="stat-pill">
              <span class="stat-label">Lattice Limit (μ_L ∝ T⁻³/²):</span>
              <span id="mu-lattice-val" class="stat-val text-cyan">1,400 cm²/V·s</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Impurity Limit (μ_I ∝ T⁺³/²):</span>
              <span id="mu-impurity-val" class="stat-val text-amber">6,200 cm²/V·s</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Combined μ (Matthiessen):</span>
              <span id="mu-net-val" class="stat-val text-green">1,142 cm²/V·s</span>
            </div>
            <div class="stat-pill">
              <span class="stat-label">Dominant Mechanism:</span>
              <span id="dominant-mech-val" class="stat-val text-cyan">Lattice Phonon Scattering</span>
            </div>
          </div>
        </div>
      </div>

      <!-- View 2: Reference Image View -->
      <div id="mobility-img-viewport" class="mobility-view-panel" style="display: none;">
        <div class="ref-img-container">
          <img src="/mobility_scattering.jpg" alt="Figure 2.2.38. Temperature dependence of mobility in Si" class="mobility-ref-img">
          <div class="ref-img-caption">
            <div class="ric-item"><strong class="text-amber">Low Temperature (T < 150K):</strong> μ ∝ T³ᐟ² — Impurity scattering dominates. Slow carriers experience prolonged Coulomb attraction to ionized dopants.</div>
            <div class="ric-item"><strong class="text-cyan">High Temperature (T > 200K):</strong> μ ∝ T⁻³ᐟ² — Lattice acoustic phonon scattering dominates as thermal lattice vibrations intensify.</div>
          </div>
        </div>
      </div>

      <!-- View 3: Split Dual View -->
      <div id="mobility-split-viewport" class="mobility-view-panel" style="display: none;">
        <div class="split-container">
          <div class="split-left">
            <img src="/mobility_scattering.jpg" alt="Figure 2.2.38" class="split-img">
            <div class="split-tag">Reference Figure 2.2.38</div>
          </div>
          <div class="split-right">
            <canvas id="split-m-canvas" class="sim-canvas" width="270" height="210"></canvas>
            <div class="split-tag">Live Matthiessen Simulation</div>
          </div>
        </div>
      </div>

    </div>
  `;

  // Tab View Switcher Elements
  const tab3D = container.querySelector('#mtab-3d');
  const tabDiagram = container.querySelector('#mtab-diagram');
  const tabSplit = container.querySelector('#mtab-split');

  const viewAnim = container.querySelector('#mobility-anim-viewport');
  const viewImg = container.querySelector('#mobility-img-viewport');
  const viewSplit = container.querySelector('#mobility-split-viewport');

  // Slider & Presets
  const slider = container.querySelector('#mtemp-slider');
  const tempValEl = container.querySelector('#mtemp-val');
  const btnTLow = container.querySelector('#btn-t-low');
  const btnTPeak = container.querySelector('#btn-t-peak');
  const btnTRoom = container.querySelector('#btn-t-room');

  // Stats
  const muLatticeEl = container.querySelector('#mu-lattice-val');
  const muImpurityEl = container.querySelector('#mu-impurity-val');
  const muNetEl = container.querySelector('#mu-net-val');
  const dominantMechEl = container.querySelector('#dominant-mech-val');

  // Canvases
  const canvasMain = container.querySelector('#mobility-canvas');
  const canvasSplit = container.querySelector('#split-m-canvas');

  let currentTemp = 300;
  let activeTab = '3d';

  function switchTab(tab) {
    activeTab = tab;
    [tab3D, tabDiagram, tabSplit].forEach(t => t.classList.remove('active'));
    [viewAnim, viewImg, viewSplit].forEach(v => v.style.display = 'none');

    if (tab === '3d') {
      tab3D.classList.add('active');
      viewAnim.style.display = 'block';
    } else if (tab === 'diagram') {
      tabDiagram.classList.add('active');
      viewImg.style.display = 'block';
    } else if (tab === 'split') {
      tabSplit.classList.add('active');
      viewSplit.style.display = 'block';
    }
  }

  tab3D.addEventListener('click', () => switchTab('3d'));
  tabDiagram.addEventListener('click', () => switchTab('diagram'));
  tabSplit.addEventListener('click', () => switchTab('split'));

  function updateTemp(T) {
    currentTemp = T;
    slider.value = T;
    tempValEl.textContent = `${T} K`;

    // Presets active style
    btnTLow.classList.toggle('active', T === 50);
    btnTPeak.classList.toggle('active', T === 160);
    btnTRoom.classList.toggle('active', T === 300);

    // Calculate mobilities
    // mu_L = 1400 * (300 / T)^1.5
    // mu_I = 1400 * (T / 160)^1.5
    const muL = 1400 * Math.pow(300 / T, 1.5);
    const muI = 1500 * Math.pow(T / 120, 1.5);
    const muNet = 1 / (1 / muL + 1 / muI);

    muLatticeEl.textContent = `${Math.round(muL).toLocaleString()} cm²/V·s`;
    muImpurityEl.textContent = `${Math.round(muI).toLocaleString()} cm²/V·s`;
    muNetEl.textContent = `${Math.round(muNet).toLocaleString()} cm²/V·s`;

    if (T < 140) {
      dominantMechEl.textContent = 'Impurity Scattering (T³ᐟ²)';
      dominantMechEl.className = 'stat-val text-amber';
    } else if (T > 200) {
      dominantMechEl.textContent = 'Lattice Phonons (T⁻³ᐟ²)';
      dominantMechEl.className = 'stat-val text-cyan';
    } else {
      dominantMechEl.textContent = 'Peak Optimal Mobility';
      dominantMechEl.className = 'stat-val text-green';
    }
  }

  slider.addEventListener('input', (e) => updateTemp(parseFloat(e.target.value)));
  btnTLow.addEventListener('click', () => updateTemp(50));
  btnTPeak.addEventListener('click', () => updateTemp(160));
  btnTRoom.addEventListener('click', () => updateTemp(300));

  // Particles for 3D simulation
  const electrons = [];
  for (let i = 0; i < 20; i++) {
    electrons.push({
      x: Math.random() * 200 + 20,
      y: Math.random() * 180 + 20,
      vx: (Math.random() * 1.5 + 1.2),
      vy: (Math.random() - 0.5) * 1.5
    });
  }

  let animId;
  let time = 0;

  function drawMobility(cvs) {
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const w = cvs.width;
    const h = cvs.height;

    ctx.fillStyle = '#070d1b';
    ctx.fillRect(0, 0, w, h);

    const isCompact = w < 400;
    const splitX = isCompact ? w : Math.round(w * 0.48);

    // -------------------------------------------------------------
    // LEFT HALF: 3D Crystal Scattering Physics
    // -------------------------------------------------------------
    if (!isCompact) {
      // Background divider
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(splitX, 15);
      ctx.lineTo(splitX, h - 15);
      ctx.stroke();

      // Section Header
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('3D MICROSCOPIC CARRIER SCATTERING', 20, 22);

      // Temperature-driven vibration amplitude
      const vibAmp = (currentTemp / 600) * 4.5;
      const latticeFreq = 0.2 + (currentTemp / 600) * 0.4;

      // Draw 3x3 vibrating Silicon lattice nodes
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const baseLx = 50 + col * 70;
          const baseLy = 65 + row * 60;
          const vibX = Math.sin(time * 10 + row * 2 + col) * vibAmp;
          const vibY = Math.cos(time * 10 + col * 2 + row) * vibAmp;
          const lx = baseLx + vibX;
          const ly = baseLy + vibY;

          // Lattice node sphere
          const nodeGrad = ctx.createRadialGradient(lx - 2, ly - 2, 1, lx, ly, 8);
          nodeGrad.addColorStop(0, '#94a3b8');
          nodeGrad.addColorStop(1, '#1e293b');
          ctx.beginPath();
          ctx.arc(lx, ly, 7, 0, Math.PI * 2);
          ctx.fillStyle = nodeGrad;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.stroke();

          // Phonon wave rings at high temperature
          if (currentTemp > 250) {
            const waveR = (time * 15 + row * 10 + col * 5) % 24;
            ctx.strokeStyle = `rgba(0, 242, 254, ${Math.max(0, 0.4 - waveR / 30)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(lx, ly, waveR, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }

      // Central Ionized Impurity (ND+)
      const impX = 120;
      const impY = 125;
      const impGrad = ctx.createRadialGradient(impX - 2, impY - 2, 1, impX, impY, 11);
      impGrad.addColorStop(0, '#fde047');
      impGrad.addColorStop(1, '#ca8a04');
      ctx.beginPath();
      ctx.arc(impX, impY, 10, 0, Math.PI * 2);
      ctx.fillStyle = impGrad;
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#050b14';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N_D⁺', impX, impY);

      // Coulomb force aura around ion
      ctx.strokeStyle = 'rgba(255, 209, 102, 0.25)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.arc(impX, impY, 32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Move & scatter electrons
      // Low T: slow thermal velocity, heavy Coulomb deflection towards ion
      // High T: fast velocity, frequent phonon impacts
      const speedFactor = 0.6 + (currentTemp / 300) * 1.2;
      const coulombStrength = currentTemp < 150 ? 40 / Math.max(currentTemp, 30) : 0.15;

      electrons.forEach((el) => {
        const dx = impX - el.x;
        const dy = impY - el.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
          // Coulomb attraction / deflection towards/around positive ion
          el.vy += (dy / dist) * coulombStrength * 0.2;
        }

        // Phonon kick at high temperatures
        if (currentTemp > 250 && Math.random() < 0.06) {
          el.vy += (Math.random() - 0.5) * 1.8;
        }

        el.x += el.vx * speedFactor;
        el.y += el.vy;

        // Boundaries
        if (el.x > splitX - 10) {
          el.x = 20;
          el.y = Math.random() * (h - 60) + 30;
          el.vy = (Math.random() - 0.5) * 1.5;
        }
        if (el.y < 30) el.y = h - 30;
        if (el.y > h - 30) el.y = 30;

        // Draw electron
        ctx.beginPath();
        ctx.arc(el.x, el.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f2fe';
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // -------------------------------------------------------------
    // RIGHT HALF: Matthiessen Log-Log Plot (Matches User's Figure)
    // -------------------------------------------------------------
    const plotLeft = isCompact ? 35 : splitX + 35;
    const plotTop = 40;
    const plotW = w - plotLeft - 25;
    const plotH = h - plotTop - 35;

    // Coordinate axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(plotLeft, plotTop - 10);
    ctx.lineTo(plotLeft, plotTop + plotH);
    ctx.lineTo(plotLeft + plotW + 15, plotTop + plotH);
    ctx.stroke();

    // Axis Arrows
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(plotLeft - 4, plotTop - 10);
    ctx.lineTo(plotLeft + 4, plotTop - 10);
    ctx.lineTo(plotLeft, plotTop - 16);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(plotLeft + plotW + 15, plotTop + plotH - 4);
    ctx.lineTo(plotLeft + plotW + 15, plotTop + plotH + 4);
    ctx.lineTo(plotLeft + plotW + 21, plotTop + plotH);
    ctx.fill();

    // Axis Labels
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('T(K) (log scale)', plotLeft + plotW / 2, plotTop + plotH + 26);
    ctx.save();
    ctx.translate(plotLeft - 18, plotTop + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('μ (log scale)', 0, 0);
    ctx.restore();

    // 1. Asymptotic Curve: Impurity Scattering (T^3/2 rising slope)
    ctx.strokeStyle = 'rgba(255, 209, 102, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (let px = 0; px <= plotW * 0.65; px += 4) {
      // Rising slope
      const normX = px / plotW;
      const py = plotTop + plotH - (normX * 1.5) * plotH - 15;
      if (px === 0) ctx.moveTo(plotLeft + px, py);
      else ctx.lineTo(plotLeft + px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffd166';
    ctx.font = 'italic 10px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('T 3/2', plotLeft + 25, plotTop + 45);

    // 2. Asymptotic Curve: Lattice Scattering (T^-3/2 falling slope)
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    for (let px = plotW * 0.35; px <= plotW; px += 4) {
      // Falling slope
      const normX = (px - plotW * 0.35) / (plotW * 0.65);
      const py = plotTop + 15 + (normX * 1.5) * plotH;
      if (px === plotW * 0.35) ctx.moveTo(plotLeft + px, py);
      else ctx.lineTo(plotLeft + px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('T -3/2', plotLeft + plotW - 45, plotTop + 45);

    // 3. Combined Actual Mobility Curve (Matthiessen Rule: Bell/Inverted Parabola)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 8;
    ctx.beginPath();

    let markerPx = 0;
    let markerPy = 0;

    for (let px = 0; px <= plotW; px += 2) {
      // Map px (0 to plotW) to T (30 to 600K)
      const tVal = 30 + (px / plotW) * 570;
      const muL = 1400 * Math.pow(300 / tVal, 1.5);
      const muI = 1500 * Math.pow(tVal / 120, 1.5);
      const muNet = 1 / (1 / muL + 1 / muI);

      // Normalize log(muNet): min ~ 200, max ~ 2200
      const normY = (muNet - 200) / (2200 - 200);
      const py = plotTop + plotH - normY * (plotH - 20) - 10;

      if (px === 0) ctx.moveTo(plotLeft + px, py);
      else ctx.lineTo(plotLeft + px, py);

      if (Math.abs(tVal - currentTemp) < 5) {
        markerPx = plotLeft + px;
        markerPy = py;
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. Current State Marker Dot
    if (markerPx > 0) {
      ctx.beginPath();
      ctx.arc(markerPx, markerPy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffaa';
      ctx.shadowColor = '#00ffaa';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dotted guide line to temperature axis
      ctx.strokeStyle = 'rgba(0, 255, 170, 0.4)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(markerPx, markerPy + 6);
      ctx.lineTo(markerPx, plotTop + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#00ffaa';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.round(currentTemp)}K`, markerPx, plotTop + plotH + 12);
    }
  }

  function render() {
    time += 0.03;
    if (activeTab === '3d') {
      drawMobility(canvasMain);
    } else if (activeTab === 'split') {
      drawMobility(canvasSplit);
    }
    animId = requestAnimationFrame(render);
  }

  // Initialize with Room Temp
  updateTemp(300);
  render();

  return {
    destroy: () => cancelAnimationFrame(animId)
  };
}

// -------------------------------------------------------------
// 9. THE LAW OF CHARGE NEUTRALITY SIMULATOR (Topic 03, Slide 2)
// -------------------------------------------------------------
function createChargeNeutralitySim(container) {
  container.innerHTML = `
    <div class="sim-card">
      <div class="sim-header">
        <span class="sim-badge">ELECTROSTATIC EQUILIBRIUM ENGINE</span>
        <span class="sim-title">The Law of Charge Neutrality: p₀ + N_D⁺ = n₀ + N_A⁻</span>
      </div>
      <div class="sim-btn-group" style="margin-bottom: 8px;">
        <button class="cyber-btn active" id="cn-btn-intrinsic">INTRINSIC (Pure Si)</button>
        <button class="cyber-btn" id="cn-btn-ntype">n-TYPE (Donors N_D)</button>
        <button class="cyber-btn" id="cn-btn-ptype">p-TYPE (Acceptors N_A)</button>
        <button class="cyber-btn" id="cn-btn-comp">COMPENSATED</button>
      </div>
      <canvas class="sim-canvas" width="560" height="230"></canvas>
      <div class="sim-controls">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="sim-control-group">
            <label>Donors N_D⁺ (×10¹⁵ cm⁻³): <span id="cn-nd-val" class="text-cyan">0.0</span></label>
            <input type="range" id="cn-nd-slider" min="0" max="20" value="0" step="0.5" class="cyber-slider">
          </div>
          <div class="sim-control-group">
            <label>Acceptors N_A⁻ (×10¹⁵ cm⁻³): <span id="cn-na-val" class="text-amber">0.0</span></label>
            <input type="range" id="cn-na-slider" min="0" max="20" value="0" step="0.5" class="cyber-slider">
          </div>
        </div>
        <div class="sim-stats-row">
          <div class="stat-pill"><span class="stat-label">Electrons (n):</span> <span id="cn-n-stat" class="stat-val text-cyan">1.50 × 10¹⁰</span></div>
          <div class="stat-pill"><span class="stat-label">Holes (p):</span> <span id="cn-p-stat" class="stat-val text-amber">1.50 × 10¹⁰</span></div>
          <div class="stat-pill"><span class="stat-label">Total Positive (+):</span> <span id="cn-pos-stat" class="stat-val text-green">1.50 × 10¹⁰</span></div>
          <div class="stat-pill"><span class="stat-label">Total Negative (–):</span> <span id="cn-neg-stat" class="stat-val text-green">1.50 × 10¹⁰</span></div>
          <div class="stat-pill"><span class="stat-label">Net Space Charge ρ:</span> <span id="cn-rho-stat" class="stat-val" style="color:#00ffaa;">0.00 C/cm³ [NEUTRAL]</span></div>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const ndSlider = container.querySelector('#cn-nd-slider');
  const naSlider = container.querySelector('#cn-na-slider');
  const ndValEl = container.querySelector('#cn-nd-val');
  const naValEl = container.querySelector('#cn-na-val');
  const nStatEl = container.querySelector('#cn-n-stat');
  const pStatEl = container.querySelector('#cn-p-stat');
  const posStatEl = container.querySelector('#cn-pos-stat');
  const negStatEl = container.querySelector('#cn-neg-stat');
  const rhoStatEl = container.querySelector('#cn-rho-stat');

  const btnIntrinsic = container.querySelector('#cn-btn-intrinsic');
  const btnNType = container.querySelector('#cn-btn-ntype');
  const btnPType = container.querySelector('#cn-btn-ptype');
  const btnComp = container.querySelector('#cn-btn-comp');
  const allBtns = [btnIntrinsic, btnNType, btnPType, btnComp];

  let nD = 0; // x 10^15 cm^-3
  let nA = 0; // x 10^15 cm^-3
  const ni = 1.5e10; // intrinsic carrier density in cm^-3

  // Lattice boundaries on canvas
  const latX = 12;
  const latY = 12;
  const latW = 330;
  const latH = 206;

  // Particle models
  // Fixed dopant ion positions (up to 20 spots in lattice)
  const gridPositions = [];
  const cols = 5;
  const rows = 4;
  const spacingX = (latW - 40) / (cols - 1);
  const spacingY = (latH - 40) / (rows - 1);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gridPositions.push({
        x: latX + 20 + c * spacingX,
        y: latY + 20 + r * spacingY
      });
    }
  }

  // Shuffle grid positions to place dopants randomly
  const dopantSlots = [...gridPositions].sort(() => Math.random() - 0.5);

  // Mobile particles array
  let mobileCarriers = [];

  function createCarrier(type) {
    return {
      type: type, // 'electron' or 'hole'
      x: latX + 15 + Math.random() * (latW - 30),
      y: latY + 15 + Math.random() * (latH - 30),
      vx: (Math.random() - 0.5) * (type === 'electron' ? 2.8 : 2.0),
      vy: (Math.random() - 0.5) * (type === 'electron' ? 2.8 : 2.0),
      color: type === 'electron' ? '#00f2fe' : '#ff9e00'
    };
  }

  function updatePhysics() {
    ndValEl.textContent = nD.toFixed(1);
    naValEl.textContent = nA.toFixed(1);

    const ND_val = nD * 1e15;
    const NA_val = nA * 1e15;
    const netDoping = ND_val - NA_val;

    let n = 0;
    let p = 0;

    if (netDoping >= 0) {
      n = (netDoping + Math.sqrt(netDoping * netDoping + 4 * ni * ni)) / 2;
      p = (ni * ni) / n;
    } else {
      const pDoping = -netDoping;
      p = (pDoping + Math.sqrt(pDoping * pDoping + 4 * ni * ni)) / 2;
      n = (ni * ni) / p;
    }

    const totalPos = p + ND_val;
    const totalNeg = n + NA_val;

    function formatDensity(val) {
      if (val >= 1e15) {
        return (val / 1e15).toFixed(2) + ' × 10¹⁵ cm⁻³';
      } else if (val >= 1e12) {
        return (val / 1e12).toFixed(2) + ' × 10¹² cm⁻³';
      } else if (val >= 1e9) {
        return (val / 1e10).toFixed(2) + ' × 10¹⁰ cm⁻³';
      } else if (val >= 1e4) {
        return (val / 1e4).toFixed(2) + ' × 10⁴ cm⁻³';
      } else {
        return val.toExponential(2) + ' cm⁻³';
      }
    }

    nStatEl.textContent = formatDensity(n);
    pStatEl.textContent = formatDensity(p);
    posStatEl.textContent = formatDensity(totalPos);
    negStatEl.textContent = formatDensity(totalNeg);
    rhoStatEl.textContent = '0.00 C/cm³ [STRICTLY NEUTRAL]';

    // Desired visual carrier count
    let targetElectrons = Math.round(10 + nD * 1.5 - (nA * 0.4));
    let targetHoles = Math.round(10 + nA * 1.5 - (nD * 0.4));

    if (nD > 2 && nA === 0) targetHoles = Math.max(1, Math.round(10 / (nD * 2)));
    if (nA > 2 && nD === 0) targetElectrons = Math.max(1, Math.round(10 / (nA * 2)));

    targetElectrons = Math.max(1, Math.min(38, targetElectrons));
    targetHoles = Math.max(1, Math.min(38, targetHoles));

    // Reconcile electron population
    const currElectrons = mobileCarriers.filter(c => c.type === 'electron');
    const currHoles = mobileCarriers.filter(c => c.type === 'hole');

    if (currElectrons.length < targetElectrons) {
      for (let i = currElectrons.length; i < targetElectrons; i++) {
        mobileCarriers.push(createCarrier('electron'));
      }
    } else if (currElectrons.length > targetElectrons) {
      let removeCount = currElectrons.length - targetElectrons;
      mobileCarriers = mobileCarriers.filter(c => {
        if (c.type === 'electron' && removeCount > 0) {
          removeCount--;
          return false;
        }
        return true;
      });
    }

    if (currHoles.length < targetHoles) {
      for (let i = currHoles.length; i < targetHoles; i++) {
        mobileCarriers.push(createCarrier('hole'));
      }
    } else if (currHoles.length > targetHoles) {
      let removeCount = currHoles.length - targetHoles;
      mobileCarriers = mobileCarriers.filter(c => {
        if (c.type === 'hole' && removeCount > 0) {
          removeCount--;
          return false;
        }
        return true;
      });
    }
  }

  // Preset button listeners
  function setPreset(activeBtn, dVal, aVal) {
    allBtns.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
    nD = dVal;
    nA = aVal;
    ndSlider.value = dVal;
    naSlider.value = aVal;
    updatePhysics();
  }

  btnIntrinsic.addEventListener('click', () => setPreset(btnIntrinsic, 0, 0));
  btnNType.addEventListener('click', () => setPreset(btnNType, 12, 0));
  btnPType.addEventListener('click', () => setPreset(btnPType, 0, 12));
  btnComp.addEventListener('click', () => setPreset(btnComp, 15, 7));

  ndSlider.addEventListener('input', (e) => {
    allBtns.forEach(b => b.classList.remove('active'));
    nD = parseFloat(e.target.value);
    updatePhysics();
  });

  naSlider.addEventListener('input', (e) => {
    allBtns.forEach(b => b.classList.remove('active'));
    nA = parseFloat(e.target.value);
    updatePhysics();
  });

  // Initial population (Intrinsic)
  mobileCarriers = [];
  for (let i = 0; i < 10; i++) {
    mobileCarriers.push(createCarrier('electron'));
    mobileCarriers.push(createCarrier('hole'));
  }
  updatePhysics();

  let animId;
  let pulseTimer = 0;

  function render() {
    pulseTimer += 0.04;
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ==========================================
    // 1. LEFT PANEL: CRYSTAL LATTICE REGION
    // ==========================================
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1;
    ctx.strokeRect(latX, latY, latW, latH);
    ctx.fillStyle = 'rgba(7, 13, 27, 0.7)';
    ctx.fillRect(latX, latY, latW, latH);

    // Lattice Header
    ctx.fillStyle = 'rgba(0, 242, 254, 0.85)';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SEMICONDUCTOR CRYSTAL LATTICE (Si)', latX + 8, latY + 14);

    // Draw Silicon Covalent Grid Bonds
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let c = 0; c < cols; c++) {
      const gx = latX + 20 + c * spacingX;
      ctx.beginPath();
      ctx.moveTo(gx, latY + 15);
      ctx.lineTo(gx, latY + latH - 15);
      ctx.stroke();
    }
    for (let r = 0; r < rows; r++) {
      const gy = latY + 20 + r * spacingY;
      ctx.beginPath();
      ctx.moveTo(latX + 15, gy);
      ctx.lineTo(latX + latW - 15, gy);
      ctx.stroke();
    }

    // Draw neutral silicon atomic nodes
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    gridPositions.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Fixed Donor Ions (N_D+)
    const numDrawnDonors = Math.min(dopantSlots.length, Math.round(nD * 0.9));
    for (let i = 0; i < numDrawnDonors; i++) {
      const slot = dopantSlots[i];
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 180, 216, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#00b4d8';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#00b4d8';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('+', slot.x, slot.y);

      ctx.fillStyle = '#00b4d8';
      ctx.font = '7px monospace';
      ctx.fillText('ND⁺', slot.x, slot.y - 12);
    }

    // Draw Fixed Acceptor Ions (N_A-)
    const numDrawnAcceptors = Math.min(dopantSlots.length - numDrawnDonors, Math.round(nA * 0.9));
    for (let i = 0; i < numDrawnAcceptors; i++) {
      const slot = dopantSlots[dopantSlots.length - 1 - i];
      ctx.beginPath();
      ctx.arc(slot.x, slot.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(217, 70, 239, 0.25)';
      ctx.fill();
      ctx.strokeStyle = '#d946ef';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = '#d946ef';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('–', slot.x, slot.y);

      ctx.fillStyle = '#d946ef';
      ctx.font = '7px monospace';
      ctx.fillText('NA⁻', slot.x, slot.y - 12);
    }

    // Move and Draw Mobile Carriers (Electrons & Holes)
    mobileCarriers.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;

      // Bounce off lattice walls
      if (c.x < latX + 8) { c.x = latX + 8; c.vx *= -1; }
      if (c.x > latX + latW - 8) { c.x = latX + latW - 8; c.vx *= -1; }
      if (c.y < latY + 22) { c.y = latY + 22; c.vy *= -1; }
      if (c.y > latY + latH - 8) { c.y = latY + latH - 8; c.vy *= -1; }

      ctx.beginPath();
      ctx.arc(c.x, c.y, c.type === 'electron' ? 4 : 4.5, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#050b14';
      ctx.font = 'bold 7px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.type === 'electron' ? '–' : '+', c.x, c.y);
    });

    // Legend on bottom of lattice panel
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00f2fe';
    ctx.fillText('● e⁻', latX + 10, latY + latH - 6);
    ctx.fillStyle = '#ff9e00';
    ctx.fillText('● h⁺', latX + 50, latY + latH - 6);
    ctx.fillStyle = '#00b4d8';
    ctx.fillText('⊕ ND⁺', latX + 90, latY + latH - 6);
    ctx.fillStyle = '#d946ef';
    ctx.fillText('⊖ NA⁻', latX + 140, latY + latH - 6);

    // ==========================================
    // 2. RIGHT PANEL: CHARGE BALANCE SCALE
    // ==========================================
    const scX = 352;
    const scY = 12;
    const scW = 196;
    const scH = 206;

    ctx.strokeStyle = 'rgba(0, 255, 170, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(scX, scY, scW, scH);
    ctx.fillStyle = 'rgba(7, 14, 30, 0.85)';
    ctx.fillRect(scX, scY, scW, scH);

    // Scale Header
    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CHARGE BALANCE GAUGE', scX + scW / 2, scY + 14);

    // Neutrality Equation Tag
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('p + ND⁺  =  n + NA⁻', scX + scW / 2, scY + 30);

    // Center laser balance indicator beam
    const beamY = scY + 95;
    ctx.strokeStyle = 'rgba(0, 255, 170, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(scX + 18, beamY);
    ctx.lineTo(scX + scW - 18, beamY);
    ctx.stroke();

    // Fulcrum triangle in center
    ctx.fillStyle = '#00ffaa';
    ctx.beginPath();
    ctx.moveTo(scX + scW / 2, beamY);
    ctx.lineTo(scX + scW / 2 - 8, beamY + 14);
    ctx.lineTo(scX + scW / 2 + 8, beamY + 14);
    ctx.closePath();
    ctx.fill();

    // Dual Balance Columns: Left (Positives) vs Right (Negatives)
    const colW = 48;
    const maxBarH = 50;
    const leftColX = scX + 22;
    const rightColX = scX + scW - 22 - colW;

    // Normalizing bar height (both are always mathematically equal!)
    const totalChargeUnits = Math.max(1, nD + nA + (nD === 0 && nA === 0 ? 2 : 0));
    const normalizedH = Math.min(maxBarH, 18 + (totalChargeUnits / 20) * (maxBarH - 18));

    // Left Column: Total Positive = p (amber) + ND+ (cyan-blue)
    const pFrac = (nD === 0 && nA === 0) ? 1.0 : (nD > nA ? 0.05 : 0.95);
    const pBarH = normalizedH * pFrac;
    const ndBarH = normalizedH * (1 - pFrac);

    // Draw Left Positive Bar
    ctx.fillStyle = '#ff9e00';
    ctx.fillRect(leftColX, beamY - pBarH, colW, pBarH);
    if (ndBarH > 0) {
      ctx.fillStyle = '#00b4d8';
      ctx.fillRect(leftColX, beamY - pBarH - ndBarH, colW, ndBarH);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(leftColX, beamY - normalizedH, colW, normalizedH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Σ (+)', leftColX + colW / 2, beamY - normalizedH - 5);
    ctx.fillStyle = '#00ffaa';
    ctx.font = '7px monospace';
    ctx.fillText('p + ND⁺', leftColX + colW / 2, beamY + 12);

    // Right Column: Total Negative = n (cyan) + NA- (purple)
    const nFrac = (nD === 0 && nA === 0) ? 1.0 : (nA > nD ? 0.05 : 0.95);
    const nBarH = normalizedH * nFrac;
    const naBarH = normalizedH * (1 - nFrac);

    // Draw Right Negative Bar
    ctx.fillStyle = '#00f2fe';
    ctx.fillRect(rightColX, beamY - nBarH, colW, nBarH);
    if (naBarH > 0) {
      ctx.fillStyle = '#d946ef';
      ctx.fillRect(rightColX, beamY - nBarH - naBarH, colW, naBarH);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(rightColX, beamY - normalizedH, colW, normalizedH);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Σ (–)', rightColX + colW / 2, beamY - normalizedH - 5);
    ctx.fillStyle = '#00ffaa';
    ctx.font = '7px monospace';
    ctx.fillText('n + NA⁻', rightColX + colW / 2, beamY + 12);

    // Glowing Laser Equilibrium Line across tops of both bars
    ctx.strokeStyle = '#00ffaa';
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 6;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(leftColX, beamY - normalizedH);
    ctx.lineTo(rightColX + colW, beamY - normalizedH);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Status Pill on lower half of Scale Card
    const statusY = scY + scH - 52;
    ctx.fillStyle = 'rgba(0, 255, 170, 0.08)';
    ctx.strokeStyle = 'rgba(0, 255, 170, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(scX + 12, statusY, scW - 24, 44);
    ctx.fillRect(scX + 12, statusY, scW - 24, 44);

    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    const pulseDot = Math.sin(pulseTimer * 3) > 0 ? '●' : '○';
    ctx.fillText(`${pulseDot} MACROSCOPIC NEUTRALITY`, scX + scW / 2, statusY + 12);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('NET CHARGE ρ = 0.00 C/cm³', scX + scW / 2, statusY + 24);

    ctx.fillStyle = 'rgba(0, 242, 254, 0.9)';
    ctx.font = '7.5px monospace';
    ctx.fillText('Q_pos strictly equals Q_neg', scX + scW / 2, statusY + 36);

    animId = requestAnimationFrame(render);
  }

  render();

  return {
    destroy: () => cancelAnimationFrame(animId)
  };
}



