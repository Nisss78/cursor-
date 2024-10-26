import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useLoader, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, PerspectiveCamera } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import * as THREE from 'three';

interface VRMModelProps {
  url: string;
  isSpeaking: boolean;
}

function VRMModel({ url, isSpeaking }: VRMModelProps) {
  const gltfRef = useRef<any>();
  const vrmRef = useRef<any>();
  const [mouthOpen, setMouthOpen] = React.useState(0);
  const mouthSpeed = 3;
  const maxMouthOpen = 0.7;

  const gltf = useLoader(GLTFLoader, url, (loader) => {
    loader.register((parser) => {
      return new VRMLoaderPlugin(parser);
    });
  });

  useEffect(() => {
    if (gltf.userData.vrm) {
      const vrm = gltf.userData.vrm;
      vrmRef.current = vrm;
      
      // VRMモデルの初期位置を設定
      vrm.scene.rotation.y = Math.PI; // ユーザーと向かい合わせる
      vrm.scene.position.set(-0.5, -0.9, 0);
      vrm.scene.scale.set(1, 1, 1);

      if (vrm.humanoid) {
        // T字のポーズから腕を下ろしたポーズに変更
        const leftUpperArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm');
        const rightUpperArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm');
        if (leftUpperArm) leftUpperArm.rotation.set(0, 0, Math.PI / 2.2); // 腕を下ろす
        if (rightUpperArm) rightUpperArm.rotation.set(0, 0, -Math.PI / 2.2); // 腕を下ろす

        // 肘をまっすぐに
        const leftLowerArm = vrm.humanoid.getNormalizedBoneNode('leftLowerArm');
        const rightLowerArm = vrm.humanoid.getNormalizedBoneNode('rightLowerArm');
        if (leftLowerArm) leftLowerArm.rotation.set(0, 0, 0); // 肘を下ろす
        if (rightLowerArm) rightLowerArm.rotation.set(0, 0, 0); // 肘を下ろす

        // 手首をまっすぐに
        const leftHand = vrm.humanoid.getNormalizedBoneNode('leftHand');
        const rightHand = vrm.humanoid.getNormalizedBoneNode('rightHand');
        if (leftHand) leftHand.rotation.set(0, 0, 0); // 手首を下ろす
        if (rightHand) rightHand.rotation.set(0, 0, 0); // 手首を下ろす

        vrm.humanoid.update();
      }
    }
  }, [gltf]);

  useFrame((_, delta) => {
    if (vrmRef.current) {
      const vrm = vrmRef.current;

      if (isSpeaking) {
        setMouthOpen((prev) => {
          const next = prev + delta * mouthSpeed;
          const mouthValue = Math.abs(Math.sin(next)) * maxMouthOpen;
          if (vrm.expressionManager) {
            vrm.expressionManager.setValue('aa', mouthValue);
          }
          return next;
        });
      } else if (vrm.expressionManager) {
        vrm.expressionManager.setValue('aa', 0);
      }

      vrm.update(delta);
    }
  });

  // カスタムマテリアルを作成して黄色のみに設定
  const yellowMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });

  return (
    <group>
      <TransformControls 
        mode="translate" 
        showX={true}
        showY={true}
        showZ={false}
        size={1000000000000000000000000000
        }
      >
        <primitive object={gltf.scene} ref={gltfRef} material={yellowMaterial} />
      </TransformControls>
    </group>
  );
}

interface VRMViewerProps {
  vrmUrl: string;
  isSpeaking: boolean;
}

export const VRMViewer: React.FC<VRMViewerProps> = ({ vrmUrl, isSpeaking }) => {
  if (!vrmUrl) return null;

  return (
    <div className="relative z-10 w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={30} />
        <Suspense fallback={null}>
          <VRMModel url={vrmUrl} isSpeaking={isSpeaking} />
          <OrbitControls
            makeDefault
            enablePan={false}
            enableZoom={true}
            enableRotate={false}
            minDistance={1.5}
            maxDistance={4}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} />
        </Suspense>
      </Canvas>
    </div>
  );
};
