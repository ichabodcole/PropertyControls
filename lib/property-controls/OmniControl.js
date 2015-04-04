import utils from '../services/utils';

import { ControlTypes } from './constants';
import { BaseControl, BaseControlEvent} from './BaseControl';
import RangeControl from './RangeControl';
import FollowControl from './FollowControl';
import GraphControl from './GraphControl';

var omniControlDefaults = {
        propertyName: null,
        controlType:  ControlTypes.RANGE_CONTROL,
        max: null,
        min: null,
        rangeValue: 0,
        value: 0,
        graph: []
    };

// Event name constants
export var OmniControlEvent = Object.assign({
    CONTROL_TYPE_CHANGE: 'control_type_change'
}, BaseControlEvent);

export class OmniControl extends BaseControl {
    // "Private" methods
    __isValidControlType (controlType) {
        if(this.controlTypes.indexOf(controlType) === -1) {
            return false;
        }
        return true;
    }

    __onControlValueChange(e) {
        this.value = e.value;
    }

    __setControlProperty(controlRef, propertyName, value) {
        this.__controls[controlRef][propertyName] = value;
    }

    __setControlsProperty(propertyName, value) {
        for (var controlRef in this.__controls) {
            this.__setControlProperty(controlRef, propertyName, value);
        }
    }

    // Constructor Init Code
    constructor (options={}) {
        this.controlTypes = [
            ControlTypes.RANGE_CONTROL,
            ControlTypes.FOLLOW_CONTROL,
            ControlTypes.GRAPH_CONTROL
        ];

        this.__control = null;
        // Setup the controls container obj
        this.__controls = {};
        this.__controls[ControlTypes.RANGE_CONTROL]  = options.rangeControl   || new RangeControl(options);
        this.__controls[ControlTypes.FOLLOW_CONTROL] = options.followControl || new FollowControl(options);
        this.__controls[ControlTypes.GRAPH_CONTROL]  = options.graphControl  || new GraphControl(options);

        this.__controlListener = this.__onControlValueChange.bind(this);
        super(options);

        this.controlName = options.controlName || 'GraphControl';
        // Default to a range control if no control is specified in the model object
        this.controlType = options.controlType || ControlTypes.RANGE_CONTROL;
    }

    get rangeControl() {
        return this.__controls[ControlTypes.RANGE_CONTROL];
    }

    get followControl() {
        return this.__controls[ControlTypes.FOLLOW_CONTROL];
    }

    get graphControl() {
        return this.__controls[ControlTypes.GRAPH_CONTROL];
    }

    // Setters and Getters
    set min (min) {
        super.min = min;
        this.__setControlsProperty('min', min);
    }

    get min () {
        return super.min;
    }

    set max (max) {
        super.max = max;
        this.__setControlsProperty('max', max);
    }

    get max () {
        return super.max;
    }

    get control() {
        return this.__control;
    }

    set controlType (controlType) {
        if(this.__isValidControlType(controlType)) {
            if (this.controlType !== controlType) {
                // Stop listening to the previous control instance
                if(this.__control != null) {
                    this.__control.removeListener(OmniControlEvent.VALUE_CHANGE, this.__controlListener);
                }

                this.model.controlType = controlType;
                this.emit(OmniControlEvent.CONTROL_TYPE_CHANGE, { controlType: controlType });
                this.__control = this.__controls[controlType];
                this.__control.on(OmniControlEvent.VALUE_CHANGE, this.__controlListener);
            }
        } else {
            throw new Error(`OmniControl: controlType (${controlType}), is not a valid controlType`);
        }
    }

    get controlType() {
        return this.model.controlType;
    }
}

export default OmniControl;
