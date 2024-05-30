import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookingInfo from './bookinginfo/BookingInfo';
import Shoes from './shoes/Shoes';
import Confirmation from './confirmation/Confirmation';
import ErrorMessage from './errormessage/ErrorMessage';
import { server } from '../mocks/setup'; // Adjust the import path as necessary
import { rest } from 'msw';

// Add a new handler in the test to intercept the request and respond with mock data
server.use(
  rest.post('https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        active: true,
        when: '2024-06-01T18:00',
        people: 6,
        lanes: 1,
        shoes: [{ size: 42 }],
        id: '12345',
        price: 820,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('User can book a date, time and number of players', () => {
  const updateBookingDetails = jest.fn();
  
  render(<BookingInfo updateBookingDetails={updateBookingDetails} />);
  
  const dateInput = screen.getByLabelText(/Date/i);
  const timeInput = screen.getByLabelText(/Time/i);
  const playersInput = screen.getByLabelText(/Number of awesome bowlers/i);
  const lanesInput = screen.getByLabelText(/Number of lanes/i);
  
  fireEvent.change(dateInput, { target: { value: '2024-06-01' } });
  fireEvent.change(timeInput, { target: { value: '18:00' } });
  fireEvent.change(playersInput, { target: { value: '6' } });
  fireEvent.change(lanesInput, { target: { value: '1' } });
  
  expect(updateBookingDetails).toHaveBeenCalledTimes(4);
});

test('Displays error if date, time or players are not provided', () => {
  render(<ErrorMessage />);
  
  expect(screen.getByText(/Fill out all the fields/i)).toBeInTheDocument();
});

test('User can select shoe sizes for each player', () => {
  const updateSize = jest.fn();
  const addShoe = jest.fn();
  const removeShoe = jest.fn();
  const shoes = [{ id: '1', size: '' }];
  
  render(<Shoes updateSize={updateSize} addShoe={addShoe} removeShoe={removeShoe} shoes={shoes} />);
  
  const addButton = screen.getByText('+');
  fireEvent.click(addButton);
  
  expect(addShoe).toHaveBeenCalledTimes(1);
  
  const shoeSizeInput = screen.getByLabelText(/Shoe size \/ person 1/i);
  fireEvent.change(shoeSizeInput, { target: { value: '42' } });
  
  expect(updateSize).toHaveBeenCalledWith(expect.any(Object));
});

test('User can remove a shoe size field', () => {
  const updateSize = jest.fn();
  const addShoe = jest.fn();
  const removeShoe = jest.fn();
  const shoes = [{ id: '1', size: '' }];
  
  render(<Shoes updateSize={updateSize} addShoe={addShoe} removeShoe={removeShoe} shoes={shoes} />);
  
  const removeButton = screen.getByText('-');
  fireEvent.click(removeButton);
  
  expect(removeShoe).toHaveBeenCalledTimes(1);
});

test('User can submit a booking and receive a booking number and total amount', async () => {
  const confirmationDetails = {
    active: true,
    when: '2024-06-01T18:00',
    people: 6,
    lanes: 1,
    id: '12345',
    price: 820
  };
  
  const setConfirmation = jest.fn();
  
  render(<Confirmation confirmationDetails={confirmationDetails} setConfirmation={setConfirmation} />);
  
  expect(screen.getByText(/Booking number/i)).toBeInTheDocument();
  expect(screen.getByText(/Total:/i)).toBeInTheDocument();
});

test('User can navigate back to booking view after confirmation', () => {
  const confirmationDetails = {
    active: true,
    when: '2024-06-01T18:00',
    people: 6,
    lanes: 1,
    id: '12345',
    price: 820
  };
  
  const setConfirmation = jest.fn();
  
  render(<Confirmation confirmationDetails={confirmationDetails} setConfirmation={setConfirmation} />);
  
  const backButton = screen.getByText(/Sweet, let's go!/i);
  fireEvent.click(backButton);
  
  expect(setConfirmation).toHaveBeenCalledWith({});
});

test('submits booking details and receives confirmation from mock server', async () => {
  const updateBookingDetails = jest.fn();
  
  render(<BookingInfo updateBookingDetails={updateBookingDetails} />);
  
  // Fill in the booking form
  fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2024-06-01' } });
  fireEvent.change(screen.getByLabelText(/Time/i), { target: { value: '18:00' } });
  fireEvent.change(screen.getByLabelText(/Number of awesome bowlers/i), { target: { value: '6' } });
  fireEvent.change(screen.getByLabelText(/Number of lanes/i), { target: { value: '1' } });
  
  // Simulate form submission
  const submitButton = screen.getByRole('button', { name: /submit/i });
  fireEvent.click(submitButton);
  
  // Wait for the confirmation component to appear
  await waitFor(() => screen.getByText(/Booking number/i));
  
  // Verify the confirmation details
  expect(screen.getByText(/2024-06-01 18:00/i)).toBeInTheDocument();
  expect(screen.getByText(/6/i)).toBeInTheDocument();
  expect(screen.getByText(/1/i)).toBeInTheDocument();
  expect(screen.getByText(/12345/i)).toBeInTheDocument();
  expect(screen.getByText(/820 sek/i)).toBeInTheDocument();
});