'use strict';

import utils from '../utils';

var EventEmitter = require('events').EventEmitter;

export var BaseControlEvent = {
    VALUE_CHANGE: 'control:value_change',
    DESTROY: 'control:destroy'
};

export class BaseControl extends EventEmitter {

    // Constructor init code
    constructor (options={}) {
        this.__lastValueInput   = null;
        this.__lastPercentInput = null;

        this.transforms  = options.transforms || [];
        this.propertyName = options.propertyName || '';
        this.controlName = options.controlName || 'BaseControl';

        // Set default model values.
        this.model = {};
        this.min = options.min || 0;
        this.max = (options.max != null) ? options.max : 1;
        this.value = (options.value != null) ? options.value : this.min;
        this.useTransforms = (options.useTransforms != null) ? options.useTransforms : true;
    }

    // Public methods
    setRange (min, max) {
        this.max = max;
        this.min = min;
    }

    addTransform (transform) {
        if (typeof transform === 'function') {
            this.transforms.push(transform);
        } else {
            this.__handleError('addTransform argument must be a function');
        }
    }

    removeTransform (transform) {
        if (typeof transform === 'function') {
            this.transforms = this.transforms.filter((element, index)=> {
                return element !== transform;
            });
        } else {
            this.__handleError('removeTransform argument must be a function');
        }
    }

    destroy () {
        this.emit(BaseControlEvent.DESTROY);
    }

    emitChangeEvent() {
        this.emit(BaseControlEvent.VALUE_CHANGE, {
            value: this.value,
            percent: this.percent,
            min:this.min,
            max:this.max
        });
    }

    // Getters and Setters
    get useTransforms () {
        return this.model.useTransforms;
    }

    set useTransforms (state) {
        this.model.useTransforms = state;
    }

    get min () {
        return this.model.min;
    }

    set min (min) {
        if(min < this.max || this.max == null) {
            this.model.min = min;
        } else {
            this.__handleError(`cannot set min property (${min}) higher than max property (${this.max})`);
        }
    }

    get max () {
        return this.model.max;
    }

    set max (max) {
        if(max > this.min || this.min == null) {
            this.model.max = max;
        } else {
            this.__handleError(`cannot set max property (${max}) lower than min property (${this.min})`);
        }
    }

    get percent () {
        var percent = this.__calculatePercentFromValue(this.value);
        //var transformed = this.__applyTransforms(percent);
        return utils.clamp((percent.toFixed(8)/1), 0, 1);
    }

    set percent (percent) {
        if (typeof percent === 'number') {
            if (percent !== this.__lastPercentInput) {
                if (percent >= 0 && percent <= 1) {
                    this.__lastPercentInput = percent;
                    // recalculate the value property based on the updated percent
                    this.value = this.__calculateValueFromPercent(percent);
                } else {
                    this.__handleError(`percent property (${percent}) must be a value with in range 0...1`);
                }
            }
        } else {
            this.__handleError('percent must be of type number');
        }
    }

    get value () {
        var transformInput = this.model.value - this.min;
        var transformed = this.__applyTransforms(transformInput) + this.min;
        return utils.clamp((transformed.toFixed(8)/1), this.min, this.max);
    }

    set value (value) {
        if (typeof value === 'number') {
            if(value !== this.__lastValueInput) {
                if (value >= this.min || this.min == null) {
                    if(value <= this.max || this.max == null) {
                        this.model.value = value;
                        this.__lastValueInput = value;
                        this.emitChangeEvent();
                    } else {
                        this.__handleError(`cannot set value property (${value}) higher than max property (${this.max})`);
                    }
                } else {
                    this.__handleError(`cannot set value property (${value}) lower than min property (${this.min})`);
                }
            }
        } else {
            this.__handleError('value must be of type number');
        }
    }


    /*************************************
      *      Internal Methods
    **************************************/

    __calculateValueFromPercent (percent) {
        var diff = this.max - this.min;
        return (percent * diff) + this.min;
    }

    __calculatePercentFromValue (value) {
        var diff = this.max - this.min;
        return ((1000 / diff) * (value - this.min)) / 1000;
    }

    __applyTransforms(input) {
        if(this.useTransforms) {
            this.transforms.forEach((transform) => {
                input = transform(input);
            });
        }
        return input;
    }

    __handleError (errorMessage) {
        throw new Error(this.controlName + ': ' + errorMessage);
    }

}

export default BaseControl;
