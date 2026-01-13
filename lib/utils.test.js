import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('returns single class string as-is', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('combines multiple class strings', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('handles conditional classes with objects', () => {
    const isActive = true;
    const isDisabled = false;

    const result = cn('base-class', {
      'active-class': isActive,
      'disabled-class': isDisabled,
    });

    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
    expect(result).not.toContain('disabled-class');
  });

  it('handles arrays of classes', () => {
    const result = cn(['class-a', 'class-b'], 'class-c');
    expect(result).toContain('class-a');
    expect(result).toContain('class-b');
    expect(result).toContain('class-c');
  });

  it('merges conflicting Tailwind classes (last wins)', () => {
    const result = cn('px-2', 'px-4');
    expect(result).toBe('px-4');
    expect(result).not.toContain('px-2');
  });

  it('merges conflicting Tailwind color classes', () => {
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
    expect(result).not.toContain('text-red-500');
  });

  it('handles empty string inputs', () => {
    const result = cn('valid-class', '', 'another-class');
    expect(result).toContain('valid-class');
    expect(result).toContain('another-class');
  });

  it('handles undefined inputs', () => {
    const result = cn('valid-class', undefined, 'another-class');
    expect(result).toContain('valid-class');
    expect(result).toContain('another-class');
  });

  it('handles null inputs', () => {
    const result = cn('valid-class', null, 'another-class');
    expect(result).toContain('valid-class');
    expect(result).toContain('another-class');
  });

  it('handles false inputs', () => {
    const result = cn('valid-class', false, 'another-class');
    expect(result).toContain('valid-class');
    expect(result).toContain('another-class');
  });

  it('returns empty string when no valid classes', () => {
    const result = cn(undefined, null, false, '');
    expect(result).toBe('');
  });

  it('handles complex Tailwind class merging', () => {
    const result = cn(
      'p-4 bg-white text-black',
      'p-2 bg-gray-100',
      { 'text-white': true }
    );
    expect(result).toContain('p-2');
    expect(result).not.toContain('p-4');
    expect(result).toContain('bg-gray-100');
    expect(result).not.toContain('bg-white');
    expect(result).toContain('text-white');
    expect(result).not.toContain('text-black');
  });
});
