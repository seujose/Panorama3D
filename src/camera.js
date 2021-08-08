"use strict";
import { canvas } from "./main.js";
import { scene } from "./main.js";
import { UniversalCamera } from "@babylonjs/core/Cameras/universalCamera";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

import { VirtualJoysticksCamera } from "@babylonjs/core/Cameras/virtualJoysticksCamera";
import { Matrix, Vector3 } from "@babylonjs/core/Maths/math";
import {
  xAddPos,
  yAddPos,
  xAddRot,
  yAddRot,
  mobileInput,
  makeThumbs,
} from "./ui";

let camera = undefined;
let initialPlayerPosition = new Vector3(0, 2, 20);
let translateTransform;

/**
 * cria joysticks na versao movel
 * @param {boolean} isMobile
 */
export function isMobileInput(isMobile) {
  camera = new UniversalCamera("UniversalCamera", initialPlayerPosition, scene);
  if (isMobile) {
    makeThumbs();
    scene.onBeforeStepObservable.add(function () {
      translateTransform = Vector3.TransformCoordinates(
        new Vector3(xAddPos / 3000, 0, yAddPos / 3000),
        Matrix.RotationY(scene.activeCamera.rotation.y)
      );
      scene.activeCamera.cameraDirection.addInPlace(translateTransform);
      scene.activeCamera.cameraRotation.y += (xAddRot / 70000) * -1;
      scene.activeCamera.cameraRotation.x += (yAddRot / 70000) * -1;
    });
  } else {
    console.log("%c usando input tradicional ", "color:red");
    setWASDInput();
    // createMesh('disc').addBehavior(followMouseBehavior);
  }
  camera.attachControl(canvas, true);
  scene.activeCamera = camera;
  camera.setTarget(new Vector3(0, 0, 0));
  camera.applyGravity = true;
  camera.checkCollisions = true;
  camera.ellipsoid = new Vector3(2, 1.5, 2);
}

export function moveCameraTo(targetName) {
  if (scene.getTransformNodeByName(targetName)) {
    scene.activeCamera.position.x = scene
      .getTransformNodeByName(targetName)
      .getAbsolutePosition().x;
    scene.activeCamera.position.z = scene
      .getTransformNodeByName(targetName)
      .getAbsolutePosition().z;
    //scene.activeCamera.setTarget(scene.getTransformNodeByName(targetName).getAbsolutePosition());
  } else {
    console.log("target to move camera not found");
  }
}

function setWASDInput() {
  let camera = scene.activeCamera;
  camera.keysUp = [87];
  camera.keysDown = [83];
  camera.keysLeft = [65];
  camera.keysRight = [68];
}

export function arcCamera() {
  let camera = new ArcRotateCamera(
    "Camera",
    -Math.PI / 2,
    Math.PI / 2,
    5,
    Vector3.Zero(),
    scene
  );
  camera.attachControl(canvas, true);
  camera.inputs.attached.mousewheel.detachControl(canvas);
  scene.activeCamera = camera;
  //camera.fov=1.5;
}
