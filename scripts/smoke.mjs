#!/usr/bin/env node
import * as coloredConsole from '../dist/index.js';

function fail(message, error) {
  console.error('[cw.helper.colored.console] Smoke test failed:', message);
  if (error) {
    console.error(error);
  }
  process.exit(1);
}

try {
  if (!coloredConsole || typeof coloredConsole.createColoredConsole !== 'function') {
    fail('createColoredConsole export missing');
  }

  if (typeof coloredConsole.colorize !== 'function' || typeof coloredConsole.applyStyle !== 'function') {
    fail('colorize/applyStyle exports missing');
  }

  const banner = coloredConsole.colorize('smoke', { color: 'green', bold: true }, { enabled: true });
  if (typeof banner !== 'string' || banner.length === 0) {
    fail('colorize did not return a string');
  }

  const logger = coloredConsole.createColoredConsole({ name: 'smoke', enabled: true });
  if (!logger || typeof logger.info !== 'function') {
    fail('createColoredConsole did not return a logger instance');
  }

  logger.debug('[cw.helper.colored.console] smoke logger ready');
  console.log('[cw.helper.colored.console] OK: smoke test passed');
} catch (error) {
  fail('unexpected error', error);
}
