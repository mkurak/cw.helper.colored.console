import { detectColorSupport } from '../src/colorConsole';

describe('detectColorSupport', () => {
    const originalEnv = process.env;
    const originalStdoutDescriptor = Object.getOwnPropertyDescriptor(process, 'stdout');

    beforeEach(() => {
        process.env = { ...originalEnv };
        Object.defineProperty(process, 'stdout', {
            configurable: true,
            enumerable: true,
            get: () => ({ isTTY: true }) as unknown as NodeJS.WriteStream
        });
    });

    afterAll(() => {
        process.env = originalEnv;
        if (originalStdoutDescriptor) {
            Object.defineProperty(process, 'stdout', originalStdoutDescriptor);
        }
    });

    it('returns false when NO_COLOR is set', () => {
        process.env.NO_COLOR = '1';
        expect(detectColorSupport()).toBe(false);
    });

    it('returns true when FORCE_COLOR is set', () => {
        delete process.env.NO_COLOR;
        process.env.FORCE_COLOR = '1';
        expect(detectColorSupport()).toBe(true);
    });

    it('falls back to TTY detection', () => {
        delete process.env.NO_COLOR;
        delete process.env.FORCE_COLOR;
        Object.defineProperty(process, 'stdout', {
            configurable: true,
            enumerable: true,
            get: () => ({ isTTY: false }) as unknown as NodeJS.WriteStream
        });
        expect(detectColorSupport()).toBe(false);
    });
});
