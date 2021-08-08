import { ActionManager, ExecuteCodeAction } from "@babylonjs/core/Actions";
import { Axis, Color3, Space, Vector3 } from '@babylonjs/core/Maths/math';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { scene, canvas } from './main';
import { createVideoMaterial } from './mesh';
import { createSpatial3DSound } from './mesh'
import { assetsPath, audioURLS } from './main'
import { GUI3DManager } from "@babylonjs/gui";
import { PointerDragBehavior } from '@babylonjs/core/Behaviors/Meshes/pointerDragBehavior';
import audioSceneComponent from '@babylonjs/core/Audio/audioSceneComponent';
/**
 * atribui comportamento de acompanhamento: target segue o mouse usando 
 * mesh 'floor' como base para deslocamento
 */
export let followMouseBehavior = {
    name: 'followMouseBehavior',
    init: () => {
    },
    attach: (target) => {
        followMouseBehavior.observer = scene.onBeforeRenderObservable.add(() => {
            let pickInfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pickInfo.hit && pickInfo.pickedMesh.name === 'floor') {
                target.setAbsolutePosition(pickInfo.pickedPoint);
            };
        });
    },
    detach: () => {
        scene.onBeforeRenderObservable.remove(followMouseBehavior.observer);
    }
};

/**
 * cria template video wall e registra acao: ao ser clicado, executa video
 * @param {string} videoURL  
 * @param {AbstractMesh} mesh
 */
export function defineAsVideoWall(mesh, videoURL) {
    console.log('%c video wall criado ' + mesh.name, 'color:green');
    mesh.material = createVideoMaterial(videoURL);
    mesh.actionManager = new ActionManager(scene);
    mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, function () {
            try {
                let sound = createSpatial3DSound(assetsPath + audioURLS[0], mesh.getAbsolutePosition());
                if (mesh.material.diffuseTexture.video.paused) {
                    mesh.material.diffuseTexture.video.play();
                    mesh.material.diffuseTexture.video.muted = false;
                    sound.play();
                } else {
                    mesh.material.diffuseTexture.video.pause();
                    sound.pause();
                }
            } catch (error) {
                console.log('%cimpossivel reproduzir video(' + mesh.name +'): '+ error, 'color:red');
            }
        })
    )
};

/**
 * define mesh como um produto adicionando rotacao manual e highlight
 * @param {AbstractMesh} mesh 
 */
export function defineAsProduct(mesh) {
    mesh.metadata.originalRotation = mesh.rotationQuaternion.toEulerAngles();
    createRotateBehavior(mesh);
    // createHighlightAction(mesh);
};
/**
 * cria pointerDragBehavior permitindo rotacionar o mesh ao arrastar o mouse
 * @param {AbstractMesh} mesh 
 * @returns {PointerDragBehavior} behavior
 */
function createRotateBehavior(mesh) {
    console.log('%cmesh ' + mesh.name + ' criado como produto', 'color:green');
    let rotateMeshBehavior = new PointerDragBehavior();
    rotateMeshBehavior.moveAttached = false;
    rotateMeshBehavior.onDragStartObservable.add((ev) => {

    });
    rotateMeshBehavior.onDragObservable.add((ev) => {
        mesh.addRotation(ev.delta.y * -1, ev.delta.x * -1, 0);
    });
    rotateMeshBehavior.onDragEndObservable.add((ev) => {
        mesh.rotation = new Vector3(mesh.metadata.originalRotation.x, mesh.metadata.originalRotation.y, mesh.metadata.originalRotation.z);
        // mesh.rotation = mesh.metadata.originalRotation; // nao funciona, ver explicacao abaixo
        // From version 4.0 onwards, the setting of rotationQuaternion to null is done automatically when and only when rotation is set directly with a vector, for example
        // mesh.rotation = new BABYLON.Vector3(0, 0, 0)
        // Whenever you find rotation errors it is worth setting rotationQuaternion to null before updating rotation.
    });
    mesh.addBehavior(rotateMeshBehavior);
    return rotateMeshBehavior;
};

/**
 * adiciona highlight ao mesh usando 'actions'
 * * realca o mesh no mouseOver
 * @param {AbstractMesh} mesh
 */
/* function createHighlightAction(mesh) {
    mesh.actionManager = new ActionManager(scene);
    mesh.actionManager.registerAction(
        new ExecuteCodeAction(
            ActionManager.OnPointerOverTrigger, function (ev) {
                highlightLayer.addMesh(ev.meshUnderPointer, Color3.Green());
            }
        ));
    mesh.actionManager.registerAction(
        new ExecuteCodeAction(
            ActionManager.OnPointerOutTrigger, (() => {
                highlightLayer.removeAllMeshes();
            })
        ));
    mesh.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickDownTrigger, (ev) => {
    })).then(new ExecuteCodeAction(
        ActionManager.OnPickTrigger, (ev) => {
        }
    ))
}; */
