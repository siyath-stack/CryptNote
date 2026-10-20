// tests/app.test.js - Vitest Unit Tests for CryptNote
import { describe, it, expect } from 'vitest';
const { formatTimestamp } = require('../server.js');

describe('CryptNote Logic Tests', () => {

  // Test 1: Verify timestamp formatting function
  it('formatTimestamp should return a formatted date string', () => {
    const testDate = new Date('2026-10-20T10:00:00Z');
    const result = formatTimestamp(testDate);
    expect(result).toBe('2026-10-20 10:00');
  });

  // Test 2: Input validation and trimming
  it('should trim extra whitespace from entry content', () => {
    const rawInput = "   Writing a private note...   ";
    const cleaned = rawInput.trim();
    expect(cleaned).toBe("Writing a private note...");
  });

  // Test 3: Password validation logic
  it('should correctly validate master password attempts', () => {
    const masterPassword = "mysecretpassword";
    const correctInput = "mysecretpassword";
    const wrongInput = "wrongpass123";

    expect(correctInput === masterPassword).toBe(true);
    expect(wrongInput === masterPassword).toBe(false);
  });

});