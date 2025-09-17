import { applyStyle, colorize } from '../src/colorConsole';

const RESET = '\u001b[0m';

describe('applyStyle', () => {
    it('applies ANSI styling when enabled', () => {
        const styled = applyStyle('hello', { color: 'red', bold: true }, { enabled: true });
        expect(styled).toBe(`\u001b[1m\u001b[31mhello${RESET}`);
    });
    it('supports background and underline', () => {
        const styled = applyStyle(
            'hi',
            { background: 'blue', underline: true, italic: true },
            { enabled: true }
        );
        expect(styled).toBe(`\u001b[3m\u001b[4m\u001b[44mhi${RESET}`);
    });

    it('returns plain text when disabled', () => {
        const styled = applyStyle('hello', { color: 'blue' }, { enabled: false });
        expect(styled).toBe('hello');
    });

    it('returns original text when style is undefined', () => {
        const styled = applyStyle('plain', undefined, { enabled: true });
        expect(styled).toBe('plain');
    });

    it('returns original text when no style flags provided', () => {
        const styled = applyStyle('plain', {}, { enabled: true });
        expect(styled).toBe('plain');
    });

    it('detects color support when options omitted', () => {
        const prev = process.env.FORCE_COLOR;
        process.env.FORCE_COLOR = '1';
        const styled = applyStyle('auto', { color: 'cyan' });
        expect(styled).toBe(`\u001b[36mauto${RESET}`);
        if (prev === undefined) {
            delete process.env.FORCE_COLOR;
        } else {
            process.env.FORCE_COLOR = prev;
        }
    });
});

describe('colorize alias', () => {
    it('delegates to applyStyle', () => {
        const styled = colorize('world', { color: 'green' }, { enabled: true });
        expect(styled).toBe(`\u001b[32mworld${RESET}`);
    });
});
