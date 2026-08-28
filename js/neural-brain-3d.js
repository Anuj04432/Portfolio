/**
 * ANUJ WAGMORE - 3D NEURAL BRAIN & AMBIENT COSMOS PARTICLE SYSTEM (Three.js)
 * Full-viewport immersive 3D particle brain with wide ambient stardust field,
 * synaptic line network, traveling signal pulses, entrance assembly, and responsive scaling.
 */

(function () {
  // Wait for DOM & Three.js to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initScene);
  } else {
    initScene();
  }

  function initScene() {
    if (typeof THREE === "undefined") {
      console.warn("Three.js not loaded. Retrying in 100ms...");
      setTimeout(initScene, 100);
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    // Palette Color Tokens
    const colorGradA = new THREE.Color("#6C63FF"); // Indigo-Violet
    const colorGradB = new THREE.Color("#36D1DC"); // Cyan-Teal
    const colorGradC = new THREE.Color("#B14AFF"); // Magenta-Violet

    // Canvas & Container
    let canvas = document.getElementById("neuralBrain3D");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "neuralBrain3D";
      canvas.className = "neural-brain-3d-canvas";
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    // 1. Renderer Setup (Full Viewport, Transparent)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // 2. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.3, 7.2);

    // Main Brain Group (for rotation & parallax)
    const brainGroup = new THREE.Group();
    // Default 3/4 isometric perspective angle
    brainGroup.rotation.x = 0.18;
    brainGroup.rotation.y = -0.32;
    brainGroup.position.set(0, isMobile ? 0.2 : 0.25, 0);
    scene.add(brainGroup);

    // Ambient Stardust Scene Group (independent wide field)
    const ambientGroup = new THREE.Group();
    scene.add(ambientGroup);

    // 3. Generate Soft Circular Glow Particle Texture (runtime canvas)
    function createGlowSprite() {
      const size = 64;
      const tCanvas = document.createElement("canvas");
      tCanvas.width = size;
      tCanvas.height = size;
      const ctx = tCanvas.getContext("2d");

      const center = size / 2;
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.25, "rgba(255, 255, 255, 0.88)");
      gradient.addColorStop(0.55, "rgba(108, 99, 255, 0.5)");
      gradient.addColorStop(0.85, "rgba(54, 209, 220, 0.18)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(tCanvas);
      texture.needsUpdate = true;
      return texture;
    }

    const particleTexture = createGlowSprite();

    // 4. Brain Geometry & Dual-Lobe Point Generation (Scaled Up & Immersive)
    const totalPoints = isMobile ? 480 : 860;
    const targetPositions = new Float32Array(totalPoints * 3);
    const startPositions = new Float32Array(totalPoints * 3);
    const currentPositions = new Float32Array(totalPoints * 3);
    const pointColors = new Float32Array(totalPoints * 3);
    const pointDelays = new Float32Array(totalPoints);

    const nodesList = [];

    function generateBrainPoints() {
      let count = 0;
      const maxAttempts = 20000;
      let attempts = 0;

      while (count < totalPoints && attempts < maxAttempts) {
        attempts++;

        // Hemisphere selection: -1 for left, 1 for right
        const lobeSign = Math.random() < 0.5 ? -1 : 1;

        // Expanded Bounding Box for Immersion (larger dimensions)
        const x = (Math.random() * 2.1 + 0.1) * lobeSign;
        const y = Math.random() * 3.3 - 1.55;
        const z = Math.random() * 3.9 - 1.95;

        // Hemispheric ellipsoid equations
        const hCenterOffset = 1.02 * lobeSign;
        const dx = (x - hCenterOffset) / 1.55;
        const dy = (y + 0.05) / 1.68;
        const dz = z / 2.05;

        // Longitudinal fissure indent (gap between hemispheres)
        if (Math.abs(x) < 0.14) continue;

        // Frontal & occipital curvature
        let shapeDist = dx * dx + dy * dy + dz * dz;

        // Indent bottom temporal/cerebellum region
        if (y < -0.5 && z > 0.45) shapeDist *= 1.32;

        // Surface-biased rejection test (denser near cortex boundary for crisp silhouette)
        if (shapeDist <= 1.06) {
          const isSurface = shapeDist > 0.42 || Math.random() < 0.38;
          if (isSurface) {
            const idx = count * 3;

            // Target Final Coordinates (Brain Formation)
            targetPositions[idx] = x;
            targetPositions[idx + 1] = y;
            targetPositions[idx + 2] = z;

            // Scatter Coordinates (Initial Explosion on Large Outer Sphere)
            const scatterRadius = 9.5 + Math.random() * 8.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            startPositions[idx] = scatterRadius * Math.sin(phi) * Math.cos(theta);
            startPositions[idx + 1] = scatterRadius * Math.sin(phi) * Math.sin(theta);
            startPositions[idx + 2] = scatterRadius * Math.cos(phi);

            // Set Initial Positions
            if (prefersReducedMotion) {
              currentPositions[idx] = targetPositions[idx];
              currentPositions[idx + 1] = targetPositions[idx + 1];
              currentPositions[idx + 2] = targetPositions[idx + 2];
            } else {
              currentPositions[idx] = startPositions[idx];
              currentPositions[idx + 1] = startPositions[idx + 1];
              currentPositions[idx + 2] = startPositions[idx + 2];
            }

            // Per-particle Color Gradient (Indigo -> Teal -> Magenta highlights)
            const tColor = (y + 1.55) / 3.1;
            const pColor = new THREE.Color();
            pColor.lerpColors(colorGradA, colorGradB, THREE.MathUtils.clamp(tColor, 0, 1));

            // Rare highlight neurons (~6.5% tinted magenta)
            if (Math.random() < 0.065) {
              pColor.copy(colorGradC);
            }

            pointColors[idx] = pColor.r;
            pointColors[idx + 1] = pColor.g;
            pointColors[idx + 2] = pColor.b;

            // Random delay for entrance animation (0 to 800ms)
            pointDelays[count] = Math.random() * 0.8;

            nodesList.push(new THREE.Vector3(x, y, z));
            count++;
          }
        }
      }
    }

    generateBrainPoints();

    // 5. Core Brain Particles Object
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.32 : 0.42,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.78,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    brainGroup.add(particles);

    // 6. Synaptic Neural Line Network (LineSegments)
    const lineIndices = [];
    const maxLineDist = isMobile ? 0.88 : 0.98;
    const maxLines = isMobile ? 380 : 750;
    const edgesArray = [];

    for (let i = 0; i < nodesList.length; i++) {
      for (let j = i + 1; j < nodesList.length; j++) {
        if (edgesArray.length >= maxLines) break;

        const dist = nodesList[i].distanceTo(nodesList[j]);
        // Do not connect across fissure unless near corpus callosum center
        const crossLobe = nodesList[i].x * nodesList[j].x < 0;
        const validBridge = !crossLobe || (dist < 0.55 && Math.abs(nodesList[i].y) < 0.35);

        if (dist < maxLineDist && validBridge) {
          lineIndices.push(i, j);
          edgesArray.push({
            p1: nodesList[i],
            p2: nodesList[j],
            dist: dist
          });
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    linesGeometry.setIndex(lineIndices);

    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x6C63FF,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    brainGroup.add(lines);

    // 7. Ambient Wide-Field Particles (Edge-to-Edge Full-Screen Atmosphere)
    const ambientCount = isMobile ? 220 : 450;
    const ambientPositions = new Float32Array(ambientCount * 3);
    const ambientBasePositions = new Float32Array(ambientCount * 3);
    const ambientColors = new Float32Array(ambientCount * 3);
    const ambientMotionData = [];

    for (let i = 0; i < ambientCount; i++) {
      const idx = i * 3;

      // Spread widely across camera frustum volume
      const ax = (Math.random() - 0.5) * 24.0;
      const ay = (Math.random() - 0.5) * 16.0;
      const az = (Math.random() - 0.5) * 10.0 - 1.5;

      ambientPositions[idx] = ax;
      ambientPositions[idx + 1] = ay;
      ambientPositions[idx + 2] = az;

      ambientBasePositions[idx] = ax;
      ambientBasePositions[idx + 1] = ay;
      ambientBasePositions[idx + 2] = az;

      // Color selection (Muted Indigo & Teal with rare Magenta)
      const rand = Math.random();
      const aColor = new THREE.Color();
      if (rand < 0.55) {
        aColor.copy(colorGradA);
      } else if (rand > 0.88) {
        aColor.copy(colorGradC);
      } else {
        aColor.copy(colorGradB);
      }

      ambientColors[idx] = aColor.r;
      ambientColors[idx + 1] = aColor.g;
      ambientColors[idx + 2] = aColor.b;

      ambientMotionData.push({
        speedX: 0.0006 + Math.random() * 0.0012,
        speedY: 0.0008 + Math.random() * 0.0014,
        speedZ: 0.0005 + Math.random() * 0.001,
        ampX: 0.35 + Math.random() * 0.65,
        ampY: 0.4 + Math.random() * 0.75,
        ampZ: 0.25 + Math.random() * 0.5,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2
      });
    }

    const ambientGeometry = new THREE.BufferGeometry();
    ambientGeometry.setAttribute("position", new THREE.BufferAttribute(ambientPositions, 3));
    ambientGeometry.setAttribute("color", new THREE.BufferAttribute(ambientColors, 3));

    const ambientMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.14 : 0.2,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: prefersReducedMotion ? 0.28 : 0.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const ambientParticles = new THREE.Points(ambientGeometry, ambientMaterial);
    ambientGroup.add(ambientParticles);

    // 8. Periodic Traveling 3D Signal Pulses (Core Brain Synapses)
    const maxSignals = isMobile ? 3 : 6;
    const activeSignals = [];

    const signalSpriteMaterial = new THREE.SpriteMaterial({
      map: particleTexture,
      color: 0x36D1DC,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    function spawnSignal() {
      if (!edgesArray.length || activeSignals.length >= maxSignals || prefersReducedMotion) return;

      const edge = edgesArray[Math.floor(Math.random() * edgesArray.length)];
      const sprite = new THREE.Sprite(signalSpriteMaterial.clone());

      const rand = Math.random();
      if (rand < 0.55) {
        sprite.material.color.set("#36D1DC"); // Teal
      } else if (rand > 0.85) {
        sprite.material.color.set("#B14AFF"); // Magenta
      } else {
        sprite.material.color.set("#6C63FF"); // Indigo
      }

      const scale = 0.26 + Math.random() * 0.14;
      sprite.scale.set(scale, scale, scale);
      brainGroup.add(sprite);

      const reverse = Math.random() > 0.5;

      activeSignals.push({
        sprite: sprite,
        start: reverse ? edge.p2 : edge.p1,
        end: reverse ? edge.p1 : edge.p2,
        progress: 0,
        speed: 0.011 + Math.random() * 0.016
      });
    }

    // 9. Entrance Animation & Responsive Viewport Scaling
    const animationStartTime = performance.now();
    let entranceComplete = prefersReducedMotion;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function updateResponsiveScale() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspect = width / height;

      // Adjust scale & camera distance dynamically so brain fills ~75-85% of screen
      let brainScale = 1.45;

      if (aspect >= 1.6) {
        // Ultrawide / Large Desktop
        brainScale = 1.75;
        camera.position.set(0, 0.2, 7.0);
      } else if (aspect >= 1.0) {
        // Standard Laptop / Desktop
        brainScale = 1.55;
        camera.position.set(0, 0.25, 7.2);
      } else if (aspect >= 0.7) {
        // Tablet / Foldable
        brainScale = 1.35;
        camera.position.set(0, 0.35, 7.8);
      } else {
        // Mobile Portrait
        brainScale = 1.15;
        camera.position.set(0, 0.45, 8.2);
      }

      brainGroup.scale.set(brainScale, brainScale, brainScale);
    }

    // 10. Mouse Parallax Controller
    let targetRotationX = 0.18;
    let targetRotationY = -0.32;
    let currentRotationX = 0.18;
    let currentRotationY = -0.32;

    window.addEventListener("mousemove", (e) => {
      if (prefersReducedMotion) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = -0.32 + normX * 0.22;
      targetRotationX = 0.18 - normY * 0.14;
    }, { passive: true });

    // 11. Animation & Render Loop
    let lastSignalSpawn = 0;
    let isRendering = true;
    let reqId = null;

    function animate(currentTime) {
      if (!isRendering) return;

      const elapsed = (currentTime - animationStartTime) / 1000;

      // A. Entrance Animation Interpolation (Core Brain Assembly)
      if (!entranceComplete) {
        let allDone = true;
        const positions = particlesGeometry.attributes.position.array;

        for (let i = 0; i < totalPoints; i++) {
          const idx = i * 3;
          const delay = pointDelays[i];
          const pointElapsed = Math.max(0, elapsed - delay);
          const duration = 1.45;
          const t = Math.min(pointElapsed / duration, 1);

          if (t < 1) allDone = false;

          const easeT = easeOutCubic(t);

          positions[idx] = startPositions[idx] + (targetPositions[idx] - startPositions[idx]) * easeT;
          positions[idx + 1] = startPositions[idx + 1] + (targetPositions[idx + 1] - startPositions[idx + 1]) * easeT;
          positions[idx + 2] = startPositions[idx + 2] + (targetPositions[idx + 2] - startPositions[idx + 2]) * easeT;
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        linesGeometry.attributes.position.needsUpdate = true;

        // Ambient field fade-in (0 -> 0.28)
        ambientMaterial.opacity = Math.min((elapsed / 1.4) * 0.28, 0.28);

        if (allDone && elapsed > 2.4) {
          entranceComplete = true;
          ambientMaterial.opacity = 0.28;
        }
      }

      // B. Ambient Field Gentle Floating Drift
      if (!prefersReducedMotion) {
        const ambPositions = ambientGeometry.attributes.position.array;
        const timeSec = currentTime * 0.001;

        for (let i = 0; i < ambientCount; i++) {
          const idx = i * 3;
          const m = ambientMotionData[i];

          ambPositions[idx] = ambientBasePositions[idx] + Math.sin(timeSec * m.speedX * 1000 + m.phaseX) * m.ampX;
          ambPositions[idx + 1] = ambientBasePositions[idx + 1] + Math.cos(timeSec * m.speedY * 1000 + m.phaseY) * m.ampY;
          ambPositions[idx + 2] = ambientBasePositions[idx + 2] + Math.sin(timeSec * m.speedZ * 1000 + m.phaseZ) * m.ampZ;
        }

        ambientGeometry.attributes.position.needsUpdate = true;
      }

      // C. Core Brain Idle Rotation & Parallax Smooth Lerp
      if (!prefersReducedMotion) {
        targetRotationY += 0.0008; // Continuous slow idle spin

        currentRotationX += (targetRotationX - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;

        brainGroup.rotation.x = currentRotationX;
        brainGroup.rotation.y = currentRotationY;
      }

      // D. Update 3D Traveling Signals
      if (currentTime - lastSignalSpawn > 280) {
        if (Math.random() < 0.65) {
          spawnSignal();
        }
        lastSignalSpawn = currentTime;
      }

      for (let i = activeSignals.length - 1; i >= 0; i--) {
        const sig = activeSignals[i];
        sig.progress += sig.speed;

        if (sig.progress >= 1) {
          brainGroup.remove(sig.sprite);
          sig.sprite.material.dispose();
          activeSignals.splice(i, 1);
          continue;
        }

        const curX = THREE.MathUtils.lerp(sig.start.x, sig.end.x, sig.progress);
        const curY = THREE.MathUtils.lerp(sig.start.y, sig.end.y, sig.progress);
        const curZ = THREE.MathUtils.lerp(sig.start.z, sig.end.z, sig.progress);

        sig.sprite.position.set(curX, curY, curZ);
        sig.sprite.material.opacity = Math.sin(sig.progress * Math.PI) * 0.95;
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    }

    // 12. Lifecycle & Performance Management
    function startLoop() {
      if (!isRendering) {
        isRendering = true;
        reqId = requestAnimationFrame(animate);
      }
    }

    function stopLoop() {
      isRendering = false;
      if (reqId) {
        cancelAnimationFrame(reqId);
        reqId = null;
      }
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        stopLoop();
      } else {
        startLoop();
      }
    });

    // Resize Handler
    function onResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      updateResponsiveScale();
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onResize, 120);
    }, { passive: true });

    onResize();
    reqId = requestAnimationFrame(animate);
  }
})();
