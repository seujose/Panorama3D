'use strict'
import { defaultPBRMetallicRoughnessMaterial, assetsPath, scene, rootStand, videoURLs, audioURLS } from './main.js'
import { refreshUI } from './ui'
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import { LoadingScreen } from "@babylonjs/core/Loading/loadingScreen";
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { VideoTexture } from '@babylonjs/core/Materials/Textures/videoTexture';
import "@babylonjs/core/Meshes/meshBuilder";
import "@babylonjs/loaders/glTF/2.0/glTFLoader";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_draco_mesh_compression"

import { Axis, Color3, Color4, Space, Vector3 } from '@babylonjs/core/Maths/math';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Sound } from '@babylonjs/core/Audio/sound';
import { ExponentialEase } from '@babylonjs/core/Animations/easing';
import { defineAsVideoWall, defineAsProduct } from './behaviors.js';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';



export function importScene() {
    SceneLoader.ImportMesh("", "/assets/", "cena12.gltf", scene, function (meshes) {
        meshes.forEach((mesh) => {
            mesh.checkCollisions = true;
            refreshUI(rootStand);
            try {
                //limpa os metadados do mesh
                mesh.metadata = {};
                if (mesh.material.name === '__GLTFLoader._default') {
                    // mesh.material = defaultPBRMetallicRoughnessMaterial;
                };
                if (mesh.name.includes('isProduct')) {
                    defineAsProduct(mesh);
                };
                if (mesh.name.includes('isVideoWall')) {
                    defineAsVideoWall(mesh, videoURLs[0]);
                };
            } catch (msg) {
                console.log('%cerro na importacao ' + msg + ' no mesh ' + mesh.name, 'color:yellow');
            };
        });
    });
};

export function importCharacters() {
    SceneLoader.ImportMesh("", "/assets/", "char_a.glb", scene, function (meshes, skeletons, animGroups) {
        playCharAnim('idle');
    });
};
export function playCharAnim(animName) {
    scene.getAnimationGroupByName(animName).start(false);
};
/* function debugMesh(mesh) {
    let sphere = MeshBuilder.CreateSphere("sphere", 1, 1, scene);
    sphere.material = new StandardMaterial('redMaterial', scene);
    sphere.material.diffuseColor = new Color3(1, 0, 0);
    sphere.setAbsolutePosition(mesh.getAbsolutePosition());
}; */
export function createVideoMaterial(videoURL) {
    let videoMaterial = new StandardMaterial('videoMaterial', scene);
    let videoTexture = new VideoTexture(videoURL, assetsPath + videoURL, scene, false, true, { autoplay: false, muted: true, poster: assetsPath + 'videoPoster_1.webp' });
    videoTexture.video.autoplay = false;
    videoMaterial.diffuseTexture = videoTexture;
    //videoTexture.video.setAttribute('crossorigin', 'anonymous');
    videoMaterial.roughness = 1;
    videoMaterial.emissiveColor = new Color3.White();
    return videoMaterial;
}

export function createSpatial3DSound(audioURL, absolutePosition) {
    let spatialSound = new Sound(audioURL, audioURL, scene, null, {
        loop: false,
        autoplay: false,
        spatialSound: true,
        //distanceModel:'inverse',
        maxDistance: 30
    });
    spatialSound.setPosition(absolutePosition);
    return spatialSound;
};
/**
 * 
 * @param {string} name 
 * @param {Color3} Color3 
 * @return material criado
 */
function createMaterial(name, Color3) {
    let material = new StandardMaterial(name, scene);
    material.diffuseColor = Color3;
    return material;
};

/**
 * cria mesh poligonal usando uma das seguintes strings:
 ** disc, box, 
 ** no caso de disco, rotaciona 90 graus para que a parte superior aponte para Z
 * @param {string} meshType classe do mesh
 * @returns o mesh criado
 */
export function createMesh(meshType) {
    // console.log('criando meshe ' + meshType);
    let mesh = null;
    switch (meshType) {
        case 'disc':
            mesh = MeshBuilder.CreateDisc('meshDisc', {}, scene);
            mesh.addRotation(1.5708, 0, 0);
            mesh.isPickable = false;
            mesh.material = createMaterial('discMat', new Color3(1, 0, 0));
            break;
        case 'box':
            mesh = MeshBuilder.CreateBox('meshBox', {}, scene);
            break;
    }
    return mesh;
};


