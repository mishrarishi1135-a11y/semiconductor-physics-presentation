import * as THREE from 'three';

export class ThreeScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x040814, 0.035);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 18);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.chipGroup = new THREE.Group();
    this.latticeGroup = new THREE.Group();
    this.targetCameraPos = { x: 0, y: 0, z: 18 };
    this.targetChipPos = { x: 4.5, y: 0, z: 0 };
    this.targetChipScale = 1.0;

    this.initLights();
    this.buildSiliconChip();
    this.buildCrystalLattice();
    this.buildParticleField();

    this.scene.add(this.chipGroup);
    this.scene.add(this.latticeGroup);

    this.setupEvents();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5);
    this.scene.add(ambientLight);

    // Cyan key light
    this.cyanLight = new THREE.PointLight(0x00f2fe, 80, 50);
    this.cyanLight.position.set(10, 8, 12);
    this.scene.add(this.cyanLight);

    // Electric purple fill light
    this.purpleLight = new THREE.PointLight(0x7928ca, 60, 50);
    this.purpleLight.position.set(-10, -8, 8);
    this.scene.add(this.purpleLight);

    // Top neon accent
    const topLight = new THREE.DirectionalLight(0x4facfe, 2.0);
    topLight.position.set(0, 15, 10);
    this.scene.add(topLight);
  }

  buildSiliconChip() {
    // 1. Ceramic package body
    const packageGeo = new THREE.BoxGeometry(7, 0.6, 7);
    const packageMat = new THREE.MeshStandardMaterial({
      color: 0x08111e,
      roughness: 0.35,
      metalness: 0.85
    });
    const packageMesh = new THREE.Mesh(packageGeo, packageMat);
    this.chipGroup.add(packageMesh);

    // 2. Beveled substrate edge
    const edgeGeo = new THREE.BoxGeometry(7.1, 0.2, 7.1);
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x005577,
      roughness: 0.2,
      metalness: 0.9
    });
    const edgeMesh = new THREE.Mesh(edgeGeo, edgeMat);
    edgeMesh.position.y = 0.25;
    this.chipGroup.add(edgeMesh);

    // 3. Central Silicon Die (Polished mirror with circuit patterns)
    const dieGeo = new THREE.BoxGeometry(3.6, 0.3, 3.6);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.1,
      metalness: 0.95
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    dieMesh.position.y = 0.45;
    this.chipGroup.add(dieMesh);

    // 4. Glowing Micro-circuit Core (grid on top of die)
    const gridGeo = new THREE.PlaneGeometry(3.3, 3.3, 16, 16);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = 0.61;
    this.chipGroup.add(gridMesh);

    // 5. Silicon Wafer Pattern / Core Emblem
    const coreGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.05, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00aacc,
      roughness: 0.2,
      metalness: 0.9
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 0.63;
    this.chipGroup.add(coreMesh);

    // 6. Perimeter Golden Pins (BGA/QFP leads)
    const pinGeo = new THREE.BoxGeometry(0.2, 0.12, 1.2);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.2
    });

    const numPinsPerSide = 12;
    const pinSpacing = 6.0 / (numPinsPerSide - 1);

    for (let i = 0; i < numPinsPerSide; i++) {
      const offset = -3.0 + i * pinSpacing;

      // North side
      const pinN = new THREE.Mesh(pinGeo, pinMat);
      pinN.position.set(offset, 0, -3.9);
      this.chipGroup.add(pinN);

      // South side
      const pinS = new THREE.Mesh(pinGeo, pinMat);
      pinS.position.set(offset, 0, 3.9);
      this.chipGroup.add(pinS);

      // East side
      const pinE = new THREE.Mesh(pinGeo, pinMat);
      pinE.rotation.y = Math.PI / 2;
      pinE.position.set(3.9, 0, offset);
      this.chipGroup.add(pinE);

      // West side
      const pinW = new THREE.Mesh(pinGeo, pinMat);
      pinW.rotation.y = Math.PI / 2;
      pinW.position.set(-3.9, 0, offset);
      this.chipGroup.add(pinW);
    }

    // 7. Holographic Wire Bonds (Curved tubes from die to package)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      wireframe: false,
      transparent: true,
      opacity: 0.7
    });

    for (let j = -1.2; j <= 1.2; j += 0.4) {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(j, 0.6, 1.5),
        new THREE.Vector3(j * 1.3, 1.4, 2.5),
        new THREE.Vector3(j * 1.6, 0.4, 3.2)
      );
      const tubeGeo = new THREE.TubeGeometry(curve, 16, 0.03, 6, false);
      const tube = new THREE.Mesh(tubeGeo, wireMat);
      this.chipGroup.add(tube);
    }

    // Initial orientation: isometric view
    this.chipGroup.rotation.x = 0.55;
    this.chipGroup.rotation.y = -0.65;
    this.chipGroup.position.set(0.2, -0.6, -3.5);
  }

  buildCrystalLattice() {
    // Diamond cubic lattice representation: Silicon atoms and covalent bonds
    const atomGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const atomMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x004466,
      roughness: 0.3,
      metalness: 0.8
    });

    const bondMat = new THREE.MeshBasicMaterial({
      color: 0x00a3ff,
      transparent: true,
      opacity: 0.3
    });

    const positions = [];
    const size = 3;
    const spacing = 1.8;

    for (let x = -size; x <= size; x++) {
      for (let y = -size; y <= size; y++) {
        for (let z = -size; z <= size; z++) {
          if ((x + y + z) % 2 === 0 && Math.random() > 0.4) {
            positions.push(new THREE.Vector3(x * spacing, y * spacing, z * spacing));
          }
        }
      }
    }

    positions.forEach((pos) => {
      const atom = new THREE.Mesh(atomGeo, atomMat);
      atom.position.copy(pos);
      this.latticeGroup.add(atom);
    });

    // Add some random bonds between adjacent nodes
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < spacing * 1.5) {
          const points = [positions[i], positions[j]];
          const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeo, bondMat);
          this.latticeGroup.add(line);
        }
      }
    }

    this.latticeGroup.position.set(0, 0, -12);
  }

  buildParticleField() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      // Cyan electrons and amber holes
      if (Math.random() > 0.4) {
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.95;
        colors[i * 3 + 2] = 1.0;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.65;
        colors[i * 3 + 2] = 0.2;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  setupEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  updateForSlide(slideIndex, totalSlides) {
    if (slideIndex === 0) {
      // Hero landing slide: 3D microchip centered in depth behind content
      this.targetCameraPos = { x: 0, y: 0, z: 18 };
      this.targetChipPos = { x: 0.2, y: -0.6, z: -3.5 };
      this.targetChipScale = 1.15;
      this.latticeGroup.visible = true;
    } else if (slideIndex === totalSlides - 1) {
      // Thank You slide: centered floating chip
      this.targetCameraPos = { x: 0, y: 0, z: 17 };
      this.targetChipPos = { x: 0, y: 1.2, z: 0 };
      this.targetChipScale = 1.4;
      this.latticeGroup.visible = true;
    } else {
      // Content slides: subtle background ambient position
      this.targetCameraPos = { x: 0, y: 0, z: 22 };
      this.targetChipPos = { x: 12, y: -4, z: -10 };
      this.targetChipScale = 0.8;
      this.latticeGroup.visible = true;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    // Smooth mouse lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth camera position
    this.camera.position.x += (this.targetCameraPos.x + this.mouse.x * 1.5 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetCameraPos.y + this.mouse.y * 1.5 - this.camera.position.y) * 0.05;
    this.camera.position.z += (this.targetCameraPos.z - this.camera.position.z) * 0.05;

    // Chip position and scale lerp
    this.chipGroup.position.x += (this.targetChipPos.x - this.chipGroup.position.x) * 0.05;
    this.chipGroup.position.y += (this.targetChipPos.y - this.chipGroup.position.y) * 0.05;
    this.chipGroup.position.z += (this.targetChipPos.z - this.chipGroup.position.z) * 0.05;

    const currentScale = this.chipGroup.scale.x;
    const newScale = currentScale + (this.targetChipScale - currentScale) * 0.05;
    this.chipGroup.scale.set(newScale, newScale, newScale);

    // Subtle continuous rotations
    this.chipGroup.rotation.y += 0.004;
    this.chipGroup.rotation.x = 0.55 + this.mouse.y * 0.2;
    this.chipGroup.rotation.z = this.mouse.x * 0.15;

    this.latticeGroup.rotation.y -= 0.0015;
    this.latticeGroup.rotation.x += 0.0008;

    if (this.particles) {
      this.particles.rotation.y += 0.0005;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
