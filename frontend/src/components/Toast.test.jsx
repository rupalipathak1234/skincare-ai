import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from '../contexts/ToastContext';
import { vi } from 'vitest';

const TestComponent = ({ message, type }) => {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast(message, type)}>Show Toast</button>
  );
};

describe('Toast System', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a success toast', () => {
    render(
      <ToastProvider>
        <TestComponent message="Success Action" type="success" />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Success Action')).toBeInTheDocument();
    
    // Check if it has success classes implicitly or just by text
    const toastMessage = screen.getByText('Success Action');
    expect(toastMessage).toBeInTheDocument();
  });

  it('renders an error toast', () => {
    render(
      <ToastProvider>
        <TestComponent message="Error Action" type="error" />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Error Action')).toBeInTheDocument();
  });

  it('dismisses toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent message="Closable Action" type="info" />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Closable Action')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText('Closable Action')).not.toBeInTheDocument();
  });

  it('automatically dismisses toast after 5 seconds', () => {
    render(
      <ToastProvider>
        <TestComponent message="Auto dismiss Action" type="warning" />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Auto dismiss Action')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Auto dismiss Action')).not.toBeInTheDocument();
  });
});
