"use strict";
import { canvas, scene, rootStand, assetsPath, engine } from "./main.js";
import { camera, moveCameraTo } from "./camera";
//import { Button, DisplayGrid, Grid,  } from "@babylonjs/gui/2D";


import { Tags } from "@babylonjs/core/Misc/tags";
import { AdvancedTexture } from "@babylonjs/gui/2D";
import { Scalar } from "@babylonjs/core/Maths/math.scalar";
import { Helpers, PhotoDome } from "@babylonjs/core/Helpers";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Animations, CubicEase } from "@babylonjs/core/Animations";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { BackgroundMaterial } from "@babylonjs/core/Materials/Background/backgroundMaterial";
import { advancedTexture } from "./main.js";
import {Button,  Control,  Rectangle, TextBlock, Ellipse, Line } from "@babylonjs/gui/2D";
//, Control, TextBlock, Container, MultiLine, Slider
//import { Layer } from "@babylonjs/core/Layers";

export let xAddPos = 0;
export let yAddPos = 0;
export let xAddRot = 0;
export let yAddRot = 0;
export let sideJoystickOffset = 150;
export let bottomJoystickOffset = -50;
//let advancedTexture = new AdvancedDynamicTexture.CreateFullscreenUI("UI");

  

export function createSceneBtns(imgArray) {
  for (let i = 0; i < imgArray.length; i++) {
    let button = document.createElement("button");
    button.type = "button";
    button.style.fontSize = "32px";
    button.innerHTML = imgArray[i];
    document.getElementById("controlsDiv").appendChild(button);

    button.onclick = function () {
      if (scene.getMeshByName(imgArray[i] + "_mesh")) {
        scene.getMeshByName(imgArray[i] + "_mesh").parent.dispose(false);
      } else {
        const dome = new PhotoDome(
          imgArray[i],
          imgArray[i],
          {
            resolution: 64,
            size: 1000,
            //useDirectMapping:false,
          },
          scene
        );
        Tags.AddTagsTo(dome, "dome");
        scene.getMaterialByID(
          imgArray[i] + "_material"
        ).diffuseTexture.hasAlpha = true;
      }
      scene.getTransformNodesByTags("dome", function (m) {
        m.rotation = new Vector3(0, 0, 0);
        m.position = new Vector3(0, 0, 0);
      });
    };
  }
}

export function createHotSpot(mesh) {
  
  let rect1 = new  Rectangle();
  rect1.width = 0.2;
  rect1.height = "40px";
  rect1.cornerRadius = 20;
  rect1.color = "Orange";
  rect1.thickness = 4;
  rect1.background = "green";
  advancedTexture.addControl(rect1);
  rect1.linkWithMesh(mesh);   
  rect1.linkOffsetY = -150;

  let label = new  TextBlock();
  label.text = "Sphere";
  rect1.addControl(label);

  let target = new Ellipse();
  target.width = "40px";
  target.height = "40px";
  target.color = "Orange";
  target.thickness = 4;
  target.background = "green";
  advancedTexture.addControl(target);
  target.linkWithMesh(mesh);   

  let line = new Line();
  line.lineWidth = 4;
  line.color = "Orange";
  line.y2 = 20;
  line.linkOffsetY = -20;
  advancedTexture.addControl(line);
  line.linkWithMesh(mesh); 
  line.connectedControl = rect1;  

}
