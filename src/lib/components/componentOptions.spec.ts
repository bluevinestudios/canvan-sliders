import * as constants from '../constants';
import { ComponentOptions } from './componentOptions';


describe('pf-component-options', () => {

    let options: ComponentOptions = null;
    beforeEach(() => {
        options = new ComponentOptions(true);
    });
    
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
        // We expect a warning from the invalid input.
        console.warn = jasmine.createSpy('Log Warning').and.callThrough();

        options.parse(dummyDiv);

        expect(console.warn).toHaveBeenCalled();        
        expect(options.dragable).toBe(false);
    }); 

    it('can handle undefined input', () => {
        var dummyDiv = document.createElement('div');
        dummyDiv.getAttribute = jasmine.createSpy('HTML Element').and.returnValue(undefined);        
        options.parse(dummyDiv);
        expect(options.dragable).toBe(true);
    }); 

    it('can handle null input', () => {
        let options = new ComponentOptions(true);
        var dummyDiv = document.createElement('div');
        dummyDiv.getAttribute = jasmine.createSpy('HTML Element').and.returnValue(null);
        options.parse(dummyDiv);
        expect(options.dragable).toBe(true);
    }); 

});
