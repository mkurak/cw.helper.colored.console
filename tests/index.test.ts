import * as api from '../src';

describe('package entry point', () => {
    it('exposes factory and helpers', () => {
        expect(typeof api.createColoredConsole).toBe('function');
        expect(typeof api.colorize).toBe('function');
        expect(api.ansi.reset).toBe('\u001b[0m');
    });
});
