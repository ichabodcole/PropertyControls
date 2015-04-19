'use strict';

// Control name constants
var ControlTypes = {
    RANGE_CONTROL  : 'range_control',
    FOLLOW_CONTROL : 'follow_control',
    GRAPH_CONTROL  : 'graph_control'
};

// Control name constants
var ControlEvents = {
    VALUE_CHANGE: 'value_change',
    DESTROY: 'destroy',
    START: 'start',
    STOP: 'stop',
    ADD_POINTS: 'add_points',
    REMOVE_POINT: 'remove_point',
    CONTROL_TYPE_CHANGE: 'control_type_change'
};

export {
    ControlTypes,
    ControlEvents
};
