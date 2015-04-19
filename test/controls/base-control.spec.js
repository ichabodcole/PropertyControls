import { ControlEvents } from '../../lib/constants';
import BaseControl from '../../lib/controls/BaseControl';

describe ('BaseControl', function () {
    var bc, options, listener, model, myTransform;

    beforeEach(function () {
        options = {
            propertyName: 'baseProperty',
            value: 0.5
        };
        listener  = {
            update: function () {
                return true;
            }
        };

        myTransform = jasmine.createSpy('myTransform');

        bc = new BaseControl(options);
    });

    describe ('constructor', function () {

        it ('should not throw and error', function () {
            expect(function () {
                new BaseControl();
            }).not.toThrow();
        });

        it ('should not throw when default values are provided', function () {
            expect(function () {
                new BaseControl({ min:100, max: 1000 });
            }).not.toThrow();
        });
    });

    describe ('properties', function () {
        describe ('min', function() {
            describe('as a setter', function() {
                it ('should set the models min value', function() {
                    bc.max = 200;
                    bc.min = 100;
                    expect(bc.model.min).toBe(100);
                });

                it ('should not accept values higher than the max value', function() {
                    expect(function() {
                        bc.max = 50;
                        bc.min = 100;
                    }).toThrow(new Error('BaseControl: cannot set min property (100) higher than max property (50)'));
                });
            });

            describe ('as a getter', function() {
                it ('should get the models min value', function() {
                    bc.model.min = 10;
                    expect(bc.min).toBe(10);
                });
            });
        });

        describe ('max', function() {
            describe ('as a setter', function() {
                it ('should set the models max value', function() {
                    bc.max = 100;
                    expect(bc.model.max).toBe(100);
                });

                it ('should not accept values lower than the min value', function() {
                    expect(function() {
                        bc.min = 0;
                        bc.max = -5;
                    }).toThrow(new Error('BaseControl: cannot set max property (-5) lower than min property (0)'));
                });
            });

            describe ('as a getter', function() {
                it ('should get the models max value', function() {
                    bc.model.max = 50;
                    expect(bc.max).toBe(50);
                });
            });
        });

        describe ('percent', function() {
            describe ('as a setter', function() {
                it ('should only accept a value between 0 and 1', function() {
                    expect(function() {
                        bc.percent = 50;
                    }).toThrow(new Error('BaseControl: percent property (50) must be a value with in range 0...1'));
                });

                it ('should calculate a new value based on the percent', function() {
                    bc.setRange(0, 100);
                    bc.percent = 0.65;
                    expect(bc.value).toEqual(65);
                });

                it ('should emit a VALUE_CHANGE event', function() {
                    spyOn(bc, 'emit');
                    bc.percent = 0.65;
                    expect(bc.emit).toHaveBeenCalledWith(ControlEvents.VALUE_CHANGE, jasmine.any(Object));
                });

                it ('should not emit a VALUE_CHANGE event if percent has not changed', function() {
                    spyOn(bc, 'emit');
                    bc.percent = 0.65;
                    bc.percent = 0.65;
                    bc.percent = 0.65;
                    expect(bc.emit.calls.count()).toEqual(1);
                });

                it('should fix the returned value to a maximum of 8 decimals', function() {
                    bc.percent = 0.123456789;
                    var decimalLength = bc.percent.toString().split('.')[1].length;
                    expect(decimalLength).toEqual(8);
                });

                it ('should only set the model percent if the passed percent is a number', function () {
                    expect(function() {
                        bc.percent = "A String";
                    }).toThrow(new Error('BaseControl: percent must be of type number'));
                });

                it('should update the value property', function() {
                    bc.setRange(0, 100);
                    bc.percent = 0.5;
                    expect(bc.value).toEqual(50);
                });
            });

            describe ('as a getter', function() {
                it ('should return the models percent property value', function() {
                    bc.model.percent = 0.5;
                    expect(bc.percent).toBe(0.5);
                });

                it ('should apply any transforms to the returned value', function() {
                    var myScaleTransform = function(input) {
                        return input * 0.5;
                    };

                    bc.percent = 1;
                    bc.addTransform(myScaleTransform);
                    bc.addTransform(myScaleTransform);

                    expect(bc.percent).toBe(0.25);
                });

                it ('should not return values less than the 0', function() {
                    var myLowerTransform = function(input) {
                        return input - 100;
                    };

                    bc.setRange(100, 200);

                    bc.value = 150;
                    bc.addTransform(myLowerTransform);

                    expect(bc.percent).toBe(0);
                });

                it ('should not return values greater than the 1', function() {
                    var myUpperTransform = function(input) {
                        return input + 100;
                    };

                    bc.setRange(100, 200);
                    bc.value = 150;
                    bc.addTransform(myUpperTransform);

                    expect(bc.percent).toBe(1);
                });
            });
        });

        describe ('value', function () {
            describe ('as a setter', function() {
                it ('should set the model value', function () {
                    bc.value = 0.75;
                    expect(bc.value).toBe(0.75);
                });

                it ('should not accept values lower than the min value', function() {
                    bc.min = 0;
                    expect(function() {
                        bc.value = -5;
                    }).toThrow(new Error('BaseControl: cannot set value property (-5) lower than min property (0)'));
                });

                it ('should not accept values higher than the max value', function() {
                    bc.max = 100;
                    expect(function() {
                        bc.value = 150;
                    }).toThrow(new Error('BaseControl: cannot set value property (150) higher than max property (100)'));
                });

                it ('should emit a VALUE_CHANGE event', function() {
                    spyOn(bc, 'emit');
                    bc.value = 0.65;
                    expect(bc.emit).toHaveBeenCalledWith(ControlEvents.VALUE_CHANGE, jasmine.any(Object));
                });

                it ('should not emit a VALUE_CHANGE event if value has not changed', function() {
                    spyOn(bc, 'emit');
                    bc.value = 0.65;
                    bc.value = 0.65;
                    bc.value = 0.65;
                    expect(bc.emit.calls.count()).toEqual(1);
                });

                it('should fix the returned value to a maximum of 8 decimals', function() {
                    bc.value = 0.123456789;
                    var decimalLength = bc.value.toString().split('.')[1].length;
                    expect(decimalLength).toEqual(8);
                });

                it ('should only set the model value if the passed value is a number', function () {
                    expect(function() {
                        bc.value = "A String";
                    }).toThrow(new Error('BaseControl: value must be of type number'));
                });

                it('should upate the percent property', function() {
                    bc.setRange(0, 200);
                    bc.value = 100;
                    expect(bc.percent).toEqual(0.5);
                });
            });

            describe('as as getter', function() {
                it ('should get the model value', function () {
                    expect(bc.value).toBe(0.5);
                });

                it ('should apply any transforms to the retured value', function() {
                    var myScaleTransform = function(input) {
                        return input * 0.5;
                    };

                    bc.setRange(100, 200);

                    bc.value = 160;
                    bc.addTransform(myScaleTransform);
                    bc.addTransform(myScaleTransform);

                    expect(bc.value).toBe(115);
                });

                it ('should not apply any transforms to the models value property', function() {
                    var myScaleTransform = function(input) {
                        return input * 0.5;
                    };

                    bc.setRange(100, 200);

                    bc.value = 160;
                    bc.addTransform(myScaleTransform);
                    bc.addTransform(myScaleTransform);

                    expect(bc.model.value).toBe(160);
                });

                it ('should not return values less than the min property value', function() {
                    var myLowerTransform = function(input) {
                        return input - 100;
                    };

                    bc.setRange(100, 200);
                    bc.value = 150;
                    bc.addTransform(myLowerTransform);

                    expect(bc.value).toBe(100);
                });

                it ('should not return values greater than the max property value', function() {
                    var myUpperTransform = function(input) {
                        return input + 100;
                    };

                    bc.setRange(100, 200);
                    bc.value = 150;
                    bc.addTransform(myUpperTransform);

                    expect(bc.value).toBe(200);
                });
            });
        });

        describe ('useTransforms', function() {
            it ('should default to true', function() {
                expect(bc.useTransforms).toBe(true);
            });

            it ('should apply transforms to returned property values if set to false', function() {
                var myScaleTransform = function(input) {
                    return input * 0.5;
                };
                bc.setRange(0, 100);
                bc.value = 100;

                bc.addTransform(myScaleTransform);

                bc.useTransforms = true;
                expect(bc.value).toBe(50);
                expect(bc.percent).toBe(0.5);
            });

            it ('should not apply transforms to returned property values if set to false', function() {
                var myScaleTransform = function(input) {
                    return input * 0.5;
                };
                bc.setRange(0, 100);
                bc.value = 100;

                bc.addTransform(myScaleTransform);

                bc.useTransforms = false;
                expect(bc.value).toBe(100);
                expect(bc.percent).toBe(1);
            });
        });

        describe ('transforms', function () {
            it ('should contain a list of any added transforms', function() {
                bc.addTransform(myTransform);
                expect(bc.transforms.indexOf(myTransform)).toBe(0);
            });
        });
    });

    describe ('methods', function () {
        describe('public methods', function() {
            describe ('on', function () {
                it('should be defined', function() {
                    expect(bc.on).toBeDefined();
                });
            });

            describe ('removeListener', function () {
                it('should be defined', function() {
                    expect(bc.removeListener).toBeDefined();
                });
            });

            describe ('setRange', function() {
                it ('should be defined', function() {
                    expect(bc.setRange).toBeDefined();
                });

                it ('should set the min and max properties', function() {
                    bc.setRange(100, 200);
                    expect(bc.min).toBe(100);
                    expect(bc.max).toBe(200);
                });

                it ('should throw an error if invalid arguments are supplied', function() {
                    expect(function() {
                        bc.setRange(100, 0);
                    }).toThrow();
                })
            });

            describe ('addTransform', function() {
                it ('should be defined', function() {
                    expect(bc.addTransform).toBeDefined();
                });

                it ('should add the transform to the transforms array', function() {
                    bc.addTransform(myTransform);
                    expect(bc.transforms.length).toBe(1);
                });

                it ('should throw an error if the transform argument is not a function', function() {
                    var myTransform = 0;
                    expect(function() {
                        bc.addTransform(myTransform);
                    }).toThrow(new Error('BaseControl: addTransform argument must be a function'));
                });
            });

            describe ('removeTransform', function() {
                it ('should be defined', function() {
                    expect(bc.removeTransform).toBeDefined();
                });

                it ('should remove all occurences of the transform from the transforms array', function() {
                    var myTransformTwo = jasmine.createSpy('myTransform');

                    bc.addTransform(myTransform);
                    bc.addTransform(myTransform);
                    bc.addTransform(myTransformTwo);

                    expect(bc.transforms.length).toBe(3);

                    bc.removeTransform(myTransform);
                    expect(bc.transforms.length).toBe(1);
                });

                it ('should throw an error if the transform argument is not a function', function() {
                    var myTransform = 0;
                    expect(function() {
                        bc.removeTransform(myTransform);
                    }).toThrow(new Error('BaseControl: removeTransform argument must be a function'));
                });
            });

            describe('emitChangeEvent', function() {
                it ('should emit and VALUE_CHANGE event', function() {
                    spyOn(bc, 'emit');

                    var returnObj = {
                        value: bc.value,
                        percent: bc.percent,
                        min: bc.min,
                        max: bc.max
                    };

                    bc.emitChangeEvent();
                    expect(bc.emit).toHaveBeenCalledWith(ControlEvents.VALUE_CHANGE, returnObj);
                });
            });

            describe ('destroy', function() {
                it('should be defined', function() {
                    expect(bc.destroy).toBeDefined();
                });

                it('should emit an DESTROY event', function() {
                    spyOn(bc, 'emit');
                    bc.destroy();
                    expect(bc.emit).toHaveBeenCalledWith(ControlEvents.DESTROY);
                });
            });
        });

        describe('private methods', function() {
            describe('__calculateValueFromPercent', function() {
                it('should be defined', function() {
                    expect(bc.__calculatePercentFromValue).toBeDefined();
                });

                it('should return a value between the min an max properties based on the percent argument', function() {
                    bc.setRange(0, 200);
                    var returned = bc.__calculateValueFromPercent(0.5);
                    expect(returned).toEqual(100);
                });
            });

            describe('__calculatePercentFromValue', function() {
                it('should be defined', function() {
                    expect(bc.__calculatePercentFromValue).toBeDefined();
                });

                it('should return a percent between 0 and 1 based on the value argument', function() {
                    bc.setRange(0, 200);
                    var returned = bc.__calculatePercentFromValue(100);
                    expect(returned).toEqual(0.5);
                });
            });

            describe('__applyTransforms', function() {
                it('should be defined', function() {
                    expect(bc.__applyTransforms).toBeDefined();
                });

                it('should apply all transforms to the input argument', function() {
                    var transform = function (input) {
                        return input * 2;
                    };

                    bc.addTransform(transform);

                    var transformed = bc.__applyTransforms(1);
                    expect(transformed).toEqual(2);
                });

                it('should not apply transforms if useTransforms is false', function() {
                    var transform = function (input) {
                        return input * 2;
                    };

                    bc.useTransforms = false;
                    bc.addTransform(transform);

                    var transformed = bc.__applyTransforms(1);
                    expect(transformed).toEqual(1);
                });
            });
        });
    });
});
