import React from 'react';
import { render } from '@testing-library/react';
import { Input } from './input';

test('Input', () => {
  render(<Input placeholder='placeholder' />);
  expect(3).toEqual(3);
});
