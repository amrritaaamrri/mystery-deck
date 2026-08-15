/**
 * Arcana Match design contract: a restrained living velvet backdrop beneath the tactile tarot board.
 */

import { Engine } from "@babylonjs/core/Engines/engine";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Scene } from "@babylonjs/core/scene";

export type GameHandle = {
  scene: Scene;
  dispose: () => void;
};

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<GameHandle> {
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.075, 0.004, 0.025, 1);

  const camera = new FreeCamera("velvet-camera", new Vector3(0, 0, -10), scene);
  camera.fov = 0.95;
  camera.setTarget(Vector3.Zero());
  camera.detachControl();

  const velvet = MeshBuilder.CreatePlane("velvet-plane", { width: 30, height: 18 }, scene);
  const velvetMaterial = new StandardMaterial("velvet-material", scene);
  velvetMaterial.diffuseColor = new Color3(0.18, 0.006, 0.055);
  velvetMaterial.emissiveColor = new Color3(0.038, 0.001, 0.01);
  velvetMaterial.specularColor = Color3.Black();
  velvet.material = velvetMaterial;

  const motes = Array.from({ length: 24 }, (_, index) => {
    const mote = MeshBuilder.CreatePlane(`gold-mote-${index}`, { size: 0.018 + (index % 4) * 0.012 }, scene);
    mote.position = new Vector3(
      -6.5 + ((index * 1.73) % 13),
      -4.2 + ((index * 2.11) % 8.4),
      -0.3 - (index % 3) * 0.03,
    );
    const material = new StandardMaterial(`gold-mote-material-${index}`, scene);
    material.emissiveColor = new Color3(0.82, 0.57, 0.19);
    material.alpha = 0.16 + (index % 3) * 0.08;
    material.disableLighting = true;
    mote.material = material;
    return { mote, phase: index * 0.87 };
  });

  scene.onBeforeRenderObservable.add(() => {
    const seconds = performance.now() * 0.001;
    motes.forEach(({ mote, phase }, index) => {
      mote.position.y += Math.sin(seconds * 0.25 + phase) * 0.0009;
      mote.rotation.z = Math.sin(seconds * 0.45 + phase) * 0.45;
      mote.scaling.x = 0.8 + Math.sin(seconds * 0.7 + index) * 0.18;
    });
  });

  return {
    scene,
    dispose: () => scene.dispose(),
  };
}
