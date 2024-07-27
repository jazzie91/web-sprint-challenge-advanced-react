import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AppFunctional from './AppFunctional'; 
import axios from 'axios';
import '@testing-library/jest-dom'
import React from "react";

jest.mock('axios');

describe('AppFunctional', () => {
  test('renders with initial state', () => {
    render(<AppFunctional />);
    
    expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  test('moves "B" correctly', () => {
    render(<AppFunctional />);
    
    const leftButton = screen.getByText('LEFT');
    fireEvent.click(leftButton);
    const message = document.querySelector('#coordinates')
    
    expect(message.textContent).toBe('Coordinates (1, 2)');
    expect(screen.getByText('You moved 1 time')).toBeInTheDocument();
    expect(screen.queryByText('B')).toHaveClass('active');
  });

  test('resets state correctly', () => {
    render(<AppFunctional />);
    
    const leftButton = screen.getByText('LEFT');
    fireEvent.click(leftButton);
    
    const resetButton = screen.getByText('RESET');
    fireEvent.click(resetButton);
    
    expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
    expect(screen.getByText('B')).toHaveClass('active');
  });

  test('displays error message on no email submission failure', () => {
    axios.post.mockRejectedValue(new Error('Submission failed'));
    
    render(<AppFunctional />);
    const message = document.querySelector("#message")  
    const submitButton = document.getElementById('submit');
    fireEvent.click(submitButton);
    
    waitFor(() => {
      expect(message.textContent).toBe('Ouch: email is required');
    });
  });

  test('submits the form and shows success message', () => {
    axios.post.mockResolvedValue({ data: 'success' });
    
    render(<AppFunctional />);
    const up = document.querySelector("#up")
    const message = document.querySelector("#message")
    fireEvent.click(up)
    
    const emailInput = screen.getByPlaceholderText('type email');
    fireEvent.change(emailInput, {target: {value: 'lady@gaga.com'}});
    
    const submitButton = document.getElementById('submit');
    fireEvent.click(submitButton);
    
    waitFor(() => {
      expect(message.textContent).toBe('lady win #31')
    });
  });
});