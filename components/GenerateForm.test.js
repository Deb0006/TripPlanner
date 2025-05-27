import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Correct import for jest-dom
import TripForm from './TripForm';

describe('TripForm', () => {
  test('renders the destination input field', () => {
    render(<TripForm title="Test Title" result="" message="" />);
    const destinationInput = screen.getByLabelText(/Destination/i);
    expect(destinationInput).toBeInTheDocument();
  });

  test('renders the create button', () => {
    render(<TripForm title="Test Title" result="" message="" />);
    const createButton = screen.getByRole('button', { name: /CREATE/i });
    expect(createButton).toBeInTheDocument();
  });
});