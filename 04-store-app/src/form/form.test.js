import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import Form from './form';
import { CREATED_STATUS, ERROR_SERVER_STATUS } from '../consts/httpStatus';

const server = setupServer(
  rest.post('/products', (req, res, ctx) => {
    const { name, size, type } = req.body;
    if (!name || !size) {
      return res(ctx.status(ERROR_SERVER_STATUS));
    }
    return res(ctx.status(CREATED_STATUS));
  })
);

beforeAll(() => server.listen());

beforeEach(() => {
  render(<Form />);
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe('when the form is mounted', () => {
  it('there must be a create product form page', () => {
    expect(
      screen.getByRole('heading', { name: /create product/i })
    ).toBeInTheDocument();
  });

  it('should exists the fields: name, size, type (electronic, furniture, clothing)', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.queryByText(/electronic/i)).toBeInTheDocument();
    expect(screen.queryByText(/furniture/i)).toBeInTheDocument();
    expect(screen.queryByText(/clothing/i)).toBeInTheDocument();
  });

  it('should exists the submit button', () => {
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
});

describe('when the user submits the form without values', () => {
  it('should display validation messages', () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument();
    // expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument();
    // expect(screen.queryByText(/the type is required/i)).toBeInTheDocument();
  });
});

describe('when the user blurs an empty field', () => {
  it('should display a validation error message for the input name', () => {
    expect(screen.queryByText(/the name is required/i)).not.toBeInTheDocument();

    fireEvent.blur(screen.queryByLabelText(/name/i), {
      target: { name: 'name', value: '' },
    });

    expect(screen.queryByText(/the name is required/i)).toBeInTheDocument();
  });

  it('should display a validation error message for the input size', () => {
    expect(screen.queryByText(/the size is required/i)).not.toBeInTheDocument();

    fireEvent.blur(screen.queryByLabelText(/size/i), {
      target: { name: 'size', value: '' },
    });

    expect(screen.queryByText(/the size is required/i)).toBeInTheDocument();
  });
});

describe('when the user submits the form properly and the server returns created status', () => {
  it('should the submit button be disabled until the request is done', async () => {
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();

    // wait and expect no disabled
    await waitFor(() => expect(submitBtn).not.toBeDisabled());
  });

  it("the form page must display the success message 'Product stored' ans clean the fields values", async () => {
    const nameInput = screen.getByLabelText(/name/i);
    const sizeInput = screen.getByLabelText(/size/i);

    fireEvent.change(nameInput, {
      target: { name: 'name', value: 'my product' },
    });
    fireEvent.change(sizeInput, {
      target: { name: 'size', value: '10' },
    });
    const submitBtn = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitBtn);

    await waitFor(() =>
      expect(screen.getByText(/product stored/i)).toBeInTheDocument()
    );

    expect(nameInput).toHaveValue('');
    expect(sizeInput).toHaveValue('');
    expect(screen.getByLabelText(/type/i)).toHaveValue('electronic');
  });
});

describe('when the user submits the form and teh server returns ans unexpected error', () => {
  it("the form page must display the error message 'Unexpected error, please try again'", async () => {
    const submitBtn = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitBtn);

    await waitFor(() =>
      expect(
        screen.getByText(/unexpected error, please try again/i)
      ).toBeInTheDocument()
    );
  });
});

describe('when the user submits the form and the server returns an invalid request error', () => {
  it("the form page must display the error message 'The form is invalid, the fields [field1...fieldN] are required'", async () => {
    server.use(
      rest.post('/products', (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            message:
              'The form is invalid, the field name, size type are required',
          })
        );
      })
    );

    const submitBtn = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitBtn);

    await waitFor(() =>
      expect(
        screen.getByText(
          /the form is invalid, the field name, size type are required/i
        )
      ).toBeInTheDocument()
    );
  });
});

describe('when the user submits the form and the server returns an invalid request error', () => {
  it("the form page must display the error message 'The form is invalid, the fields [field1...fieldN] are required'", async () => {
    server.use(
      rest.post('/products', (req, res, ctx) => {
        return res.networkError('Failed to connect');
      })
    );

    const submitBtn = screen.getByRole('button', { name: /submit/i });

    fireEvent.click(submitBtn);

    await waitFor(() =>
      expect(
        screen.getByText(/connection error, please try later/i)
      ).toBeInTheDocument()
    );
  });
});
