#!/usr/bin/env node
import * as coloredConsole from '../dist/index.js';

if (!coloredConsole || typeof coloredConsole.createColoredConsole !== 'function') {
  console.error('Smoke test failed: createColoredConsole export missing');
  process.exit(1);
}

if (typeof coloredConsole.applyStyle !== 'function') {
  console.error('Smoke test failed: applyStyle export missing');
  process.exit(1);
}

console.log('OK: smoke test passed');
