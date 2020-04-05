import * as constants from '../constants';
import { ComponentOptions } from './componentOptions';


describe('pf-global-options', () => {

    let options = new ComponentOptions();

    it('uses value in constructor', () => {
        let options = new ComponentOptions(true);
        expect(options.dragable).toBe(true);
        options = new ComponentOptions(false);
        expect(options.dragable).toBe(false);
    });

    it('can parse options', () => {
        var dummyDiv = document.createElement('div');
        dummyDiv.getAttribute = jasmine.createSpy('HTML Element').and.returnValue('true');        
        options.parse(dummyDiv);
        expect(options.dragable).toBe(true);
    });

    it('can handle bad input', () => {
        var dummyDiv = document.createElement('div');
        dummyDiv.getAttribute = jasmine.createSpy('HTML Element').and.returnValue('123');
        options.parse(dummyDiv);
        expect(options.dragable).toBe(true);
    });

    it('can handle undefined input', () => {
        var dummyDiv = document.createElement('div');
        dummyDiv.getAttribute = jasmine.createSpy('HTML Element').and.returnValue(undefined);
        options.parse(dummyDiv);
        expect(options.dragable).toBe(true);
    });

    it('can handle null input', () => {
        var dummyDiv = document.createElement('div');
        dummyDiv.getAttribute = jasmine.createSpy('HTML Element').and.returnValue(null);
        options.parse(dummyDiv);
        expect(options.dragable).toBe(true);
    });

});
