'use strict';

import { BaseControl, BaseControlEvent } from './BaseControl';

export var RangeControlEvent = Object.assign({}, BaseControlEvent);

export class RangeControl extends BaseControl {

    // Constructor init code
    constructor (options={}) {
        super(options);
        this.controlName = options.controlName || 'Range Control';
    }
}

export default RangeControl;
