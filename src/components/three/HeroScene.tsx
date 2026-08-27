"use client";

import { useEffect, useRef } from "react";

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let destroyed = false;

    const init = async () => {
      try {
        const THREE = await import("three");

        if (destroyed) return;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        });

        const dpr = Math.min(window.devicePixelRatio, 1.8);
        renderer.setPixelRatio(dpr);
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x080808, 0.04);

        // Camera
        const camera = new THREE.PerspectiveCamera(
          55,
          canvas.clientWidth / canvas.clientHeight,
          0.1,
          100
        );
        camera.position.set(0, 0, 4);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x4a9eff, 4, 12);
        pointLight1.position.set(2, 3, 2);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x8888ff, 2, 10);
        pointLight2.position.set(-3, -1, 1);
        scene.add(pointLight2);

        const rimLight = new THREE.PointLight(0xffffff, 1, 8);
        rimLight.position.set(0, 0, 5);
        scene.add(rimLight);

        // Determine quality tier
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth < 1200;
        const segments = isMobile ? 48 : isTablet ? 80 : 128;

        // Main geometry — abstract distorted sphere using custom shader
        const geometry = new THREE.IcosahedronGeometry(1.2, isMobile ? 4 : 8);

        // Store original positions for distortion
        const positionAttr = geometry.attributes.position;
        const originalPositions = new Float32Array(positionAttr.array.length);
        for (let i = 0; i < positionAttr.array.length; i++) {
          originalPositions[i] = positionAttr.array[i];
        }

        // Wireframe overlay
        const wireGeo = new THREE.IcosahedronGeometry(1.22, isMobile ? 2 : 4);
        const wireMat = new THREE.MeshBasicMaterial({
          color: 0x4a9eff,
          wireframe: true,
          transparent: true,
          opacity: 0.06,
        });
        const wireMesh = new THREE.Mesh(wireGeo, wireMat);
        scene.add(wireMesh);

        // Main mesh with custom shader material
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            mouseX: { value: 0 },
            mouseY: { value: 0 },
            colorA: { value: new THREE.Color(0x0b1a2e) },
            colorB: { value: new THREE.Color(0x1a2a1e) },
            colorAccent: { value: new THREE.Color(0x4a9eff) },
          },
          vertexShader: `
            uniform float time;
            uniform float mouseX;
            uniform float mouseY;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vDisplace;
            
            // Simple noise
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
            vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
            
            float snoise(vec3 v) {
              const vec2 C = vec2(1.0/6.0, 1.0/3.0);
              const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
              vec3 i = floor(v + dot(v, C.yyy));
              vec3 x0 = v - i + dot(i, C.xxx);
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min(g.xyz, l.zxy);
              vec3 i2 = max(g.xyz, l.zxy);
              vec3 x1 = x0 - i1 + C.xxx;
              vec3 x2 = x0 - i2 + C.yyy;
              vec3 x3 = x0 - D.yyy;
              i = mod289(i);
              vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
                i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
                i.x + vec4(0.0, i1.x, i2.x, 1.0));
              float n_ = 0.142857142857;
              vec3 ns = n_ * D.wyz - D.xzx;
              vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_);
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              vec4 b0 = vec4(x.xy, y.xy);
              vec4 b1 = vec4(x.zw, y.zw);
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
              vec3 p0 = vec3(a0.xy, h.x);
              vec3 p1 = vec3(a0.zw, h.y);
              vec3 p2 = vec3(a1.xy, h.z);
              vec3 p3 = vec3(a1.zw, h.w);
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
              p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
              vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
            }
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              
              float t = time * 0.3;
              float noise = snoise(position * 1.4 + vec3(t * 0.6, t * 0.4, t * 0.5));
              float noise2 = snoise(position * 2.2 - vec3(t * 0.3, t * 0.7, t * 0.2));
              
              float mouseInfluence = mouseX * position.x * 0.12 + mouseY * position.y * 0.12;
              
              float displacement = noise * 0.18 + noise2 * 0.08 + mouseInfluence * 0.05;
              vDisplace = displacement;
              
              vec3 newPos = position + normal * displacement;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 colorA;
            uniform vec3 colorB;
            uniform vec3 colorAccent;
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            varying float vDisplace;
            
            void main() {
              vec3 lightDir = normalize(vec3(1.0, 1.5, 2.0));
              float diffuse = max(dot(vNormal, lightDir), 0.0);
              
              vec3 lightDir2 = normalize(vec3(-2.0, -0.5, 1.0));
              float diffuse2 = max(dot(vNormal, lightDir2), 0.0);
              
              float t = vPosition.y * 0.5 + 0.5;
              vec3 baseColor = mix(colorA, colorB, t);
              
              float accent = max(0.0, vDisplace + 0.1) * 2.5;
              baseColor = mix(baseColor, colorAccent, accent * 0.35);
              
              vec3 color = baseColor * (0.3 + diffuse * 0.7 + diffuse2 * 0.2);
              color += colorAccent * diffuse * 0.12;
              
              float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
              rim = pow(rim, 3.0);
              color += colorAccent * rim * 0.25;
              
              gl_FragColor = vec4(color, 0.92);
            }
          `,
          transparent: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Particle field
        const particleCount = isMobile ? 600 : isTablet ? 1200 : 2200;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleSizes = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = 2.2 + Math.random() * 4;
          particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          particlePositions[i * 3 + 2] = r * Math.cos(phi) - 1;
          particleSizes[i] = Math.random() * 1.5 + 0.5;
        }

        particleGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(particlePositions, 3)
        );
        particleGeo.setAttribute(
          "size",
          new THREE.BufferAttribute(particleSizes, 1)
        );

        const particleMat = new THREE.PointsMaterial({
          color: 0x6ab4ff,
          size: 0.015,
          transparent: true,
          opacity: 0.5,
          sizeAttenuation: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // Mouse tracking
        const mouse = { x: 0, y: 0, vx: 0, vy: 0 };
        const targetRot = { x: 0, y: 0 };
        const currentRot = { x: 0, y: 0 };

        const handleMouseMove = (e: MouseEvent) => {
          const px = e.clientX / window.innerWidth;
          const py = e.clientY / window.innerHeight;
          mouse.vx = (px - 0.5) * 2 - mouse.x;
          mouse.vy = (py - 0.5) * 2 - mouse.y;
          mouse.x = (px - 0.5) * 2;
          mouse.y = (py - 0.5) * 2;
          targetRot.y = mouse.x * 0.3;
          targetRot.x = -mouse.y * 0.2;
        };

        window.addEventListener("mousemove", handleMouseMove, {
          passive: true,
        });

        // Visibility
        let isVisible = true;
        const observer = new IntersectionObserver(
          (entries) => {
            isVisible = entries[0].isIntersecting;
          },
          { threshold: 0.05 }
        );
        observer.observe(canvas);

        const handleVisibility = () => {
          isVisible = !document.hidden;
        };
        document.addEventListener("visibilitychange", handleVisibility);

        // Resize
        const handleResize = () => {
          if (!canvas.parentElement) return;
          const w = canvas.parentElement.clientWidth;
          const h = canvas.parentElement.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        };
        window.addEventListener("resize", handleResize, { passive: true });

        // Animation loop
        let time = 0;
        const animate = () => {
          if (destroyed) return;
          animFrameRef.current = requestAnimationFrame(animate);
          if (!isVisible) return;

          time += 0.008;

          // Smooth camera follow
          currentRot.x += (targetRot.x - currentRot.x) * 0.04;
          currentRot.y += (targetRot.y - currentRot.y) * 0.04;

          camera.position.x = currentRot.y * 0.5;
          camera.position.y = currentRot.x * 0.3;
          camera.lookAt(0, 0, 0);

          // Update shader
          (material.uniforms.time as { value: number }).value = time;
          (material.uniforms.mouseX as { value: number }).value = mouse.x * 0.5;
          (material.uniforms.mouseY as { value: number }).value = mouse.y * 0.5;

          // Slow rotation
          mesh.rotation.y = time * 0.08;
          mesh.rotation.z = time * 0.04;
          wireMesh.rotation.y = -time * 0.06;
          wireMesh.rotation.x = time * 0.03;

          particles.rotation.y = time * 0.02;
          particles.rotation.x = time * 0.01;

          // Light orbits
          pointLight1.position.x = Math.sin(time * 0.5) * 3;
          pointLight1.position.z = Math.cos(time * 0.5) * 2;
          pointLight2.position.x = Math.cos(time * 0.4) * -3;
          pointLight2.position.z = Math.sin(time * 0.4) * 2;

          renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        cleanupRef.current = () => {
          destroyed = true;
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("resize", handleResize);
          document.removeEventListener("visibilitychange", handleVisibility);
          observer.disconnect();
          geometry.dispose();
          wireGeo.dispose();
          particleGeo.dispose();
          material.dispose();
          wireMat.dispose();
          particleMat.dispose();
          renderer.dispose();
        };
      } catch (err) {
        console.warn("WebGL initialization failed, using fallback.", err);
      }
    };

    init();

    return () => {
      if (cleanupRef.current) cleanupRef.current();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-canvas"
      style={{ width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  );
}
