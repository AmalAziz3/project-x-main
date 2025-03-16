import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Questionnaire from '../Questionnaire';

const mockStore = configureStore([thunk]);

describe('Questionnaire Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      questionnaire: {
        currentStep: 0,
        answers: {},
        result: null,
        isSubmitting: false,
        error: null,
        questions: [
          {
            id: 1,
            category: 'Test Category',
            question: 'Test Question',
            options: [
              { id: 'a', text: 'Option A', majors: ['Major A'] },
              { id: 'b', text: 'Option B', majors: ['Major B'] },
            ],
          },
        ],
      },
    });
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Questionnaire />
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders questionnaire title', () => {
    renderComponent();
    expect(screen.getByText('Major Selection Questionnaire')).toBeInTheDocument();
  });

  test('displays question and options', () => {
    renderComponent();
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  test('next button is disabled until an option is selected', () => {
    renderComponent();
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();

    const optionA = screen.getByLabelText('Option A');
    fireEvent.click(optionA);
    expect(nextButton).not.toBeDisabled();
  });
}); 
