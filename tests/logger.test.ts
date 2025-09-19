import { jest } from '@jest/globals';
import { createColoredConsole } from '../src/colorConsole';

const ESC = String.fromCharCode(27);
const ANSI_PATTERN = new RegExp(`${ESC}\\[[0-9;]*m`, 'g');
const stripAnsi = (value: string) => value.replace(ANSI_PATTERN, '');

describe('ColoredConsole', () => {
    const makeWriter = () => ({
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn()
    });

    it('writes colored label with name prefix', () => {
        const writer = makeWriter();
        const logger = createColoredConsole({ name: 'api', enabled: true, writer });

        logger.info('Server started', { port: 3000 });

        expect(writer.log).toHaveBeenCalledTimes(1);
        const [label, message, payload] = writer.log.mock.calls[0] as [string, unknown, unknown];
        expect(label).toContain('[api]');
        expect(label).toContain('INFO');
        expect(message).toBe('Server started');
        expect(payload).toEqual({ port: 3000 });
        // Label should include ANSI reset at the end when enabled.
        expect(label.endsWith('\u001b[0m')).toBe(true);
    });

    it('uses plain text label when disabled', () => {
        const writer = makeWriter();
        const logger = createColoredConsole({ enabled: false, writer });

        logger.warn('Disk space low');

        const [label] = writer.warn.mock.calls[0] as [string];
        expect(label.includes('\u001b[')).toBe(false);
        expect(label).toContain('WARN');
    });

    it('allows overriding theme per level', () => {
        const writer = makeWriter();
        const logger = createColoredConsole({
            enabled: true,
            writer,
            theme: {
                success: { color: 'blueBright', underline: true }
            }
        });

        logger.success('Completed');

        const [label] = writer.log.mock.calls[0] as [string];
        expect(label).toContain('\u001b[4m');
        expect(label).toContain('\u001b[94m');
    });

    it('routes warn/error/debug to respective console methods', () => {
        const writer = makeWriter();
        const logger = createColoredConsole({ enabled: true, writer });

        logger.warn('Watch out');
        logger.error('Oops');
        logger.debug('Details');

        expect(writer.warn).toHaveBeenCalledTimes(1);
        expect(writer.error).toHaveBeenCalledTimes(1);
        expect(writer.debug).toHaveBeenCalledTimes(1);
    });

    it('falls back to log when writer method missing', () => {
        const writer = { log: jest.fn(), warn: undefined } as unknown as ReturnType<
            typeof makeWriter
        >;
        const logger = createColoredConsole({ enabled: true, writer });

        logger.warn('Fallback');
        expect(writer.log).toHaveBeenCalledTimes(1);
    });

    it('omits name prefix when not provided', () => {
        const writer = makeWriter();
        const logger = createColoredConsole({ enabled: true, writer });

        logger.info('No name');
        const [label] = writer.log.mock.calls[0] as [string];
        const plain = stripAnsi(label);
        expect(plain.startsWith('INFO')).toBe(true);
        expect(plain.includes('[')).toBe(false);
    });

    it('enables colors automatically when not specified', () => {
        const writer = makeWriter();
        const previous = process.env.FORCE_COLOR;
        process.env.FORCE_COLOR = '1';

        const logger = createColoredConsole({ writer });
        logger.info('Auto colors');

        const [label] = writer.log.mock.calls[0] as [string];
        expect(label.includes(String.fromCharCode(27))).toBe(true);

        if (previous === undefined) {
            delete process.env.FORCE_COLOR;
        } else {
            process.env.FORCE_COLOR = previous;
        }
    });
});
