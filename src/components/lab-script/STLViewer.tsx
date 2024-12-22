import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface STLViewerProps {
  file: File;
}

export const STLViewer = ({ file }: STLViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    mesh?: THREE.Mesh;
  }>();

  useEffect(() => {
    if (!containerRef.current) return;

    console.log("Initializing STL viewer for file:", file.name);

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 100);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.innerHTML = ''; // Clear any existing content
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-1, -1, -1);
    scene.add(directionalLight2);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 50;
    controls.maxDistance = 300;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    sceneRef.current = { scene, camera, renderer, controls };

    // Load STL
    const loader = new STLLoader();
    const fileURL = URL.createObjectURL(file);
    
    console.log("Loading STL file from URL:", fileURL);
    
    loader.load(
      fileURL,
      (geometry) => {
        console.log("STL file loaded successfully");
        
        // Remove existing mesh if any
        if (sceneRef.current?.mesh) {
          scene.remove(sceneRef.current.mesh);
        }

        geometry.center();
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({ 
          color: 0x3f88c5,
          shininess: 30,
          specular: 0x111111
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        // Scale the model to fit the view
        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 50 / maxDim;
        mesh.scale.set(scale, scale, scale);
        
        scene.add(mesh);
        sceneRef.current.mesh = mesh;

        // Position camera to show the whole model
        const distance = maxDim * 2;
        camera.position.set(distance, distance, distance);
        camera.lookAt(scene.position);
        controls.update();

        console.log("Model added to scene with scale:", scale);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      (error) => {
        console.error('Error loading STL file:', error);
      }
    );

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      
      const { camera, renderer } = sceneRef.current;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log("Cleaning up STL viewer");
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && sceneRef.current) {
        containerRef.current.removeChild(sceneRef.current.renderer.domElement);
      }
      URL.revokeObjectURL(fileURL);
      sceneRef.current?.controls.dispose();
      sceneRef.current?.renderer.dispose();
    };
  }, [file]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full rounded-lg overflow-hidden bg-gray-50"
      style={{ touchAction: 'none' }}
    />
  );
};