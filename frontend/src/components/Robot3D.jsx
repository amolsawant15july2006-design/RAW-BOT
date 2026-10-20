import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, RefreshCw, Eye } from 'lucide-react';

const Robot3D = ({ 
  status = 'Working', 
  lift = 'UP', 
  autoRotate = true, 
  interactive = true, 
  height = '320px',
  showControls = true 
}) => {
  const mountRef = useRef(null);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const liftPlatformRef = useRef(null);
  const lidarRef = useRef(null);
  const wheelsRef = useRef([]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 300;
    const heightPx = mount.clientHeight || 260;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d12);

    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(3.2, 2.4, 3.8);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Neon accent point lights
    let statusColor = 0x00e5ff;
    if (status === 'Emergency Stop') statusColor = 0xef4444;
    else if (status === 'Charging') statusColor = 0xf97316;
    else if (status === 'Completed' || status === 'Idle') statusColor = 0x10b981;

    const pointLight = new THREE.PointLight(statusColor, 2, 4);
    pointLight.position.set(0, 0.2, 0);
    scene.add(pointLight);

    // Ground Grid & Floor
    const gridHelper = new THREE.GridHelper(8, 16, 0x00e5ff, 0x1b222c);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // ROBOT ROOT GROUP
    const robotGroup = new THREE.Group();
    scene.add(robotGroup);

    // 1. Robot Chassis (Matte Industrial Dark Metal)
    const chassisGeo = new THREE.BoxGeometry(1.6, 0.35, 1.3);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.3,
      metalness: 0.8,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.32;
    chassis.castShadow = true;
    chassis.receiveShadow = true;
    robotGroup.add(chassis);

    // Upper chassis deck
    const deckGeo = new THREE.BoxGeometry(1.4, 0.08, 1.1);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x1b222c,
      roughness: 0.2,
      metalness: 0.9,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.y = 0.52;
    robotGroup.add(deck);

    // 2. LED Status Ring around base
    const ledGeo = new THREE.BoxGeometry(1.62, 0.04, 1.32);
    const ledMat = new THREE.MeshBasicMaterial({ color: statusColor });
    const ledRing = new THREE.Mesh(ledGeo, ledMat);
    ledRing.position.y = 0.2;
    robotGroup.add(ledRing);

    // 3. Mecanum Wheels (4 wheels at corners)
    const wheelPositions = [
      [-0.65, 0.18, 0.68],
      [0.65, 0.18, 0.68],
      [-0.65, 0.18, -0.68],
      [0.65, 0.18, -0.68],
    ];

    const wheelGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.14, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.8,
      metalness: 0.2,
    });
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0xeab308, // Brass mecanum hub
      roughness: 0.3,
      metalness: 0.8,
    });

    const wheels = [];
    wheelPositions.forEach((pos) => {
      const wheelHub = new THREE.Group();
      wheelHub.position.set(...pos);

      const rim = new THREE.Mesh(wheelGeo, wheelMat);
      rim.castShadow = true;
      wheelHub.add(rim);

      const hubcapGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.15, 12);
      hubcapGeo.rotateZ(Math.PI / 2);
      const hubcap = new THREE.Mesh(hubcapGeo, hubMat);
      wheelHub.add(hubcap);

      robotGroup.add(wheelHub);
      wheels.push(wheelHub);
    });
    wheelsRef.current = wheels;

    // 4. Center Linear Lift Mechanism (scissor/actuator style)
    const liftGroup = new THREE.Group();
    liftGroup.position.set(0, 0.58, 0);
    robotGroup.add(liftGroup);
    liftPlatformRef.current = liftGroup;

    // Lift columns
    const columnGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8);
    const columnMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
    [-0.3, 0.3].forEach((cx) => {
      [-0.2, 0.2].forEach((cz) => {
        const col = new THREE.Mesh(columnGeo, columnMat);
        col.position.set(cx, 0.15, cz);
        liftGroup.add(col);
      });
    });

    // Lift Platform Pallet Stand
    const platformGeo = new THREE.BoxGeometry(1.2, 0.05, 0.9);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x2a3342,
      roughness: 0.4,
      metalness: 0.6,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = 0.35;
    platform.castShadow = true;
    liftGroup.add(platform);

    // 5. Cargo Carton / Pallet Package on top
    const cartonGeo = new THREE.BoxGeometry(0.9, 0.6, 0.7);
    const cartonMat = new THREE.MeshStandardMaterial({
      color: 0xb4824a, // Cardboard kraft color
      roughness: 0.9,
      metalness: 0.0,
    });
    const carton = new THREE.Mesh(cartonGeo, cartonMat);
    carton.position.y = 0.68;
    carton.castShadow = true;
    liftGroup.add(carton);

    // Package barcode/label on side of carton
    const labelGeo = new THREE.PlaneGeometry(0.35, 0.2);
    const labelMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(0, 0.68, 0.355);
    liftGroup.add(label);

    // 6. Rotating LiDAR / Ultrasonic Sensor on front
    const lidarGroup = new THREE.Group();
    lidarGroup.position.set(0.65, 0.58, 0);
    const lidarBaseGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
    const lidarMat = new THREE.MeshStandardMaterial({ color: 0x05070a });
    const lidarBase = new THREE.Mesh(lidarBaseGeo, lidarMat);
    lidarGroup.add(lidarBase);

    const lidarHeadGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 16);
    const lidarHeadMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, emissive: 0x005577 });
    const lidarHead = new THREE.Mesh(lidarHeadGeo, lidarHeadMat);
    lidarHead.position.y = 0.06;
    lidarGroup.add(lidarHead);

    robotGroup.add(lidarGroup);
    lidarRef.current = lidarHead;

    // Interactive mouse rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      robotGroup.rotation.y += deltaX * 0.01;
      camera.position.y = Math.max(0.8, Math.min(5, camera.position.y + deltaY * 0.01));
      camera.lookAt(0, 0.4, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Auto rotation
      if (isRotating && !isDragging) {
        robotGroup.rotation.y += 0.008;
      }

      // Rotate LiDAR
      if (lidarRef.current) {
        lidarRef.current.rotation.y += 0.05;
      }

      // Wheels rotation if status is working/moving
      if (status === 'Working' || status === 'Moving') {
        wheelsRef.current.forEach((wheel) => {
          wheel.rotation.x += 0.04;
        });
      }

      // Dynamic Lift movement
      if (liftPlatformRef.current) {
        const targetLiftY = lift === 'UP' ? 0.0 : -0.18;
        liftPlatformRef.current.position.y = THREE.MathUtils.lerp(
          liftPlatformRef.current.position.y,
          0.58 + targetLiftY,
          0.05
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [status, lift, isRotating, interactive]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-industrial-900 border border-white/5 group" style={{ height }}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D HUD Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-industrial-850/80 backdrop-blur-md border border-white/10 text-xs font-mono">
        <span className={`w-2 h-2 rounded-full ${status === 'Emergency Stop' ? 'bg-status-red' : status === 'Charging' ? 'bg-status-orange' : 'bg-status-cyan'} animate-pulse`} />
        <span className="text-white font-semibold uppercase">{status}</span>
        <span className="text-industrial-400">|</span>
        <span className="text-industrial-300">Lift: {lift}</span>
      </div>

      {/* Control Buttons */}
      {showControls && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isRotating
                ? 'bg-status-cyan/20 border-status-cyan/40 text-status-cyan'
                : 'bg-industrial-800 border-white/10 text-industrial-400 hover:text-white'
            }`}
            title={isRotating ? 'Pause 3D Auto-Rotation' : 'Resume 3D Auto-Rotation'}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer hint */}
      <div className="absolute bottom-2 right-3 text-[10px] font-mono text-industrial-500 pointer-events-none">
        Drag to Rotate • 3D Telemetry Active
      </div>
    </div>
  );
};

export default Robot3D;
