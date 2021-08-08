'use strict'
import { HemiLight, HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math';
import { scene } from './main.js';
export function createLight(lightClass) {
    switch (lightClass) {
        case 'hemi':
            let hemiLight = new HemisphericLight('hemiLight', new Vector3(0, 1, 0), scene);
            break;
        case 'spot':
            break;
    }
}