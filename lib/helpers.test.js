import { describe, it, expect } from 'vitest';
import { capitalizeFirstLetter } from './helpers';

describe('capitalizeFirstLetter', () => {
  it('capitalizes the first letter of a lowercase string', () => {
    expect(capitalizeFirstLetter('hello')).toBe('Hello');
  });

  it('keeps already capitalized strings unchanged', () => {
    expect(capitalizeFirstLetter('Hello')).toBe('Hello');
  });

  it('handles single character strings', () => {
    expect(capitalizeFirstLetter('a')).toBe('A');
  });

  it('returns empty string for null input', () => {
    expect(capitalizeFirstLetter(null)).toBe('');
  });

  it('returns empty string for undefined input', () => {
    expect(capitalizeFirstLetter(undefined)).toBe('');
  });

  it('returns empty string for empty string input', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });

  it('handles strings starting with numbers', () => {
    expect(capitalizeFirstLetter('123abc')).toBe('123abc');
  });

  it('handles strings starting with special characters', () => {
    expect(capitalizeFirstLetter('!hello')).toBe('!hello');
  });

  it('handles all uppercase strings', () => {
    expect(capitalizeFirstLetter('HELLO')).toBe('HELLO');
  });
});
