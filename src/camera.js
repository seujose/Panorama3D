"use strict";

import { scene } from "./main.js";
import { camera } from "./main.js";
import { Vector3 } from "@babylonjs/core/Maths/math";

export function lookAt(targetPosition) {
  let v = new Vector3.Zero();
  setTimeout(() => {
    scene.registerBeforeRender(function f() {
      if (!v.equalsWithEpsilon(targetPosition, 0.1)) {
        v = Vector3.Lerp(camera.getTarget(), targetPosition, 0.033);
        camera.setTarget(v);
      }
    });
  }, 100);
}

 