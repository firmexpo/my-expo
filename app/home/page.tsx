// app/page.tsx  (or pages/index.tsx)
'use client';

import { useEffect, useRef } from 'react';
import Head from 'next/head';
import { Stage3DCanvas } from './components/Stage3DCanvas';

export default function Home() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let renderer: import('three').WebGLRenderer | undefined;
    let labelRenderer: import('three/examples/jsm/renderers/CSS2DRenderer').CSS2DRenderer | undefined;
    let scene: import('three').Scene | undefined;
    let camera: import('three').PerspectiveCamera | undefined;
    let animationId: number;
    let ring: import('three').Mesh | undefined;
    let particles: import('three').Points | undefined;
    let autoGroup: import('three').Group | undefined;

    type FloatableLabel = {
      label: import('three/examples/jsm/renderers/CSS2DRenderer').CSS2DObject;
      baseY: number;
      offset: number;
    };
    const objects: FloatableLabel[] = [];

    let cleanupFn: (() => void) | undefined;

    const initThree = async (): Promise<void> => {
      if (!mountRef.current) return;

      const THREE = await import('three');
      const { CSS2DRenderer, CSS2DObject } = await import(
        'three/examples/jsm/renderers/CSS2DRenderer.js'
      );

      // --- Scene ---
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b0e14);

      // --- Camera ---
      camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(8, 5, 18);
      camera.lookAt(0, 2, 0);

      // --- WebGL Renderer ---
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      mountRef.current.appendChild(renderer.domElement);

      // --- CSS2D Renderer (labels) ---
      labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0px';
      labelRenderer.domElement.style.left = '0px';
      labelRenderer.domElement.style.pointerEvents = 'none';
      mountRef.current.appendChild(labelRenderer.domElement);

      // --- Lighting ---
      scene.add(new THREE.AmbientLight(0x404060));

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
      keyLight.position.set(5, 12, 8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 25;
      keyLight.shadow.camera.left = -10;
      keyLight.shadow.camera.right = 10;
      keyLight.shadow.camera.top = 10;
      keyLight.shadow.camera.bottom = -10;
      keyLight.shadow.bias = -0.0001;
      scene.add(keyLight);

      const fillLight1 = new THREE.PointLight(0x1e5eff, 0.6);
      fillLight1.position.set(-5, 3, 5);
      scene.add(fillLight1);

      const fillLight2 = new THREE.PointLight(0xffaa33, 0.3);
      fillLight2.position.set(6, 4, -5);
      scene.add(fillLight2);

      const rimLight1 = new THREE.SpotLight(0xffffff, 0.8);
      rimLight1.position.set(-2, 8, 10);
      rimLight1.angle = 0.5;
      rimLight1.penumbra = 0.5;
      rimLight1.decay = 1;
      rimLight1.distance = 30;
      scene.add(rimLight1);

      // --- Central Stage ---
      const stageGeometry = new THREE.CylinderGeometry(6, 6, 0.5, 64);
      const stageMaterial = new THREE.MeshStandardMaterial({
        color: 0x11161f,
        roughness: 0.4,
        metalness: 0.7,
        emissive: new THREE.Color(0x0a0e14),
        emissiveIntensity: 0.2,
      });
      const stage = new THREE.Mesh(stageGeometry, stageMaterial);
      stage.position.set(0, -0.25, 0);
      stage.receiveShadow = true;
      scene.add(stage);

      const ringGeometry = new THREE.TorusGeometry(6, 0.05, 32, 100);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e5eff,
        emissive: new THREE.Color(0x1e5eff),
        emissiveIntensity: 1.5,
      });
      ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(0, 0.02, 0);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      // --- Platform helper ---
      const createPlatform = (
        x: number,
        z: number,
        radius = 1.5,
        height = 0.2,
        color = 0x1a1f2b
      ): void => {
        const geo = new THREE.CylinderGeometry(radius, radius, height, 32);
        const mat = new THREE.MeshStandardMaterial({
          color,
          roughness: 0.5,
          metalness: 0.6,
        });
        const platform = new THREE.Mesh(geo, mat);
        platform.position.set(x, height / 2, z);
        platform.castShadow = true;
        platform.receiveShadow = true;
        scene!.add(platform);

        const rim = new THREE.Mesh(
          new THREE.TorusGeometry(radius + 0.02, 0.03, 16, 50),
          new THREE.MeshStandardMaterial({
            color: 0x1e5eff,
            emissive: new THREE.Color(0x1e5eff),
            emissiveIntensity: 1.0,
          })
        );
        rim.rotation.x = Math.PI / 2;
        rim.position.set(x, 0.02, z);
        scene!.add(rim);
      };

      createPlatform(-3.5, 3.5, 1.8, 0.3, 0x141a24);
      createPlatform(4, 3, 1.8, 0.3, 0x141a24);
      createPlatform(-4, -2.5, 1.8, 0.3, 0x141a24);
      createPlatform(3.5, -3, 1.8, 0.3, 0x141a24);
      createPlatform(0, 4.5, 2.0, 0.3, 0x1a2130);

      // --- Floating screens ---
      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x1e5eff,
        emissive: new THREE.Color(0x1e5eff),
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.15,
      });
      const screenGeo = new THREE.BoxGeometry(0.1, 1.2, 1.8);
      for (let i = 0; i < 8; i++) {
        const screen = new THREE.Mesh(screenGeo, screenMat.clone());
        screen.position.set(
          (Math.random() - 0.5) * 18,
          3 + Math.random() * 5,
          -8 + Math.random() * 6
        );
        screen.rotation.y = Math.random() * Math.PI;
        screen.rotation.x = Math.random() * 0.2;
        scene.add(screen);
      }

      // --- Particles ---
      const particleCount = 600;
      const particlesGeo = new THREE.BufferGeometry();
      const particlesPos = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlesPos[i] = (Math.random() - 0.5) * 50;
        particlesPos[i + 1] = Math.random() * 15 + 1;
        particlesPos[i + 2] = (Math.random() - 0.5) * 30 - 5;
      }
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
      const particlesMat = new THREE.PointsMaterial({
        color: 0x1e5eff,
        size: 0.08,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      });
      particles = new THREE.Points(particlesGeo, particlesMat);
      scene.add(particles);

      // --- Label helper ---
      const createLabel = (
        text: string,
        subtext = '',
        color = '#ffffff',
        bg = 'rgba(11,14,20,0.8)'
      ): import('three/examples/jsm/renderers/CSS2DRenderer').CSS2DObject => {
        const div = document.createElement('div');
        div.textContent = text;
        div.style.color = color;
        div.style.fontFamily = 'Inter, sans-serif';
        div.style.fontSize = '16px';
        div.style.fontWeight = '600';
        div.style.letterSpacing = '-0.01em';
        div.style.background = bg;
        div.style.padding = '6px 14px';
        div.style.borderRadius = '4px';
        div.style.borderLeft = '4px solid #1e5eff';
        div.style.boxShadow = '0 10px 20px -5px rgba(0,0,0,0.5)';
        div.style.backdropFilter = 'blur(4px)';
        if (subtext) {
          const sub = document.createElement('div');
          sub.textContent = subtext;
          sub.style.fontSize = '10px';
          sub.style.fontWeight = '400';
          sub.style.color = '#b0b8c5';
          sub.style.marginTop = '2px';
          sub.style.letterSpacing = '0.05em';
          div.appendChild(sub);
        }
        return new CSS2DObject(div);
      };

      // --- Exhibits ---
      // CNC
      const cncGroup = new THREE.Group();
      const cncBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.8, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x2a2f3a, roughness: 0.3, metalness: 0.8 })
      );
      cncBase.position.y = 0.4;
      cncBase.castShadow = true;
      cncGroup.add(cncBase);
      const cncArm = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 1.0, 0.2),
        new THREE.MeshStandardMaterial({
          color: 0x1e5eff,
          emissive: new THREE.Color(0x1e5eff),
          emissiveIntensity: 0.5,
        })
      );
      cncArm.position.set(0.3, 1.0, 0.3);
      cncArm.castShadow = true;
      cncGroup.add(cncArm);
      cncGroup.position.set(-3.5, 0.15, 3.5);
      scene.add(cncGroup);

      const cncLabel = createLabel('PRECISION CNC', '5-axis machining');
      cncLabel.position.set(-3.5, 1.9, 3.5);
      scene.add(cncLabel);
      objects.push({ label: cncLabel, baseY: 1.9, offset: 0 });

      // Steel
      const steelGroup = new THREE.Group();
      const steelBeam = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 0.3, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x8a8f9a, roughness: 0.2, metalness: 0.9 })
      );
      steelBeam.position.y = 0.3;
      steelBeam.castShadow = true;
      steelGroup.add(steelBeam);
      const steelBeam2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.3, 1.2),
        new THREE.MeshStandardMaterial({ color: 0x8a8f9a, roughness: 0.2, metalness: 0.9 })
      );
      steelBeam2.position.set(0.3, 0.65, 0);
      steelBeam2.castShadow = true;
      steelGroup.add(steelBeam2);
      steelGroup.position.set(4, 0.15, 3);
      scene.add(steelGroup);

      const steelLabel = createLabel('STEEL & METALS', 'structural fabrication');
      steelLabel.position.set(4, 1.6, 3);
      scene.add(steelLabel);
      objects.push({ label: steelLabel, baseY: 1.6, offset: 1 });

      // Automotive
      autoGroup = new THREE.Group();
      const gear = new THREE.Mesh(
        new THREE.TorusGeometry(0.6, 0.15, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0x3a3f4a, roughness: 0.3, metalness: 0.8 })
      );
      gear.rotation.x = Math.PI / 2;
      gear.position.y = 0.5;
      gear.castShadow = true;
      autoGroup.add(gear);
      const gear2 = new THREE.Mesh(
        new THREE.TorusGeometry(0.4, 0.1, 16, 32),
        new THREE.MeshStandardMaterial({ color: 0x5a5f6a, roughness: 0.3, metalness: 0.8 })
      );
      gear2.rotation.x = Math.PI / 2;
      gear2.position.set(0.7, 0.5, 0.5);
      gear2.castShadow = true;
      autoGroup.add(gear2);
      autoGroup.position.set(-4, 0.15, -2.5);
      scene.add(autoGroup);

      const autoLabel = createLabel('AUTOMOTIVE', 'engine components');
      autoLabel.position.set(-4, 1.6, -2.5);
      scene.add(autoLabel);
      objects.push({ label: autoLabel, baseY: 1.6, offset: 2 });

      // Medical
      const medGroup = new THREE.Group();
      const medBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.8, 16),
        new THREE.MeshStandardMaterial({ color: 0x2a3a4a, roughness: 0.2, metalness: 0.5 })
      );
      medBase.position.y = 0.4;
      medBase.castShadow = true;
      medGroup.add(medBase);
      const medTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0x4a8aff,
          emissive: new THREE.Color(0x1e5eff),
          emissiveIntensity: 0.3,
        })
      );
      medTop.position.y = 0.9;
      medTop.castShadow = true;
      medGroup.add(medTop);
      medGroup.position.set(3.5, 0.15, -3);
      scene.add(medGroup);

      const medLabel = createLabel('MEDICAL EQUIPMENT', 'surgical instruments');
      medLabel.position.set(3.5, 1.6, -3);
      scene.add(medLabel);
      objects.push({ label: medLabel, baseY: 1.6, offset: 3 });

      // Electronics
      const techGroup = new THREE.Group();
      const chipBase = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 0.2, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x1a2a3a, roughness: 0.3, metalness: 0.7 })
      );
      chipBase.position.y = 0.2;
      chipBase.castShadow = true;
      chipBase.receiveShadow = true;
      techGroup.add(chipBase);
      for (let i = -1; i <= 1; i += 2) {
        for (let j = -1; j <= 1; j += 2) {
          const pin = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.4, 0.1),
            new THREE.MeshStandardMaterial({
              color: 0xcccccc,
              emissive: new THREE.Color(0x1e5eff),
              emissiveIntensity: 0.2,
            })
          );
          pin.position.set(i * 0.5, 0.5, j * 0.5);
          pin.castShadow = true;
          techGroup.add(pin);
        }
      }
      techGroup.position.set(0, 0.15, 4.5);
      scene.add(techGroup);

      const techLabel = createLabel('ELECTRONICS', 'PCB & semiconductors');
      techLabel.position.set(0, 1.9, 4.5);
      scene.add(techLabel);
      objects.push({ label: techLabel, baseY: 1.9, offset: 4 });

      // Extra labels
      const innovationLabel = createLabel(
        'INNOVATION',
        'R&D showcase',
        '#b0b8c5',
        'rgba(30,94,255,0.2)'
      );
      innovationLabel.position.set(-1.5, 5.5, -2);
      scene.add(innovationLabel);
      objects.push({ label: innovationLabel, baseY: 5.5, offset: 5 });

      const capabilityLabel = createLabel(
        'CAPABILITIES',
        'production ecosystem',
        '#b0b8c5',
        'rgba(30,94,255,0.2)'
      );
      capabilityLabel.position.set(2, 6, 1);
      scene.add(capabilityLabel);
      objects.push({ label: capabilityLabel, baseY: 6, offset: 6 });

      // --- Grid + columns ---
      const gridHelper = new THREE.GridHelper(40, 40, 0x1e5eff, 0x1e5eff);
      (gridHelper.material as THREE.Material).transparent = true;
      (gridHelper.material as THREE.Material).opacity = 0.15;
      gridHelper.position.y = -0.01;
      scene.add(gridHelper);

      const columnMat = new THREE.MeshStandardMaterial({
        color: 0x1e5eff,
        emissive: new THREE.Color(0x1e5eff),
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.3,
      });
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 8;
        const column = new THREE.Mesh(
          new THREE.CylinderGeometry(0.1, 0.1, 3, 8),
          columnMat
        );
        column.position.set(Math.cos(angle) * radius, 1.5, Math.sin(angle) * radius);
        scene.add(column);
      }

      // --- Animation ---
      const animate = (): void => {
        animationId = requestAnimationFrame(animate);
        const elapsedTime = performance.now() * 0.001;

        if (ring) ring.rotation.z += 0.0005;
        if (particles) particles.rotation.y += 0.0002;
        if (autoGroup) autoGroup.rotation.y += 0.005;

        objects.forEach(({ label, baseY, offset }) => {
          label.position.y = baseY + Math.sin(elapsedTime * 1.5 + offset) * 0.05;
        });

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
        if (labelRenderer && scene && camera) {
          labelRenderer.render(scene, camera);
        }
      };

      animate();

      // --- Resize ---
      const handleResize = (): void => {
        if (!camera || !renderer || !labelRenderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      cleanupFn = () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    initThree();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationId);
      if (cleanupFn) cleanupFn();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
      if (labelRenderer && labelRenderer.domElement.parentNode) {
        labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
      }
      if (scene) {
        scene.traverse((obj) => {
          const mesh = obj as import('three').Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          const mat = mesh.material as
            | import('three').Material
            | import('three').Material[]
            | undefined;
          if (Array.isArray(mat)) {
            mat.forEach((m) => m.dispose());
          } else if (mat) {
            mat.dispose();
          }
        });
      }
    };
  }, []);

  return (
    <>
      <Stage3DCanvas/>
    </>
  );
}