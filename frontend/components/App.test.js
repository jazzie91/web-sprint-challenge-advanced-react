import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppFunctional from './AppFunctional'; 
import axios from 'axios';

jest.mock('axios');

describe('AppFunctional', () => {
  test('renders with initial state', () => {
    render(<AppFunctional />);
    
    expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  test('moves "B" correctly', async () => {
    render(<AppFunctional />);
    
    const leftButton = screen.getByText('LEFT');
    await userEvent.click(leftButton);
    
    expect(screen.getByText('Coordinates (2, 1)')).toBeInTheDocument();
    expect(screen.getByText('You moved 1 times')).toBeInTheDocument();
    expect(screen.queryByText('B')).toHaveClass('active');
  });

  test('resets state correctly', async () => {
    render(<AppFunctional />);
    
    const leftButton = screen.getByText('LEFT');
    await userEvent.click(leftButton);
    
    const resetButton = screen.getByText('RESET');
    await userEvent.click(resetButton);
    
    expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
    expect(screen.getByText('B')).toHaveClass('active');
  });

  test('displays error message on submission failure', async () => {
    axios.post.mockRejectedValue(new Error('Submission failed'));
    
    render(<AppFunctional />);
    
    const emailInput = screen.getByPlaceholderText('lady@gaga.com');
    await userEvent.type(emailInput, 'lady@gaga.com');
    
    expect(emailInput.value).toBe('lady@gaga.com');
    
    const submitButton = screen.getByText('SUBMIT');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Submission failed')).toBeInTheDocument();
    });
  });

  test('submits the form and shows success message', async () => {
    axios.post.mockResolvedValue({ data: 'success' });
    
    render(<AppFunctional />);
    
    const emailInput = screen.getByPlaceholderText('lady@gaga.com');
    await userEvent.type(emailInput, 'lady@gaga.com');
    
    const submitButton = screen.getByText('SUBMIT');
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email submitted successfully')).toBeInTheDocument();
    });
  });
});
