import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Navigation, Zap, Radio } from 'lucide-react';

const Warehouse3D = ({ onSelectSection, activeSection = null, height = '450px' }) => {
  const mountRef = useRef(null);
  const [selected, setSelected] = useState(activeSection);
  const [autoRotate, setAutoRotate] = useState(true);

  // Helper to create sharp text billboard textures
  const createTextTexture = (title, subtext = '', bgColor = '#00e5ff', textColor = '#000000') => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Rounded card background
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.roundRect(6, 6, 288, 88, 14);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Title Text
    ctx.fillStyle = textColor;
    ctx.font = 'bold 30px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 150, subtext ? 36 : 50);

    // Subtext
    if (subtext) {
      ctx.font = 'bold 18px "JetBrains Mono", monospace';
      ctx.fillText(subtext, 150, 68);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 600;
    const heightPx = mount.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080b10);

    // Perspective Camera angled to show the central spine and 3 horizontal tiers
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(16, 22, 18);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(12, 28, 16);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Concrete Warehouse Floor with Technical Grid
    const floorGeo = new THREE.PlaneGeometry(32, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0b0f15,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(32, 32, 0x00e5ff, 0x1b222c);
    grid.position.y = 0.01;
    scene.add(grid);

    // ==========================================
    // 1. ONE MAIN BLACK LINE (CENTRAL AGV SPINE)
    // Runs vertically along Z-axis (X = 0)
    // ==========================================
    const mainLineGroup = new THREE.Group();
    const mainTrackGeo = new THREE.PlaneGeometry(0.7, 18);
    const blackTapeMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
    const mainTrack = new THREE.Mesh(mainTrackGeo, blackTapeMat);
    mainTrack.rotation.x = -Math.PI / 2;
    mainTrack.position.set(0, 0.02, 0);
    mainLineGroup.add(mainTrack);

    // Glowing cyan edges on main line
    [-0.35, 0.35].forEach((offset) => {
      const edgeGeo = new THREE.PlaneGeometry(0.04, 18);
      const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.7 });
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.rotation.x = -Math.PI / 2;
      edge.position.set(offset, 0.025, 0);
      mainLineGroup.add(edge);
    });
    scene.add(mainLineGroup);

    // ==========================================
    // 2. HORIZONTAL BLACK BRANCH LINES AT 3 RFID TIERS
    // ==========================================
    const tiersZ = [
      { z: -6, id: 'RFID 1', label: 'RFID 1: Sec A | Sec B' },
      { z: 0, id: 'RFID 2', label: 'RFID 2: Sec C | Sec D' },
      { z: 6, id: 'RFID 3', label: 'RFID 3: Counter | Dock' }
    ];

    tiersZ.forEach((tier) => {
      // Horizontal cross line
      const crossTrackGeo = new THREE.PlaneGeometry(19, 0.7);
      const crossTrack = new THREE.Mesh(crossTrackGeo, blackTapeMat);
      crossTrack.rotation.x = -Math.PI / 2;
      crossTrack.position.set(0, 0.02, tier.z);
      scene.add(crossTrack);

      // Cyan edge guidelines
      [-0.35, 0.35].forEach((offsetZ) => {
        const hEdgeGeo = new THREE.PlaneGeometry(19, 0.04);
        const hEdgeMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.45 });
        const hEdge = new THREE.Mesh(hEdgeGeo, hEdgeMat);
        hEdge.rotation.x = -Math.PI / 2;
        hEdge.position.set(0, 0.025, tier.z + offsetZ);
        scene.add(hEdge);
      });
    });

    // ==========================================
    // 3. RFID CHECKPOINT SENSOR PADS (ON MAIN LINE)
    // RFID 1 (z = -6), RFID 2 (z = 0), RFID 3 (z = 6)
    // ==========================================
    const rfidColors = {
      'RFID 1': { hex: 0x00e5ff, str: '#00e5ff', text: '#000000' },
      'RFID 2': { hex: 0x10b981, str: '#10b981', text: '#000000' },
      'RFID 3': { hex: 0xf59e0b, str: '#f59e0b', text: '#000000' }
    };

    tiersZ.forEach((tier) => {
      const rfidGroup = new THREE.Group();
      rfidGroup.position.set(0, 0.03, tier.z);

      const color = rfidColors[tier.id];

      // RFID Base Pad
      const padGeo = new THREE.PlaneGeometry(1.6, 1.6);
      const padMat = new THREE.MeshBasicMaterial({
        color: 0x11161d,
        side: THREE.DoubleSide
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.rotation.x = -Math.PI / 2;
      rfidGroup.add(pad);

      // Glowing RFID ring
      const ringGeo = new THREE.RingGeometry(0.45, 0.7, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color.hex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.01;
      rfidGroup.add(ring);

      // Text Tag Billboard on floor
      const tagTexture = createTextTexture(tier.id, 'JUNCTION', color.str, color.text);
      const tagMat = new THREE.MeshBasicMaterial({ map: tagTexture, transparent: true });
      const tagGeo = new THREE.PlaneGeometry(1.4, 0.5);
      const tagMesh = new THREE.Mesh(tagGeo, tagMat);
      tagMesh.rotation.x = -Math.PI / 2;
      tagMesh.position.set(0, 0.02, 0);
      rfidGroup.add(tagMesh);

      scene.add(rfidGroup);
    });

    // ==========================================
    // 4. STORAGE SECTIONS & PALLETS (LEFT & RIGHT)
    // ==========================================
    const interactiveObjects = [];

    const createStorageSection = (name, colorHex, xPos, zPos, hasPackage = false, packageId = null, badgeBg = '#00e5ff') => {
      const sectionGroup = new THREE.Group();
      sectionGroup.position.set(xPos, 0, zPos);
      sectionGroup.name = name;

      // Outer colored zone boundary
      const zoneGeo = new THREE.PlaneGeometry(5.2, 3.8);
      const zoneMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide
      });
      const zone = new THREE.Mesh(zoneGeo, zoneMat);
      zone.rotation.x = -Math.PI / 2;
      zone.position.y = 0.04;
      sectionGroup.add(zone);

      // Sign Banner Billboard
      const bannerTexture = createTextTexture(name, hasPackage ? '1 PKG (EMPTY)' : 'READY', badgeBg, '#000000');
      const bannerMat = new THREE.MeshBasicMaterial({ map: bannerTexture, transparent: true });
      const bannerGeo = new THREE.PlaneGeometry(2.4, 0.8);
      const banner = new THREE.Mesh(bannerGeo, bannerMat);
      banner.position.set(0, 2.4, 0);
      sectionGroup.add(banner);

      // Steel storage rack posts
      const rackMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
      [-1.8, 1.8].forEach((px) => {
        [-1.2, 1.2].forEach((pz) => {
          const postGeo = new THREE.BoxGeometry(0.1, 2.2, 0.1);
          const post = new THREE.Mesh(postGeo, rackMat);
          post.position.set(px, 1.1, pz);
          sectionGroup.add(post);
        });
      });

      // Wooden Pallet Stand Base
      const palletMat = new THREE.MeshStandardMaterial({ color: 0x85582c, roughness: 0.9 });
      const palletBase = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 1.8), palletMat);
      palletBase.position.set(0, 0.35, 0);
      palletBase.castShadow = true;
      sectionGroup.add(palletBase);

      // Package Box (Prototype: Empty Box, max 1.0 kg)
      if (hasPackage) {
        const crateMat = new THREE.MeshStandardMaterial({ color: 0xb4824a, roughness: 0.7 });
        const crate = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 1.2), crateMat);
        crate.position.set(0, 0.88, 0);
        crate.castShadow = true;
        sectionGroup.add(crate);

        // QR sticker label on package
        const labelMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const label = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.5), labelMat);
        label.position.set(0, 1.34, 0);
        sectionGroup.add(label);
      }

      scene.add(sectionGroup);
      interactiveObjects.push(zone);
      zone.userData = { sectionName: name };
      return sectionGroup;
    };

    // --- TIER 1 (RFID 1 at Z = -6): LEFT = SECTION A, RIGHT = SECTION B ---
    createStorageSection('SECTION A', 0x00e5ff, -9.2, -6, true, 'PKG_A001', '#00e5ff');
    createStorageSection('SECTION B', 0xeab308, 9.2, -6, false, null, '#eab308');

    // --- TIER 2 (RFID 2 at Z = 0): LEFT = SECTION C, RIGHT = SECTION D ---
    createStorageSection('SECTION C', 0x10b981, -9.2, 0, true, 'PKG_C001', '#10b981');
    createStorageSection('SECTION D', 0xa855f7, 9.2, 0, false, null, '#a855f7');

    // --- TIER 3 (RFID 3 at Z = 6): LEFT = COUNTER, RIGHT = CHARGING DOCK ---
    createStorageSection('COUNTER', 0xf59e0b, -9.2, 6, false, null, '#f59e0b');

    // CHARGING DOCK POINT (Right of RFID 3 at X = 9.2, Z = 6)
    const dockGroup = new THREE.Group();
    dockGroup.position.set(9.2, 0, 6);
    dockGroup.name = 'CHARGING DOCK';

    const dockPadGeo = new THREE.BoxGeometry(4.2, 0.1, 3.2);
    const dockPadMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x054d31 });
    const dockPad = new THREE.Mesh(dockPadGeo, dockPadMat);
    dockPad.position.y = 0.05;
    dockGroup.add(dockPad);

    const coilGeo = new THREE.RingGeometry(0.4, 0.9, 24);
    const coilMat = new THREE.MeshBasicMaterial({ color: 0x00ff66, side: THREE.DoubleSide });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.rotation.x = -Math.PI / 2;
    coil.position.y = 0.11;
    dockGroup.add(coil);

    // Dock Billboard Sign
    const dockTexture = createTextTexture('CH01 DOCK', 'INDUCTION', '#10b981', '#000000');
    const dockBannerMat = new THREE.MeshBasicMaterial({ map: dockTexture, transparent: true });
    const dockBanner = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.8), dockBannerMat);
    dockBanner.position.set(0, 2.4, 0);
    dockGroup.add(dockBanner);

    scene.add(dockGroup);
    interactiveObjects.push(dockPad);
    dockPad.userData = { sectionName: 'CH01 CHARGING DOCK' };

    // ==========================================
    // 5. AUTONOMOUS ROBOT: RBT-01 (Navigating along main spine)
    // ==========================================
    const rbtGroup = new THREE.Group();
    const rbtBodyGeo = new THREE.BoxGeometry(1.2, 0.35, 1.0);
    const rbtBodyMat = new THREE.MeshStandardMaterial({ color: 0x11161d, metalness: 0.9, roughness: 0.2 });
    const rbt = new THREE.Mesh(rbtBodyGeo, rbtBodyMat);
    rbt.position.y = 0.25;
    rbtGroup.add(rbt);

    // Payload carton on RBT-01
    const pGeo = new THREE.BoxGeometry(0.7, 0.45, 0.6);
    const pMat = new THREE.MeshStandardMaterial({ color: 0xb4824a });
    const p = new THREE.Mesh(pGeo, pMat);
    p.position.y = 0.65;
    rbtGroup.add(p);

    // LED glow ring on RBT-01
    const rbtLedGeo = new THREE.BoxGeometry(1.22, 0.04, 1.02);
    const rbtLedMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
    const rbtLed = new THREE.Mesh(rbtLedGeo, rbtLedMat);
    rbtLed.position.y = 0.15;
    rbtGroup.add(rbtLed);

    rbtGroup.position.set(0, 0, -6);
    scene.add(rbtGroup);

    // Interactive Drag Orbit Controls
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = 0.7;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;

      cameraAngle += dx * 0.006;
      const radius = 28;
      camera.position.x = radius * Math.sin(cameraAngle);
      camera.position.z = radius * Math.cos(cameraAngle);
      camera.position.y = Math.max(10, Math.min(32, camera.position.y + dy * 0.05));
      camera.lookAt(0, 0, 0);

      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Click Detection for Sections
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e) => {
      const rect = dom.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects);
      if (intersects.length > 0) {
        const secName = intersects[0].object.userData.sectionName;
        setSelected(secName);
        if (onSelectSection) onSelectSection(secName);
      }
    };
    dom.addEventListener('click', onClick);

    // Navigation Waypoint Patrol along the Main Line and Branches
    // Path: RFID 1 (0, -6) -> Sec A (-8, -6) -> RFID 1 (0, -6) -> RFID 2 (0, 0) -> RFID 3 (0, 6) -> Counter (-8, 6) -> RFID 3 (0, 6) -> Dock (8, 6)
    const patrolPoints = [
      new THREE.Vector3(0, 0, -6),    // RFID 1
      new THREE.Vector3(-7, 0, -6),   // Dock at Section A
      new THREE.Vector3(0, 0, -6),    // Back to RFID 1
      new THREE.Vector3(0, 0, 0),     // RFID 2 (Sec C / D)
      new THREE.Vector3(0, 0, 6),     // RFID 3 (Counter / Dock)
      new THREE.Vector3(-7, 0, 6),    // Dock at Counter
      new THREE.Vector3(0, 0, 6),     // Back to RFID 3
      new THREE.Vector3(7, 0, 6),     // Charging Dock CH01
      new THREE.Vector3(0, 0, 6),     // Back to RFID 3
      new THREE.Vector3(0, 0, 0),     // Back through RFID 2
    ];

    let currentWaypointIdx = 0;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Autonomous Robot Interpolation along track
      const targetPoint = patrolPoints[currentWaypointIdx];
      const currentPos = rbtGroup.position;
      const dist = currentPos.distanceTo(targetPoint);

      if (dist < 0.15) {
        currentWaypointIdx = (currentWaypointIdx + 1) % patrolPoints.length;
      } else {
        const dir = new THREE.Vector3().subVectors(targetPoint, currentPos).normalize();
        rbtGroup.position.addScaledVector(dir, 0.04);
        rbtGroup.rotation.y = Math.atan2(dir.x, dir.z);
      }

      // Pulse charging pad coil
      coil.scale.setScalar(1 + Math.sin(Date.now() * 0.005) * 0.05);

      // Auto Camera Orbit if enabled
      if (autoRotate && !isDragging) {
        cameraAngle += 0.0012;
        const radius = 28;
        camera.position.x = radius * Math.sin(cameraAngle);
        camera.position.z = radius * Math.cos(cameraAngle);
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const nw = mount.clientWidth;
      const nh = mount.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      dom.removeEventListener('click', onClick);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', onResize);
      if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-industrial-950 border border-white/[0.08]" style={{ height }}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: Layout Badge */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-industrial-900/90 backdrop-blur-md border border-white/10 text-xs font-mono shadow-lg">
          <span className="text-industrial-400">Layout: </span>
          <span className="text-status-cyan font-bold">1 Main Spine • 3 RFID Junctions</span>
        </div>
        {selected && (
          <div className="px-3 py-1.5 rounded-xl bg-status-cyan/20 border border-status-cyan/40 text-status-cyan text-xs font-mono font-bold shadow-glow-cyan">
            Selected: {selected}
          </div>
        )}
      </div>

      {/* Top Right: Orbit Control */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-xl border text-xs transition-colors backdrop-blur-md shadow-lg ${
            autoRotate
              ? 'bg-status-cyan/20 border-status-cyan/40 text-status-cyan shadow-glow-cyan'
              : 'bg-industrial-800/80 border-white/10 text-industrial-400 hover:text-white'
          }`}
          title={autoRotate ? 'Pause 3D Camera Orbit' : 'Resume 3D Camera Orbit'}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Track Junctions Legend */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-industrial-900/90 backdrop-blur-md border border-white/10 text-[11px] font-mono text-industrial-300 shadow-xl">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-cyan"></span>
            <span className="text-white font-semibold">RFID 1:</span>
            <span>Sec A (Left) | Sec B (Right)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-green"></span>
            <span className="text-white font-semibold">RFID 2:</span>
            <span>Sec C (Left) | Sec D (Right)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-yellow"></span>
            <span className="text-white font-semibold">RFID 3:</span>
            <span>Counter (Left) | CH01 Dock (Right)</span>
          </div>
        </div>

        <div className="text-status-cyan font-bold hidden md:block">
          ● Main Black AGV Line Active
        </div>
      </div>
    </div>
  );
};

export default Warehouse3D;
