'use strict';

/*
* Applies a transformation on an input value that ranges from 0-1.
*/
export class Transform {
    constructor (config) {
        this.transform = config.tranform;
    }

    apply (input) {
        if(input >= 0 && input <= 1) {
            return this.transform(input);
        } else {
            throw new Error(`Transformation: input (${input}) out of range 0 - 1`);
        }
    }
}

export default Transform;
