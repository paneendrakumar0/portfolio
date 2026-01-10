import React, { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations, Float, Environment } from '@react-three/drei';

// NAMED EXPORT: This must be present to fix the Home.tsx syntax error
export function ExpressiveRobot({ action = 'Idle' }: { action?: string }) {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center"> 
      {/* dpr={1} prevents "Context Lost" on heavy scenes */}
      <Canvas shadows camera={{ position: [0, 1.5, 4.5], fov: 35 }} dpr={1}>
        <Suspense fallback={null}>
          <ambientLight intensity={1.5} /> 
          <Environment preset="city" /> 
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
            {/* MATCH FILENAME: Changed from sci_fi_robot.glb to robot.glb */}
            <RobotModel action={action} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}

function RobotModel({ action }: { action: string }) {
  const group = useRef<THREE.Group>(null!);
  // Loading the version found in your public folder
  const { scene, animations } = useGLTF('/robot2.glb'); 
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && names.length > 0) {
      const targetAnim = names.find(n => n.toLowerCase().includes(action.toLowerCase())) || names[0];
      actions[targetAnim]?.reset().fadeIn(0.5).play();
      return () => { actions[targetAnim]?.fadeOut(0.5); };
    }
  }, [action, actions, names]);

  return <primitive ref={group} object={scene} scale={1.2} position={[0, -1.2, 0]} />;
}

useGLTF.preload('/robot2.glb');