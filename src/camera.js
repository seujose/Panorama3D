"use strict";

import { canvas , scene } from "./main.js";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";

import { Matrix, Vector3 } from "@babylonjs/core/Maths/math";
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
  //camera.fov=1.1;
}
