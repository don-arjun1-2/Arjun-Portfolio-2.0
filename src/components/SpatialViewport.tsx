import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Eye, Layers, RotateCcw, Play, Pause, ChevronDown, ChevronUp, Box, Cpu, Compass } from 'lucide-react';

export type ModelType = 'headset' | 'drone' | 'office';
export type RenderStyle = 'pbr' | 'wireframe' | 'xray';

interface SpatialViewportProps {
  initialModel?: ModelType;
  onModelSelect?: (model: ModelType) => void;
  className?: string;
  compact?: boolean;
}

// Module-scope reusable math helpers (Zero GC in loop)
const _targetLook = new THREE.Vector3(0, 0, 0);

export function SpatialViewport({
  initialModel = 'headset',
  onModelSelect,
  className = '',
  compact = false,
}: SpatialViewportProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ModelType>(initialModel);
  const [renderStyle, setRenderStyle] = useState<RenderStyle>('pbr');
  const [isExploded, setIsExploded] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inspectMode, setInspectMode] = useState<string>('Standard View');

  // Sync prop changes
  useEffect(() => {
    setActiveModel(initialModel);
  }, [initialModel]);

  // Keep references for animation loop
  const stateRef = useRef({
    activeModel,
    renderStyle,
    isExploded,
    autoRotate,
  });

  useEffect(() => {
    stateRef.current = {
      activeModel,
      renderStyle,
      isExploded,
      autoRotate,
    };
  }, [activeModel, renderStyle, isExploded, autoRotate]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js scene & camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08080a);
    scene.fog = new THREE.Fog(0x08080a, 12, 30);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(3.8, 2.4, 4.6);
    camera.lookAt(0, 0, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.setAttribute('aria-label', '3D Spatial AR/VR Viewport Canvas');

    // 4. Studio Environment & Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e1b4b, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x6366f1, 1.8);
    rimLight.position.set(-4, 3, -5);
    scene.add(rimLight);

    // Contact shadow plane
    const shadowGeo = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x030305,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.2;
    shadowMesh.renderOrder = 0;
    scene.add(shadowMesh);

    // Subtle Ground Grid
    const grid = new THREE.GridHelper(10, 20, 0x312e81, 0x18181b);
    grid.position.y = -1.19;
    scene.add(grid);

    // 5. Build procedural models
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Group containers for the 3 switchable models
    const headsetGroup = new THREE.Group();
    const droneGroup = new THREE.Group();
    const officeGroup = new THREE.Group();

    rootGroup.add(headsetGroup);
    rootGroup.add(droneGroup);
    rootGroup.add(officeGroup);

    // --- MODEL 1: AR/VR Spatial Headset ---
    // Visor main chassis
    const visorGeo = new THREE.BoxGeometry(2.0, 1.0, 1.1);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.8,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.castShadow = !isSoftwareGl;
    headsetGroup.add(visorMesh);

    // Front reflective glass shield
    const glassGeo = new THREE.BoxGeometry(1.9, 0.85, 0.12);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 0, 0.55);
    headsetGroup.add(glassMesh);

    // Camera Sensor Array (Left & Right dual tracking cameras)
    const sensorGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 16);
    const sensorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.9 });
    
    const camLeft = new THREE.Mesh(sensorGeo, sensorMat);
    camLeft.rotation.x = Math.PI / 2;
    camLeft.position.set(-0.7, 0.25, 0.6);
    headsetGroup.add(camLeft);

    const camRight = camLeft.clone();
    camRight.position.set(0.7, 0.25, 0.6);
    headsetGroup.add(camRight);

    const lidarSensor = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.1, 0.05),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.4 })
    );
    lidarSensor.position.set(0, -0.25, 0.6);
    headsetGroup.add(lidarSensor);

    // Head strap loop
    const strapGeo = new THREE.TorusGeometry(1.2, 0.08, 12, 32, Math.PI * 1.15);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.7 });
    const strapMesh = new THREE.Mesh(strapGeo, strapMat);
    strapMesh.rotation.x = Math.PI / 2;
    strapMesh.position.set(0, 0, -0.6);
    headsetGroup.add(strapMesh);

    // Side audio driver pods
    const audioGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.15, 24);
    const audioMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.8 });
    const audioLeft = new THREE.Mesh(audioGeo, audioMat);
    audioLeft.rotation.z = Math.PI / 2;
    audioLeft.position.set(-1.15, 0, -0.6);
    headsetGroup.add(audioLeft);

    const audioRight = audioLeft.clone();
    audioRight.position.set(1.15, 0, -0.6);
    headsetGroup.add(audioRight);

    // --- MODEL 2: AI Autonomous Drone ---
    // Central body
    const droneBodyGeo = new THREE.BoxGeometry(1.2, 0.35, 1.2);
    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.6 });
    const droneBody = new THREE.Mesh(droneBodyGeo, carbonMat);
    droneBody.castShadow = !isSoftwareGl;
    droneGroup.add(droneBody);

    // Drone Top sensor dome
    const domeGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.2, metalness: 0.8 });
    const droneDome = new THREE.Mesh(domeGeo, domeMat);
    droneDome.position.set(0, 0.18, 0);
    droneGroup.add(droneDome);

    // 4 Arms and Rotors
    const armGeo = new THREE.BoxGeometry(0.12, 0.08, 1.8);
    const arm1 = new THREE.Mesh(armGeo, carbonMat);
    arm1.rotation.y = Math.PI / 4;
    droneGroup.add(arm1);

    const arm2 = new THREE.Mesh(armGeo, carbonMat);
    arm2.rotation.y = -Math.PI / 4;
    droneGroup.add(arm2);

    // Motor Hubs & Propellers
    const motorGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.18, 16);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.9, roughness: 0.2 });
    const propGeo = new THREE.BoxGeometry(0.9, 0.02, 0.1);
    const propMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.4 });

    const propsList: THREE.Mesh[] = [];
    const offsets = [
      [-0.9, 0.15, -0.9],
      [0.9, 0.15, -0.9],
      [-0.9, 0.15, 0.9],
      [0.9, 0.15, 0.9],
    ];

    offsets.forEach(([x, y, z]) => {
      const motor = new THREE.Mesh(motorGeo, motorMat);
      motor.position.set(x, y, z);
      droneGroup.add(motor);

      const prop = new THREE.Mesh(propGeo, propMat);
      prop.position.set(x, y + 0.1, z);
      droneGroup.add(prop);
      propsList.push(prop);
    });

    // Front Gimbal Camera
    const gimbalGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const gimbalMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.9 });
    const gimbal = new THREE.Mesh(gimbalGeo, gimbalMat);
    gimbal.position.set(0, -0.2, 0.65);
    droneGroup.add(gimbal);

    // Landing skids
    const skidGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8);
    const skidLeft = new THREE.Mesh(skidGeo, carbonMat);
    skidLeft.rotation.x = Math.PI / 2;
    skidLeft.position.set(-0.6, -0.5, 0);
    droneGroup.add(skidLeft);

    const skidRight = skidLeft.clone();
    skidRight.position.set(0.6, -0.5, 0);
    droneGroup.add(skidRight);

    // --- MODEL 3: Digital Twin Office Workspace ---
    // Room base slab
    const floorGeo = new THREE.BoxGeometry(3.6, 0.15, 3.2);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.8 });
    const roomFloor = new THREE.Mesh(floorGeo, floorMat);
    roomFloor.position.set(0, -0.8, 0);
    officeGroup.add(roomFloor);

    // Partition Glass Wall
    const partGeo = new THREE.BoxGeometry(0.08, 1.6, 2.8);
    const partMat = new THREE.MeshPhysicalMaterial({
      color: 0x60a5fa,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const partWall = new THREE.Mesh(partGeo, partMat);
    partWall.position.set(-1.4, 0, 0);
    officeGroup.add(partWall);

    // Main Workstation Desk
    const deskTopGeo = new THREE.BoxGeometry(2.2, 0.08, 1.1);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, roughness: 0.4 });
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(0, -0.1, 0);
    officeGroup.add(deskTop);

    // Dual Monitors on desk
    const monitorGeo = new THREE.BoxGeometry(0.8, 0.48, 0.04);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, emissive: 0x0284c7, emissiveIntensity: 0.3 });
    const mon1 = new THREE.Mesh(monitorGeo, screenMat);
    mon1.position.set(-0.45, 0.26, -0.2);
    mon1.rotation.y = 0.15;
    officeGroup.add(mon1);

    const mon2 = new THREE.Mesh(monitorGeo, screenMat);
    mon2.position.set(0.45, 0.26, -0.2);
    mon2.rotation.y = -0.15;
    officeGroup.add(mon2);

    // Floating Spatial Marker Node Beacon
    const markerGeo = new THREE.OctahedronGeometry(0.22, 0);
    const markerMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.8,
    });
    const markerMesh = new THREE.Mesh(markerGeo, markerMat);
    markerMesh.position.set(0, 0.9, 0);
    officeGroup.add(markerMesh);

    // Collect all meshes for style adjustments
    const allMeshes: THREE.Mesh[] = [];
    rootGroup.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        allMeshes.push(obj);
        obj.userData.origMaterial = obj.material;
      }
    });

    // 6. Interactive Drag / Orbit interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0.4;
    let targetRotationX = 0.2;
    let currentRotationY = 0.4;
    let currentRotationX = 0.2;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-0.6, Math.min(0.8, targetRotationX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // 7. Handle Resizing
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 8. Animation Loop
    let frameId = 0;
    let prevTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const now = performance.now();
      const delta = Math.min((now - prevTime) / 1000, 0.1);
      prevTime = now;
      const elapsed = now / 1000;
      const { activeModel: currModel, renderStyle: currStyle, isExploded: currExplode, autoRotate: currAuto } = stateRef.current;

      // Switch active model visibility
      headsetGroup.visible = currModel === 'headset';
      droneGroup.visible = currModel === 'drone';
      officeGroup.visible = currModel === 'office';

      // Auto rotation
      if (currAuto && !isDragging) {
        targetRotationY += delta * 0.45;
      }

      // Smooth damping for rotations
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 8, delta);
      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 8, delta);

      rootGroup.rotation.y = currentRotationY;
      rootGroup.rotation.x = currentRotationX;

      // Model specific procedural animations
      if (droneGroup.visible) {
        // Spin propellers
        propsList.forEach((prop, i) => {
          prop.rotation.y += (i % 2 === 0 ? 1 : -1) * delta * 24;
        });
        droneGroup.position.y = Math.sin(elapsed * 2.5) * 0.08;
      } else {
        droneGroup.position.y = 0;
      }

      if (headsetGroup.visible) {
        // Gentle spatial float
        headsetGroup.position.y = Math.sin(elapsed * 1.8) * 0.05;
      }

      if (officeGroup.visible) {
        // Beacon rotation and float
        markerMesh.rotation.y += delta * 1.5;
        markerMesh.position.y = 0.9 + Math.sin(elapsed * 3) * 0.06;
      }

      // Exploded View kinematics
      const explodeFactor = currExplode ? 1.0 : 0.0;
      if (headsetGroup.visible) {
        const targetZ = currExplode ? 0.9 : 0.55;
        glassMesh.position.z = THREE.MathUtils.damp(glassMesh.position.z, targetZ, 6, delta);
        const targetStrapZ = currExplode ? -1.2 : -0.6;
        strapMesh.position.z = THREE.MathUtils.damp(strapMesh.position.z, targetStrapZ, 6, delta);
        const targetAudioX = currExplode ? 1.6 : 1.15;
        audioRight.position.x = THREE.MathUtils.damp(audioRight.position.x, targetAudioX, 6, delta);
        audioLeft.position.x = THREE.MathUtils.damp(audioLeft.position.x, -targetAudioX, 6, delta);
      }

      if (droneGroup.visible) {
        const targetDomeY = currExplode ? 0.55 : 0.18;
        droneDome.position.y = THREE.MathUtils.damp(droneDome.position.y, targetDomeY, 6, delta);
        const targetSkidY = currExplode ? -0.85 : -0.5;
        skidLeft.position.y = THREE.MathUtils.damp(skidLeft.position.y, targetSkidY, 6, delta);
        skidRight.position.y = THREE.MathUtils.damp(skidRight.position.y, targetSkidY, 6, delta);
      }

      // Render style adjustments
      allMeshes.forEach((mesh) => {
        if (currStyle === 'wireframe') {
          if (!mesh.userData.wireframeMat) {
            mesh.userData.wireframeMat = new THREE.MeshBasicMaterial({
              color: 0x38bdf8,
              wireframe: true,
            });
          }
          mesh.material = mesh.userData.wireframeMat;
        } else if (currStyle === 'xray') {
          if (!mesh.userData.xrayMat) {
            mesh.userData.xrayMat = new THREE.MeshStandardMaterial({
              color: 0x818cf8,
              roughness: 0.1,
              metalness: 0.8,
              transparent: true,
              opacity: 0.45,
            });
          }
          mesh.material = mesh.userData.xrayMat;
        } else {
          mesh.material = mesh.userData.origMaterial;
        }
      });

      camera.lookAt(_targetLook);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
    };
  }, []);

  const handleSelectModel = (model: ModelType) => {
    setActiveModel(model);
    onModelSelect?.(model);
  };

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl bg-neutral-950 border border-neutral-800 ${className}`}
      style={{ minHeight: compact ? '380px' : '520px' }}
      data-testid="spatial-viewport-container"
    >
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Spec & Domain Overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/80 border border-neutral-700/60 rounded-lg backdrop-blur-none text-xs text-neutral-300">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-neutral-100">
            {activeModel === 'headset' && 'Spatial Computing Rig · Blender/WebXR'}
            {activeModel === 'drone' && 'AI Drone Telemetry · Autonomous Navigation'}
            {activeModel === 'office' && 'Praya Labs Digital Twin · 1:1 Scale'}
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400">Drag to Orbit</span>
        </div>
      </div>

      {/* Top Right Quick Reset */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg border text-xs transition-colors ${
            autoRotate
              ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
              : 'bg-neutral-900/80 border-neutral-700 text-neutral-400 hover:text-neutral-200'
          }`}
          aria-label={autoRotate ? 'Pause 3D rotation' : 'Resume 3D rotation'}
          title={autoRotate ? 'Pause 3D rotation' : 'Resume 3D rotation'}
        >
          {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-colors"
          aria-label={isCollapsed ? 'Show 3D controls' : 'Hide 3D controls for clean inspection'}
          title={isCollapsed ? 'Expand Dock' : 'Cinema Mode (Hide Dock)'}
        >
          {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Ergonomic Collapsible Bottom Dock (Zero Viewport Occlusion) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-xl transition-all duration-300 ${
          isCollapsed ? 'translate-y-20 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="bg-neutral-900/95 border border-neutral-700/80 rounded-xl p-2.5 shadow-2xl flex flex-col gap-2">
          {/* Row 1: Model Switcher Tabs */}
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-medium text-neutral-400 px-1 hidden sm:inline">Model:</span>
            <div className="flex items-center gap-1 flex-1">
              <button
                type="button"
                onClick={() => handleSelectModel('headset')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeModel === 'headset'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>AR/VR Headset</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModel('drone')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeModel === 'drone'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>AI Drone</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectModel('office')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeModel === 'office'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                <Box className="w-3 h-3" />
                <span>Digital Twin</span>
              </button>
            </div>
          </div>

          {/* Row 2: Render Shader & Exploded View Controls */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-neutral-800 text-xs">
            <div className="flex items-center gap-1 text-[11px] text-neutral-400">
              <span>Shading:</span>
              <button
                type="button"
                onClick={() => setRenderStyle('pbr')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  renderStyle === 'pbr' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                PBR Realistic
              </button>
              <button
                type="button"
                onClick={() => setRenderStyle('wireframe')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  renderStyle === 'wireframe' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Wireframe
              </button>
              <button
                type="button"
                onClick={() => setRenderStyle('xray')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  renderStyle === 'xray' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                X-Ray
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExploded(!isExploded)}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors ${
                isExploded
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{isExploded ? 'Assembly Assembled' : 'Explode Parts'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
