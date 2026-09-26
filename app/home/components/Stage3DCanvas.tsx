"use client"

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, RefreshCw } from 'lucide-react';

interface Stage3DProps {
  activeSector?: string;
  onSelectBooth?: (sector: string) => void;
  className?: string;
}

export const Stage3DCanvas: React.FC<Stage3DProps> = ({
  activeSector,
  onSelectBooth,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [selectedPavilion, setSelectedPavilion] = useState<string>('CNC Machining');
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const controlsState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotX: 0.38,
    rotY: -0.6,
    targetRotX: 0.38,
    targetRotY: -0.6,
    zoom: 34,
    targetZoom: 34,
  });

  const boothMeshes = useRef<{ [key: string]: THREE.Group }>({});
  const animatedElements = useRef<THREE.Object3D[]>([]);

  // Product / company display data. Each laptop carries the same record on
  // both sides; a blank URL means the display is visual-only and does not navigate.
  const productDisplays = [
    {
      front: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop', // CNC Milling / Precision Engineering
      back: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop',
      url: 'https://apex-precision-machining.com/cnc-milling'
    },
    {
      front: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop', // Automotive Robotics Arm Assembly
      back: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1000&auto=format&fit=crop',
      url: 'https://nexgen-robotics.io/automotive-solutions'
    },
    {
      front: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=1000&auto=format&fit=crop', // Electronics Circuit Board Manufacturing
      back: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
      url: 'https://microtech-electronics.com/smt-assembly'
    },
    {
      front: 'https://images.unsplash.com/photo-1581091215367-9b6c00b3035a?q=80&w=1000&auto=format&fit=crop', // Automated Packaging & Conveyor Line
      back: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1000&auto=format&fit=crop',
      url: 'https://packflow-systems.de/packaging-automation'
    },
    {
      front: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000&auto=format&fit=crop', // Medical Device Cleanroom Production
      back: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop',
      url: 'https://meditech-eng.com/cleanroom-devices'
    },
    {
      front: 'https://images.unsplash.com/photo-1581093458791-9d42e3c73812?q=80&w=1000&auto=format&fit=crop', // Agricultural Hydroponics & Smart Farming
      back: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1000&auto=format&fit=crop',
      url: 'https://agrotech-futures.org/smart-harvesters'
    },
    {
      front: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop', // Industrial Metal Fabrication & Laser Cutting
      back: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop',
      url: 'https://titan-fabworks.com/sheet-metal'
    },
    {
      front: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=1000&auto=format&fit=crop', // Heavy Hydraulics & Turbine Manufacturing
      back: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=1000&auto=format&fit=crop',
      url: 'https://powerdrive-hydraulics.com/turbines'
    },
    {
      front: 'https://images.unsplash.com/photo-1581092335878-2d9ff86da2bf?q=80&w=1000&auto=format&fit=crop', // Quality Control & Metrology Inspection
      back: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1000&auto=format&fit=crop',
      url: 'https://optiscan-metrology.net/laser-inspection'
    },
    {
      front: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', // Additive Manufacturing / 3D Metal Printing
      back: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=1000&auto=format&fit=crop',
      url: 'https://additive3d-works.com/metal-printing'
    }
  ];

  // Helper to generate dynamic digital display textures for screens & laptops
  const createScreenTexture = (title: string, color: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 32) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 32) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }

      // Decorative UI Header Bar
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, 40);
      ctx.fillStyle = '#020617';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`EXHIBIT DASHBOARD // ${title.toUpperCase()}`, 16, 26);

      // UI Frame Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(16, 56, 480, 248);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`DEVICE STATUS: OPERATIONAL`, 32, 90);
      ctx.fillText(`TELEMETRY: LIVE DATA STREAM`, 32, 115);

      // Waveform Graphic
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      for (let i = 0; i < 420; i += 15) {
        const y = 210 + Math.sin(i * 0.06) * 35;
        if (i === 0) ctx.moveTo(32 + i, y);
        else ctx.lineTo(32 + i, y);
      }
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // FirmExpo brand mark used on the central exhibition pylon.
  // The file lives in the app's public directory and is therefore served at this URL.
  const createLogoTexture = () => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('/brand/logo-full.png');
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  };

  const loadImageTexture = (src: string) => {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  };

  // Helper function to create a detailed 3D Silver Laptop model
  const create3DLaptop = (screenColor: string, product: typeof productDisplays[number]) => {
    const laptopGroup = new THREE.Group();

    // 1. Laptop Silver Base Body
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db, // Metallic Silver
      metalness: 0.9,
      roughness: 0.2,
    });
    const baseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.028, 0.50), silverMat);
    baseMesh.position.y = 0.015;
    baseMesh.castShadow = true;
    laptopGroup.add(baseMesh);

    // Keyboard Area Surface
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const kbMesh = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.005, 0.22), kbMat);
    kbMesh.position.set(0, 0.031, -0.06);
    laptopGroup.add(kbMesh);

    // Trackpad Surface (Silver finish)
    const tpMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.7, roughness: 0.3 });
    const tpMesh = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.005, 0.14), tpMat);
    tpMesh.position.set(0, 0.031, 0.14);
    laptopGroup.add(tpMesh);

    // 2. Screen Hinge & Silver Screen Shell
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.03, -0.26);
    screenGroup.rotation.x = -Math.PI / 6; // Open laptop screen angle (~120 deg)

    const screenLid = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.48, 0.018), silverMat);
    screenLid.position.set(0, 0.26, 0);
    screenLid.castShadow = true;
    screenGroup.add(screenLid);

    // Laptop Display Screen
    // Front of the laptop: supplied image URL.
    const frontTexture = loadImageTexture(product.front);
    const screenDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.42),
      new THREE.MeshBasicMaterial({ map: frontTexture, side: THREE.FrontSide })
    );
    screenDisplay.position.set(0, 0.26, 0.011);
    screenDisplay.userData = { product, displaySide: 'front' };
    screenGroup.add(screenDisplay);

    // Back of the laptop lid: separate supplied image URL.
    // It is mounted on the opposite face of the same lid so the laptop is
    // useful from either side of the exhibition aisle.
    const backTexture = loadImageTexture(product.back);
    const backDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.42),
      new THREE.MeshBasicMaterial({ map: backTexture, side: THREE.FrontSide })
    );
    backDisplay.position.set(0, 0.26, -0.011);
    backDisplay.rotation.y = Math.PI;
    backDisplay.userData = { product, displaySide: 'back' };
    screenGroup.add(backDisplay);

    laptopGroup.userData = { product, isProductLaptop: true };

    laptopGroup.add(screenGroup);
    return laptopGroup;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. SCENE SETUP WITH HIGH BRIGHTNESS & CLEAR ATMOSPHERE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgColor = new THREE.Color(0x0b1220); // Deep architectural exhibition backdrop
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(0x0b1220, 0.004); // Gentle depth, not a hazy game look

    // 2. CAMERA
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 240);
    camera.position.set(0, 15, 34);
    cameraRef.current = camera;

    // 3. WebGL RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12; // Natural contrast and material depth

    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. ARCHITECTURAL EXHIBITION LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdce8f2, 0x111827, 1.25);
    scene.add(hemiLight);

    const keySpot = new THREE.SpotLight(0xffffff, 5.5, 150, Math.PI / 4.5, 0.52, 1.15);
    keySpot.position.set(18, 32, 24);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 2048;
    keySpot.shadow.mapSize.height = 2048;
    keySpot.shadow.bias = -0.00008;
    scene.add(keySpot);

    const fillLight = new THREE.DirectionalLight(0xc9d8e6, 1.6);
    fillLight.position.set(-24, 20, 8);
    scene.add(fillLight);

    const warmArchitecturalLight = new THREE.PointLight(0xffd6a0, 2.2, 32);
    warmArchitecturalLight.position.set(0, 5, 0);
    scene.add(warmArchitecturalLight);

    // 5. PREMIUM EXHIBITION FLOOR
    const stageRoot = new THREE.Group();
    scene.add(stageRoot);

    const floorGeo = new THREE.CylinderGeometry(23, 23.5, 0.55, 96);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x202a35,
      roughness: 0.34,
      metalness: 0.58,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.28;
    floorMesh.receiveShadow = true;
    stageRoot.add(floorMesh);

    // Subtle architectural rings instead of a dominant glowing grid.
    [8.2, 15.0, 21.8].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, index === 2 ? 0.045 : 0.025, 12, 128),
        new THREE.MeshBasicMaterial({
          color: index === 2 ? 0x9b6b2f : 0x52616d,
          transparent: true,
          opacity: index === 2 ? 0.72 : 0.42,
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.015;
      stageRoot.add(ring);
    });

    // Quiet central reception plinth — deliberately low so the booths remain the heroes.
    const centerBase = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 5.9, 0.58, 64),
      new THREE.MeshStandardMaterial({ color: 0x303b46, roughness: 0.28, metalness: 0.68 })
    );
    centerBase.position.y = 0.29;
    centerBase.castShadow = true;
    stageRoot.add(centerBase);

    const centerTop = new THREE.Mesh(
      new THREE.CylinderGeometry(5.0, 5.25, 0.14, 64),
      new THREE.MeshStandardMaterial({ color: 0x111923, roughness: 0.2, metalness: 0.72 })
    );
    centerTop.position.y = 0.64;
    centerTop.receiveShadow = true;
    stageRoot.add(centerTop);

    const centerGlow = new THREE.Mesh(
      new THREE.TorusGeometry(4.15, 0.05, 12, 128),
      new THREE.MeshBasicMaterial({ color: 0xd99a43 })
    );
    centerGlow.rotation.x = Math.PI / 2;
    centerGlow.position.y = 0.72;
    stageRoot.add(centerGlow);

    // 6. LARGE FIRMEXPO BRAND PYLON — the visual centerpiece of the exhibition
    const welcome = new THREE.Group();
    welcome.position.y = 0.76;
    stageRoot.add(welcome);

    const welcomeBody = new THREE.Mesh(
      new THREE.BoxGeometry(3.65, 5.15, 0.68),
      new THREE.MeshStandardMaterial({ color: 0x17212c, roughness: 0.22, metalness: 0.72 })
    );
    welcomeBody.position.y = 2.58;
    welcomeBody.castShadow = true;
    welcome.add(welcomeBody);

    const welcomeFace = new THREE.Mesh(
      new THREE.PlaneGeometry(3.18, 4.42),
      new THREE.MeshBasicMaterial({
        map: createLogoTexture(),
        transparent: true,
        alphaTest: 0.04,
        toneMapped: false,
      })
    );
    welcomeFace.position.set(0, 2.58, 0.351);
    welcome.add(welcomeFace);

    // 7. SECTORS & PRODUCTION EQUIPMENT DESIGN
    // FirmExpo is a digital exhibition platform for production businesses.
    // The stage therefore covers the major production/manufacturing verticals,
    // while each booth can represent many sub-industries and capabilities.
    // Keep the exhibition visually spacious: each zone is a flagship pavilion,
    // while the selected zone can later open the full company/industry directory.
    const sectors = [
      { name: 'CNC & Precision Machining', angle: 0, color: '#e7a33a', colorHex: 0xe7a33a, shape: 'cnc' },
      { name: 'Steel & Metal Fabrication', angle: Math.PI * 0.2, color: '#8e9aa6', colorHex: 0x8e9aa6, shape: 'metal' },
      { name: 'Industrial Machinery', angle: Math.PI * 0.4, color: '#5c7488', colorHex: 0x5c7488, shape: 'machinery' },
      { name: 'Automation & Robotics', angle: Math.PI * 0.6, color: '#c44b3c', colorHex: 0xc44b3c, shape: 'automotive' },
      { name: 'Automotive & Mobility', angle: Math.PI * 0.8, color: '#7f8c96', colorHex: 0x7f8c96, shape: 'automotive' },
      { name: 'Medical Devices', angle: Math.PI * 1.0, color: '#55a9bd', colorHex: 0x55a9bd, shape: 'medical' },
      { name: 'Electronics & Electrical', angle: Math.PI * 1.2, color: '#7166a7', colorHex: 0x7166a7, shape: 'electronics' },
      { name: 'Agriculture & Agri-Machinery', angle: Math.PI * 1.4, color: '#77964a', colorHex: 0x77964a, shape: 'agriculture' },
      { name: 'Packaging & Processing', angle: Math.PI * 1.6, color: '#b88943', colorHex: 0xb88943, shape: 'packaging' },
      { name: 'Energy & Power Equipment', angle: Math.PI * 1.8, color: '#c9793e', colorHex: 0xc9793e, shape: 'machinery' },
    ];

    const boothMeshesMap: { [key: string]: THREE.Group } = {};
    const dynamicAnimables: THREE.Object3D[] = [];

    sectors.forEach((sec) => {
      const radius = 16.4;
      const x = Math.sin(sec.angle) * radius;
      const z = Math.cos(sec.angle) * radius;

      // Assign the product before using it in booth metadata.
      // This fixes the TypeScript block-scope error caused by declaring
      // `product` later in the same sectors.forEach() callback.
      const product = productDisplays[sectors.indexOf(sec) % productDisplays.length];

      const boothGroup = new THREE.Group();
      boothGroup.position.set(x, 0, z);
      boothGroup.rotation.y = sec.angle + Math.PI;
      boothGroup.userData = { sectorName: sec.name, product, productUrl: product.url };

      // Architectural booth shell: open front, premium metal frame, no visual clutter.
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(5.6, 0.32, 4.4),
        new THREE.MeshStandardMaterial({ color: 0x303b46, roughness: 0.34, metalness: 0.62 })
      );
      base.position.y = 0.18;
      base.castShadow = true;
      base.receiveShadow = true;
      boothGroup.add(base);

      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x111923,
        roughness: 0.24,
        metalness: 0.82,
      });

      // Two slim structural columns.
      [-2.42, 2.42].forEach((px) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.9, 0.12), frameMat);
        pillar.position.set(px, 1.55, -1.88);
        pillar.castShadow = true;
        boothGroup.add(pillar);
      });

      const header = new THREE.Mesh(
        new THREE.BoxGeometry(4.95, 0.13, 0.14),
        new THREE.MeshStandardMaterial({ color: sec.colorHex, metalness: 0.55, roughness: 0.3 })
      );
      header.position.set(0, 3.03, -1.88);
      boothGroup.add(header);

      // Back display wall — matte frame + large clean digital panel.
      const screenBack = new THREE.Mesh(
        new THREE.BoxGeometry(4.85, 2.65, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x161f29, metalness: 0.65, roughness: 0.28 })
      );
      screenBack.position.set(0, 1.95, -1.88);
      screenBack.castShadow = true;
      boothGroup.add(screenBack);

      const screenTexture = createScreenTexture(sec.name, sec.color);
      const screenFace = new THREE.Mesh(
        new THREE.PlaneGeometry(4.65, 2.45),
        new THREE.MeshBasicMaterial({ map: screenTexture })
      );
      screenFace.position.set(0, 1.95, -1.805);
      boothGroup.add(screenFace);

      // Small real-world reception desk rather than a laptop at every booth.
      const deskGroup = new THREE.Group();
      deskGroup.position.set(-1.45, 0.34, 0.72);

      const deskTop = new THREE.Mesh(
        new THREE.BoxGeometry(1.45, 0.10, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x252f39, roughness: 0.25, metalness: 0.68 })
      );
      deskTop.position.y = 0.72;
      deskTop.castShadow = true;
      deskGroup.add(deskTop);

      const deskFront = new THREE.Mesh(
        new THREE.BoxGeometry(1.42, 0.66, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x121a23, roughness: 0.32, metalness: 0.52 })
      );
      deskFront.position.set(0, 0.38, 0.30);
      deskGroup.add(deskFront);

      // One physical-looking monitor.
      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.46, 0.045),
        new THREE.MeshStandardMaterial({ color: 0x101720, roughness: 0.2, metalness: 0.55 })
      );
      monitor.position.set(0, 1.03, 0.02);
      deskGroup.add(monitor);

      const monitorScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.63, 0.37),
        new THREE.MeshBasicMaterial({ map: createScreenTexture('Company', sec.color) })
      );
      monitorScreen.position.set(0, 1.03, 0.045);
      deskGroup.add(monitorScreen);

      const monitorStand = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.24, 12),
        new THREE.MeshStandardMaterial({ color: 0x87939e, metalness: 0.9, roughness: 0.22 })
      );
      monitorStand.position.set(0, 0.86, 0);
      deskGroup.add(monitorStand);

      // One laptop per pavilion: deliberately moved inward from the circular
      // outer edge so the ring reads as a real exhibition floor, not a crowded rim.
      // Every pavilion owns its laptop, giving generous spacing between displays.
      const laptop = create3DLaptop(sec.color, product);
      laptop.scale.setScalar(0.92);
      laptop.position.set(-1.45, 0.98, 0.62);
      laptop.rotation.y = Math.PI * 0.05;
      boothGroup.add(laptop);

      boothGroup.add(deskGroup);

      // -------------------------------------------------------------
      // REAL PRODUCTION EQUIPMENT DESIGNS ACCORDING TO SECTOR
      // -------------------------------------------------------------
      const equipGroup = new THREE.Group();
      equipGroup.position.set(0.72, 0.34, 0.45);

      if (sec.shape === 'agriculture') {
        // Autonomous Agriculture Harvester / Drone Unit
        const body = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.8, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.3, metalness: 0.6 })
        );
        body.position.y = 0.6;
        body.castShadow = true;
        equipGroup.add(body);

        // Rotating Harvester Cutter Reel
        const reelGroup = new THREE.Group();
        reelGroup.position.set(0, 0.4, 0.75);
        const reel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.35, 0.35, 1.4, 16),
          new THREE.MeshStandardMaterial({ color: 0x84cc16, metalness: 0.9, wireframe: true })
        );
        reel.rotation.z = Math.PI / 2;
        reelGroup.add(reel);
        equipGroup.add(reelGroup);
        dynamicAnimables.push(reelGroup);

        // Wheels
        [-0.75, 0.75].forEach((wx) => {
          [-0.4, 0.4].forEach((wz) => {
            const wheel = new THREE.Mesh(
              new THREE.CylinderGeometry(0.25, 0.25, 0.18, 16),
              new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 })
            );
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 0.25, wz);
            equipGroup.add(wheel);
          });
        });
      } else if (sec.shape === 'medical') {
        // Medical MRI / Diagnostic Scanner Gantry
        const ringGeo = new THREE.TorusGeometry(0.9, 0.22, 24, 48);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.1, metalness: 0.8 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.y = 1.1;
        ring.castShadow = true;
        equipGroup.add(ring);

        const innerRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.72, 0.04, 16, 32),
          new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
        );
        innerRing.position.y = 1.1;
        equipGroup.add(innerRing);
        dynamicAnimables.push(innerRing);

        // Patient Table
        const bed = new THREE.Mesh(
          new THREE.BoxGeometry(0.7, 0.12, 1.8),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 })
        );
        bed.position.set(0, 0.65, 0.1);
        bed.castShadow = true;
        equipGroup.add(bed);
      } else if (sec.shape === 'packaging') {
        // Packaging Line Conveyor & Box Sealer
        const belt = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.3, 2.0),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 })
        );
        belt.position.y = 0.4;
        belt.castShadow = true;
        equipGroup.add(belt);

        // Packages on Belt
        [-0.5, 0.1, 0.6].forEach((pz, idx) => {
          const box = new THREE.Mesh(
            new THREE.BoxGeometry(0.45, 0.35, 0.4),
            new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 })
          );
          box.position.set(0, 0.72, pz);
          box.castShadow = true;
          equipGroup.add(box);
          if (idx === 1) dynamicAnimables.push(box);
        });
      } else if (sec.shape === 'cnc') {
        // Industrial Enclosed CNC Milling Center
        const cncMachine = new THREE.Mesh(
          new THREE.BoxGeometry(2.15, 2.15, 1.9),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 })
        );
        cncMachine.position.y = 1.08;
        cncMachine.castShadow = true;
        equipGroup.add(cncMachine);

        // View Window Frame
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(1.1, 0.9),
          new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5, transmission: 0.8 })
        );
        win.position.set(0, 1.05, 0.81);
        equipGroup.add(win);

        // High-Speed Milling Cutter Tool
        const cutter = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16),
          new THREE.MeshStandardMaterial({ color: 0xff6b00, metalness: 0.9 })
        );
        cutter.position.set(0, 1.05, 0);
        equipGroup.add(cutter);
        dynamicAnimables.push(cutter);
      } else if (sec.shape === 'metal' || sec.shape === 'machinery') {
        // Generic industrial production cell used for metal, machinery,
        // aerospace, plastics, chemicals, energy, construction, textile,
        // marine and other production-heavy exhibition categories.
        const machineBody = new THREE.Mesh(
          new THREE.BoxGeometry(1.65, 1.25, 1.35),
          new THREE.MeshStandardMaterial({
            color: sec.colorHex,
            metalness: 0.82,
            roughness: 0.24
          })
        );
        machineBody.position.y = 0.72;
        machineBody.castShadow = true;
        equipGroup.add(machineBody);

        const spindle = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.75, 20),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.95, roughness: 0.15 })
        );
        spindle.position.set(0, 1.38, 0.05);
        equipGroup.add(spindle);
        dynamicAnimables.push(spindle);

        const controlPanel = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.5, 0.08),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 })
        );
        controlPanel.position.set(0.68, 0.9, 0.62);
        controlPanel.rotation.x = -0.18;
        equipGroup.add(controlPanel);

      } else if (sec.shape === 'automotive') {
        // Articulated Industrial Robotic Welding Arm
        const armBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.4, 0.5, 0.3, 24),
          new THREE.MeshStandardMaterial({ color: 0xb91c1c, metalness: 0.8 })
        );
        armBase.position.y = 0.15;
        equipGroup.add(armBase);

        const lowerJoint = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.9, 0.2),
          new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.8 })
        );
        lowerJoint.position.set(0, 0.6, 0);
        lowerJoint.rotation.z = -Math.PI / 8;
        equipGroup.add(lowerJoint);

        const upperArm = new THREE.Group();
        upperArm.position.set(-0.2, 0.9, 0);

        const armSeg = new THREE.Mesh(
          new THREE.BoxGeometry(0.16, 0.8, 0.16),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.9 })
        );
        armSeg.position.set(0.3, 0.3, 0);
        armSeg.rotation.z = Math.PI / 4;
        upperArm.add(armSeg);

        equipGroup.add(upperArm);
        dynamicAnimables.push(upperArm);
      } else {
        // Electronics Test Bench & Signal Analyzer Chip
        const pcbBoard = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 0.1, 1.4),
          new THREE.MeshStandardMaterial({ color: 0x065f46, roughness: 0.3, metalness: 0.5 })
        );
        pcbBoard.position.y = 0.4;
        pcbBoard.castShadow = true;
        equipGroup.add(pcbBoard);

        // Glowing Core Chip Processor
        const chip = new THREE.Mesh(
          new THREE.BoxGeometry(0.45, 0.08, 0.45),
          new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x9333ea, emissiveIntensity: 1.2 })
        );
        chip.position.set(0, 0.48, 0);
        equipGroup.add(chip);
        dynamicAnimables.push(chip);
      }

      boothGroup.add(equipGroup);
      stageRoot.add(boothGroup);
      boothMeshesMap[sec.name] = boothGroup;
    });

    boothMeshes.current = boothMeshesMap;
    animatedElements.current = dynamicAnimables;

    // 8. INTERACTION & CAMERA DRAG/ZOOM
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      controlsState.current.isDragging = true;
      controlsState.current.prevX = e.clientX;
      controlsState.current.prevY = e.clientY;
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (controlsState.current.isDragging) {
        const deltaX = e.clientX - controlsState.current.prevX;
        const deltaY = e.clientY - controlsState.current.prevY;
        controlsState.current.targetRotY += deltaX * 0.005;
        controlsState.current.targetRotX = Math.max(
          0.1,
          Math.min(0.85, controlsState.current.targetRotX + deltaY * 0.003)
        );
        controlsState.current.prevX = e.clientX;
        controlsState.current.prevY = e.clientY;
      }

      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(stageRoot.children, true);

      if (intersects.length > 0) {
        let foundBooth: string | null = null;
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr !== stageRoot) {
          if (curr.userData && curr.userData.sectorName) {
            foundBooth = curr.userData.sectorName;
            break;
          }
          curr = curr.parent;
        }
        setHoveredObject(foundBooth);
        container.style.cursor = foundBooth ? 'pointer' : 'grab';
      } else {
        setHoveredObject(null);
        container.style.cursor = 'grab';
      }
    };

    const handlePointerUp = () => {
      controlsState.current.isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      controlsState.current.targetZoom = Math.max(
        14,
        Math.min(38, controlsState.current.targetZoom + e.deltaY * 0.015)
      );
    };

    const handleClick = (e: MouseEvent) => {
      // Resolve the clicked 3D object directly so URL navigation does not
      // depend on React hover state (which can lag behind a fast click).
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(stageRoot.children, true);
      const hit = intersects.find((item) => item.object.userData?.product || item.object.parent?.userData?.isProductLaptop);

      if (hit) {
        let curr: THREE.Object3D | null = hit.object;
        let product = curr.userData?.product;
        while (!product && curr) {
          product = curr.userData?.product;
          curr = curr.parent;
        }

        if (product?.url) {
          window.location.href = product.url;
          return;
        }
      }

      if (hoveredObject) {
        setSelectedPavilion(hoveredObject);
        if (onSelectBooth) onSelectBooth(hoveredObject);
      }
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      controlsState.current.rotX += (controlsState.current.targetRotX - controlsState.current.rotX) * 0.06;
      controlsState.current.rotY += (controlsState.current.targetRotY - controlsState.current.rotY) * 0.06;
      controlsState.current.zoom += (controlsState.current.targetZoom - controlsState.current.zoom) * 0.06;

      if (isRotating && !controlsState.current.isDragging) {
        controlsState.current.targetRotY += delta * 0.12;
      }

      const dist = controlsState.current.zoom;
      const rX = controlsState.current.rotX;
      const rY = controlsState.current.rotY;

      camera.position.x = Math.sin(rY) * Math.cos(rX) * dist;
      camera.position.y = Math.sin(rX) * dist + 2.0;
      camera.position.z = Math.cos(rY) * Math.cos(rX) * dist;
      camera.lookAt(0, 1.35, 0);

      // orbit1.rotation.z += delta * 0.5;

      // Animate active equipment parts
      animatedElements.current.forEach((obj) => {
        obj.rotation.y += delta * 0.55;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      container.style.cursor = 'grab';
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating, onSelectBooth]);

  useEffect(() => {
    if (activeSector && boothMeshes.current[activeSector]) {
      setSelectedPavilion(activeSector);
      const targetBooth = boothMeshes.current[activeSector];
      const targetAngle = Math.atan2(targetBooth.position.x, targetBooth.position.z);
      controlsState.current.targetRotY = targetAngle - Math.PI;
    }
  }, [activeSector]);

  const resetView = () => {
    controlsState.current.targetRotX = 0.32;
    controlsState.current.targetRotY = -0.6;
    controlsState.current.targetZoom = 34;
  };

  return (
    <div className={`relative w-full h-screen bg-[#0f172a] select-none overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay HUD */}
      <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>FIRMEXPO • DIGITAL EXHIBITION</span>
        </div>
        <div className="text-xl font-bold text-white tracking-wide drop-shadow-md">
          {selectedPavilion}
        </div>
        <div className="max-w-xs text-[11px] leading-relaxed text-slate-300">
          Production • Products • Capabilities • Innovation
        </div>
      </div>

      {/* Hover Selection Indicator */}
      {hoveredObject && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-full text-xs shadow-lg backdrop-blur-sm transition-all">
          Open {hoveredObject}
        </div>
      )}

      {/* Stage Floating Action Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-lg border border-slate-700/60 p-1.5 rounded-2xl shadow-2xl">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${isRotating
            ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
            : 'text-slate-300 hover:bg-slate-800'
            }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          {isRotating ? 'Auto-Rotating' : 'Rotate Stage'}
        </button>

        <button
          onClick={resetView}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset View
        </button>
      </div>
    </div>
  );
};