import * as PropertyControls from '../../lib/index';

describe('Exporting the library', function() {
    describe('RangeControl', function() {
        it('should export the RangeControl class', function() {
            expect(PropertyControls.RangeControl).toBeDefined();
        });
    });

    describe('FollowControl', function() {
        it('should export the FollowControl class', function() {
            expect(PropertyControls.FollowControl).toBeDefined();
        });
    });

    describe('GraphControl', function() {
        it('should export the GraphControl class', function() {
            expect(PropertyControls.GraphControl).toBeDefined();
        });
    });

    describe('OmniControl', function() {
        it('should export the OmniControl class', function() {
            expect(PropertyControls.OmniControl).toBeDefined();
        });
    });

});
