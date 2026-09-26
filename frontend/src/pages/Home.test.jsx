import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    // Check for the main hero heading
    const heading = screen.getByRole('heading', { name: /Skin Profile/i });
    expect(heading).toBeInTheDocument();
  });

  it('renders the Start Assessment button', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    
    const ctaButton = screen.getByRole('button', { name: /Start Assessment/i });
    expect(ctaButton).toBeInTheDocument();
  });
});
