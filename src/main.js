import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine } from "@babylonjs/core/Engines/engine";
import {
  Color3,
  Color4,
  Quaternion,
  Vector3,
} from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { createDome } from "./pano.js";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
export const canvas = document.getElementById("renderCanvas");
import { Material } from "@babylonjs/core/Materials/material";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Helpers, PhotoDome } from "@babylonjs/core/Helpers";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { createSceneBtns, createHotSpot, createVideo } from "./ui.js";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { VideoTexture } from "@babylonjs/core/Materials/Textures/videoTexture";

export const engine = new Engine(canvas, true, {
  stencil: true,
  deterministicLockstep: true,
  lockstepMaxSteps: 4,
});
export let scene = new Scene(engine);
export const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
  "babylonUI",
  true,
  scene
);
export let furniture = [];
export const camera = new UniversalCamera("camera", new Vector3.Zero(), scene);
camera.attachControl(canvas, true);
//camera.inputs.attached.mousewheel.detachControl(canvas);
scene.activeCamera = camera;

scene.gravity = new Vector3(0, -9.81, 0);
scene.collisionsEnabled = true;
scene.clearColor = new Color4(0, 0, 0, 0);
scene.debugLayer.show();
const imgArray = [
  "/cadeira.png",
  "/mesa_central.png",
  "/sofa_0.png",
  "/sofa_1.png",
  "/puff_0.png",
  "/mesa_cadeiras.png",
  "/aparador.png",
  "/base.png",
];
const videoTextureArray = ["/video_0.webm", "/video2.mp4", "/video3.mp4"];
//arcCamera();
window.addEventListener(
  "load",
  function () {
    imgArray.reverse(); //obedece ordem dos layer do Photoshop
    createSceneBtns(imgArray);

    SceneLoader.Append("./", "sceneMesh.glb", scene, function (scene) {
      furniture = scene.meshes;
      scene.meshes[0].scaling = new Vector3(100, 100, -100);
      scene.meshes[0].position = new Vector3(0, -150, 0);
      scene.meshes[0].rotationQuaternion = new Quaternion.RotationYawPitchRoll(
        0,
        0,
        0
      );
      scene.transformNodes[1].getChildMeshes(false).forEach(function (m) {
        if (!m.name.includes("videoWall")) {
          //createHotSpot(m);
          m.visibility = 0;
        } else {
          let videoMat = new StandardMaterial(m.name + "_videoMaterial", scene);
          let videoTexture = new VideoTexture(
            videoTextureArray[0],
            videoTextureArray[0],
            scene,
            false,
            true
          );
          videoMat.opacityTexture = videoTexture;
          videoTexture.video.muted = true;
          videoTexture.video.play();
          m.material = videoMat;
          m.material.emissiveTexture = videoTexture;
        }
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
