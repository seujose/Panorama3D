import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color4, Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { createDome } from "./pano.js";
import { arcCamera } from "./camera.js";
export const canvas = document.getElementById("renderCanvas");
import { Material } from "@babylonjs/core/Materials/material";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Helpers, PhotoDome } from "@babylonjs/core/Helpers";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { createSceneBtns , createHotSpot} from "./ui.js";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";

export const engine = new Engine(canvas, true, {
  stencil: true,
  deterministicLockstep: true,
  lockstepMaxSteps: 4,
});
export let scene = new Scene(engine);
export const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('babylonUI',true, scene);
scene.gravity = new Vector3(0, -9.81, 0);
scene.collisionsEnabled = true;
scene.clearColor = new Color4(0, 0, 0, 0);
scene.debugLayer.show();
const imgArray = [
  "/assets/base.png",
  "/assets/balcao_0.png",
  "/assets/puffs_0.png",
  "/assets/sofa_0.png",
  "/assets/sofa_1.png",
  "/assets/sofa_2.png",
  "/assets/mesaCentral_0.png",
  "/assets/mesa_1.png",
  "/assets/mesa_0.png",
  "/assets/cadeira_1.png",
];

arcCamera();
window.addEventListener(
  "load",
  function () {
    /*  for (let index = 0; index < imgArray.length; index++) {
      const element = imgArray[index];
      const dome = new PhotoDome(
        imgArray[index],
        imgArray[index],
        {
          resolution: 64,
          size: 1000,
          //useDirectMapping:false,
        },
        scene
      );
      scene.getMaterialByID(
        imgArray[index] + "_material"
      ).diffuseTexture.hasAlpha = true;
    }*/
    createSceneBtns(imgArray);
    SceneLoader.Append("./assets/", "cena.gltf", scene, function (scene) {
      scene.meshes.forEach(function(m){
        createHotSpot(m);
      });
    });
  },
  false
);
window.addEventListener("resize", () => {
  engine.resize();
});
engine.runRenderLoop(() => {
  scene.render();
});
