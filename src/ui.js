"use strict";
import {
  canvas,
  scene,
  rootStand,
  assetsPath,
  engine,
  furniture,
} from "./main.js";
import { lookAt } from "./camera";
import { Tags } from "@babylonjs/core/Misc/tags";
import { AdvancedTexture } from "@babylonjs/gui/2D";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { Helpers, PhotoDome } from "@babylonjs/core/Helpers";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Animations, CubicEase } from "@babylonjs/core/Animations";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { BackgroundMaterial } from "@babylonjs/core/Materials/Background/backgroundMaterial";
import { camera, advancedTexture } from "./main.js";

import {
  Button,
  Control,
  Rectangle,
  TextBlock,
  Ellipse,
  Line,
} from "@babylonjs/gui/2D";

export function createSceneBtns(imgArray) {
  for (let i = 0; i < imgArray.length; i++) {
    let button = document.createElement("button");
    button.type = "button";
    button.style.fontSize = "32px";
    let cleanName = imgArray[i].replaceAll(".png", "").replaceAll("/", ""); //.replaceAll('_', '');
    button.innerHTML = cleanName;
    document.getElementById("controls").appendChild(button);
    button.onclick = function () {
      //se node ja existe, destrui-lo e tambem UI flutuante
      if (scene.getMeshByName(this.innerHTML + "_mesh")) {
        fadeOutHotSpot(this.innerHTML);
        let domeMat = scene.getMaterialByID(this.innerHTML + "_material");
        scene.registerBeforeRender(function domeAlphaInterpolation() {
          if (domeMat.alpha > 0) {
            domeMat.alpha = Scalar.MoveTowards(domeMat.alpha, 0, 0.1);
          } else {
            scene.unregisterBeforeRender(domeAlphaInterpolation);
          }
        });
        let waitfadeOutHotSpot = setTimeout(() => {
          scene.getMeshByName(button.innerHTML + "_mesh").parent.dispose(false);
        }, 100);
      } else {
        //criar nodes e UI flutuante

        const dome = new PhotoDome(
          this.innerHTML,
          imgArray[i],
          {
            resolution: 64,
            size: 1000,
          },
          scene
        );

        dome.mesh.alphaIndex = i; //define ordem de renderizacao
        Tags.AddTagsTo(dome, "dome");
        let domeMat = scene.getMaterialByID(this.innerHTML + "_material");
        domeMat.diffuseTexture.hasAlpha = true;
        domeMat.alpha = 0;
        //fade in do domo criado

        scene.registerBeforeRender(function domeAlphaIn() {
          if (domeMat.alpha < 1) {
            domeMat.alpha = Scalar.Lerp(domeMat.alpha, 1, 0.05);
          } else {
            scene.unregisterBeforeRender(domeAlphaIn);
          }
        });
        let waitCreateHotSpot = setTimeout(() => {
          createHotSpot(this.innerHTML);
        }, 100);
        furniture.forEach(function f(element) {
          if (element.name == button.innerHTML) {
            let finalPos = new Vector3(
              element.position.x,
              element.position.y,
              element.position.z * -1
            );
            lookAt(finalPos);
          }
        });
      }

      scene.getTransformNodesByTags("dome", function (m) {
        m.rotation = new Vector3(0, 0, 0);
        m.position = new Vector3(0, 0, 0);
      });
    };
  }
}
function fadeOutHotSpot(ctrlName) {
  advancedTexture.rootContainer.children.forEach(function (ctrl) {
    if (ctrl.name === ctrlName) {
      scene.registerBeforeRender(function removingCtrls() {
        if (ctrl.alpha > 0) {
          ctrl.alpha = Scalar.MoveTowards(ctrl.alpha, 0, 0.1);
          //console.log(ctrl.alpha);
        } else {
          advancedTexture.removeControl(ctrl);
          scene.unregisterBeforeRender(removingCtrls);
        }
      });
    }
  });
}
export function createHotSpot(meshToFind) {
  scene.meshes.forEach(function (m) {
    let alpha = 0;
    if (m.name == meshToFind) {
      let rect1 = new Rectangle(m.name);
      rect1.width = 0.2;
      rect1.height = "40px";
      rect1.cornerRadius = 20;
      rect1.color = "white";
      rect1.thickness = 4;
      rect1.background = "transparent";
      advancedTexture.addControl(rect1);
      rect1.linkWithMesh(m);
      rect1.linkOffsetY = -150;

      let label = new TextBlock(m.name);
      label.text = m.name;
      rect1.addControl(label);

      let target = new Ellipse(m.name);
      target.width = "40px";
      target.height = "40px";
      target.color = "white";
      target.thickness = 4;
      target.background = "transparent";
      advancedTexture.addControl(target);
      target.linkWithMesh(m);

      let line = new Line(m.name);
      line.lineWidth = 4;
      line.color = "white";
      line.y2 = 20;
      line.linkOffsetY = -20;
      advancedTexture.addControl(line);
      line.linkWithMesh(m);
      line.connectedControl = rect1;

      scene.registerBeforeRender(function alphaInterpolation() {
        if (alpha < 1) {
          alpha = Scalar.MoveTowards(alpha, 1, 0.03);
          rect1.alpha = alpha;
          label.alpha = alpha;
          target.alpha = alpha;
          line.alpha = alpha;
        } else {
          scene.unregisterBeforeRender(alphaInterpolation);
        }
      });
    }
  });
}

export function createVideo(videoTextureArray, mesh) {
  videoTextureArray.forEach((element) => {
    mesh.material.diffuseTexture = new VideoTexture(element, element);
    //console.log(element);
  });
}
