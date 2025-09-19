import { ansi } from '../src/colorConsole';

describe('ansi helpers', () => {
    it('exposes core escape codes', () => {
        expect(ansi.reset).toBe('\u001b[0m');
        expect(ansi.bold).toBe('\u001b[1m');
        expect(ansi.foreground.red).toBe(31);
        expect(ansi.background.blue).toBe(44);
    });
});
