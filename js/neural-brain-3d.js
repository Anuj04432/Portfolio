/**
 * ANUJ WAGMORE - 3D NEURAL BRAIN PARTICLE SYSTEM (Three.js)
 * High-performance ambient 3D particle brain with synaptic lines, traveling signal pulses,
 * assembly entrance animation, and mouse parallax.
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

    // 1. Renderer Setup
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
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0.5, 9.5);

    // Main Brain Group (for rotation & parallax)
    const brainGroup = new THREE.Group();
    // Default 3/4 isometric perspective angle
    brainGroup.rotation.x = 0.22;
    brainGroup.rotation.y = -0.35;
    brainGroup.position.set(0, isMobile ? 0.3 : 0.4, 0);
    scene.add(brainGroup);

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
      gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.85)");
      gradient.addColorStop(0.5, "rgba(108, 99, 255, 0.45)");
      gradient.addColorStop(0.8, "rgba(54, 209, 220, 0.15)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      const texture = new THREE.CanvasTexture(tCanvas);
      texture.needsUpdate = true;
      return texture;
    }

    const particleTexture = createGlowSprite();

    // 4. Brain Geometry & Dual-Lobe Point Generation
    const totalPoints = isMobile ? 420 : 780;
    const targetPositions = new Float32Array(totalPoints * 3);
    const startPositions = new Float32Array(totalPoints * 3);
    const currentPositions = new Float32Array(totalPoints * 3);
    const pointColors = new Float32Array(totalPoints * 3);
    const pointSizes = new Float32Array(totalPoints);
    const pointDelays = new Float32Array(totalPoints);

    // Dual-Lobe Rejection Sampling
    const nodesList = [];

    function generateBrainPoints() {
      let count = 0;
      const maxAttempts = 15000;
      let attempts = 0;

      while (count < totalPoints && attempts < maxAttempts) {
        attempts++;

        // Choose hemisphere: -1 for left lobe, 1 for right lobe
        const lobeSign = Math.random() < 0.5 ? -1 : 1;

        // Bounding box for single hemisphere
        const x = (Math.random() * 1.8 + 0.08) * lobeSign;
        const y = Math.random() * 2.8 - 1.3;
        const z = Math.random() * 3.4 - 1.7;

        // Hemispheric ellipsoid equation
        const hCenterOffset = 0.85 * lobeSign;
        const dx = (x - hCenterOffset) / 1.35;
        const dy = (y + 0.05) / 1.45;
        const dz = z / 1.75;

        // Longitudinal fissure indent (gap between hemispheres)
        if (Math.abs(x) < 0.12) continue;

        // Frontal & occipital tapering
        let shapeDist = dx * dx + dy * dy + dz * dz;

        // Indent bottom temporal/cerebellum region
        if (y < -0.4 && z > 0.4) shapeDist *= 1.3;

        // Surface-biased rejection test (denser near cortex surface for clear silhouette)
        if (shapeDist <= 1.05) {
          const isSurface = shapeDist > 0.45 || Math.random() < 0.35;
          if (isSurface) {
            const idx = count * 3;

            // Target Final Coordinates (Brain Formation)
            targetPositions[idx] = x;
            targetPositions[idx + 1] = y;
            targetPositions[idx + 2] = z;

            // Scatter Coordinates (Initial Explosion on Large Sphere)
            const scatterRadius = 8.5 + Math.random() * 6.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            startPositions[idx] = scatterRadius * Math.sin(phi) * Math.cos(theta);
            startPositions[idx + 1] = scatterRadius * Math.sin(phi) * Math.sin(theta);
            startPositions[idx + 2] = scatterRadius * Math.cos(phi);

            // If reduced motion, start directly at target
            if (prefersReducedMotion) {
              currentPositions[idx] = targetPositions[idx];
              currentPositions[idx + 1] = targetPositions[idx + 1];
              currentPositions[idx + 2] = targetPositions[idx + 2];
            } else {
              currentPositions[idx] = startPositions[idx];
              currentPositions[idx + 1] = startPositions[idx + 1];
              currentPositions[idx + 2] = startPositions[idx + 2];
            }

            // Per-particle Color Mapping across Palette
            const tColor = (y + 1.3) / 2.6; // Vertical gradient distribution
            const pColor = new THREE.Color();
            pColor.lerpColors(colorGradA, colorGradB, THREE.MathUtils.clamp(tColor, 0, 1));

            // Rare highlight neurons (~6% tinted magenta)
            if (Math.random() < 0.065) {
              pColor.copy(colorGradC);
            }

            pointColors[idx] = pColor.r;
            pointColors[idx + 1] = pColor.g;
            pointColors[idx + 2] = pColor.b;

            // Particle size variations
            pointSizes[count] = 0.16 + Math.random() * 0.14;

            // Random staggered delay for entrance animation (0 to 800ms)
            pointDelays[count] = Math.random() * 0.8;

            nodesList.push(new THREE.Vector3(x, y, z));
            count++;
          }
        }
      }
    }

    generateBrainPoints();

    // 5. Particles Object
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
    particlesGeometry.setAttribute("color", new THREE.BufferAttribute(pointColors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.22 : 0.28,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    brainGroup.add(particles);

    // 6. Synaptic Neural Connections (LineSegments)
    const lineIndices = [];
    const maxLineDist = isMobile ? 0.72 : 0.82;
    const maxLines = isMobile ? 320 : 650;
    const edgesArray = [];

    for (let i = 0; i < nodesList.length; i++) {
      for (let j = i + 1; j < nodesList.length; j++) {
        if (edgesArray.length >= maxLines) break;

        const dist = nodesList[i].distanceTo(nodesList[j]);
        // Do not connect across the longitudinal fissure unless near corpus callosum
        const crossLobe = nodesList[i].x * nodesList[j].x < 0;
        const validBridge = !crossLobe || (dist < 0.45 && Math.abs(nodesList[i].y) < 0.3);

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
      opacity: 0.11,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    brainGroup.add(lines);

    // 7. Periodic Traveling 3D Signal Pulses
    const maxSignals = isMobile ? 4 : 7;
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

      // Random color: Teal or Magenta or Indigo
      const rand = Math.random();
      if (rand < 0.55) {
        sprite.material.color.set("#36D1DC"); // Teal
      } else if (rand > 0.85) {
        sprite.material.color.set("#B14AFF"); // Magenta
      } else {
        sprite.material.color.set("#6C63FF"); // Indigo
      }

      const scale = 0.22 + Math.random() * 0.12;
      sprite.scale.set(scale, scale, scale);
      brainGroup.add(sprite);

      const reverse = Math.random() > 0.5;

      activeSignals.push({
        sprite: sprite,
        start: reverse ? edge.p2 : edge.p1,
        end: reverse ? edge.p1 : edge.p2,
        progress: 0,
        speed: 0.012 + Math.random() * 0.018
      });
    }

    // 8. Entrance Animation Controller
    let animationStartTime = performance.now();
    const entranceDuration = 2200; // 2.2s total assembly
    let entranceComplete = prefersReducedMotion;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    // 9. Mouse Parallax Controller
    let targetRotationX = 0.22;
    let targetRotationY = -0.35;
    let currentRotationX = 0.22;
    let currentRotationY = -0.35;

    window.addEventListener("mousemove", (e) => {
      if (prefersReducedMotion) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      // Subtle 6-degree range
      targetRotationY = -0.35 + normX * 0.22;
      targetRotationX = 0.22 - normY * 0.15;
    }, { passive: true });

    // 10. Animation & Render Loop
    let lastSignalSpawn = 0;
    let isRendering = true;
    let reqId = null;

    function animate(currentTime) {
      if (!isRendering) return;

      // A. Entrance Animation Interpolation
      if (!entranceComplete) {
        const elapsed = (currentTime - animationStartTime) / 1000;
        let allDone = true;

        const positions = particlesGeometry.attributes.position.array;

        for (let i = 0; i < totalPoints; i++) {
          const idx = i * 3;
          const delay = pointDelays[i];
          const pointElapsed = Math.max(0, elapsed - delay);
          const duration = 1.4; // individual travel time
          const t = Math.min(pointElapsed / duration, 1);

          if (t < 1) allDone = false;

          const easeT = easeOutCubic(t);

          positions[idx] = startPositions[idx] + (targetPositions[idx] - startPositions[idx]) * easeT;
          positions[idx + 1] = startPositions[idx + 1] + (targetPositions[idx + 1] - startPositions[idx + 1]) * easeT;
          positions[idx + 2] = startPositions[idx + 2] + (targetPositions[idx + 2] - startPositions[idx + 2]) * easeT;
        }

        particlesGeometry.attributes.position.needsUpdate = true;
        linesGeometry.attributes.position.needsUpdate = true;

        if (allDone && elapsed > 2.4) {
          entranceComplete = true;
        }
      }

      // B. Idle Rotation & Parallax Smooth Lerp
      if (!prefersReducedMotion) {
        // Continuous slow idle spin
        targetRotationY += 0.0009;

        currentRotationX += (targetRotationX - currentRotationX) * 0.05;
        currentRotationY += (targetRotationY - currentRotationY) * 0.05;

        brainGroup.rotation.x = currentRotationX;
        brainGroup.rotation.y = currentRotationY;
      }

      // C. Update 3D Traveling Signals
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

        // Interpolate along edge with sine bell curve for opacity/glow
        const curX = THREE.MathUtils.lerp(sig.start.x, sig.end.x, sig.progress);
        const curY = THREE.MathUtils.lerp(sig.start.y, sig.end.y, sig.progress);
        const curZ = THREE.MathUtils.lerp(sig.start.z, sig.end.z, sig.progress);

        sig.sprite.position.set(curX, curY, curZ);
        sig.sprite.material.opacity = Math.sin(sig.progress * Math.PI) * 0.95;
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    }

    // 11. Lifecycle & Performance Management
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

      // Reposition on smaller viewports
      brainGroup.position.y = width < 768 ? 0.3 : 0.4;
      camera.position.z = width < 768 ? 10.5 : 9.5;
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
