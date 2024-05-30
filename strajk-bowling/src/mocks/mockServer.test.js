import { rest } from 'msw';
import { setupServer } from 'msw/node';
import axios from 'axios';

// Define your mock server handlers
const handlers = [
  rest.post('https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com/', (req, res, ctx) => {
    const { when, lanes, people, shoes } = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        active: true,
        when,
        people,
        lanes,
        shoes,
        id: '12345',
        price: 820,
      })
    );
  }),
];

// Create a new mock server instance
const server = setupServer(...handlers);

// Start the mock server before running tests
beforeAll(() => server.listen());

// Stop the mock server after running tests
afterAll(() => server.close());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Write your test cases
test('should mock API request and return expected response', async () => {
  // Send a request to the mocked endpoint
  const response = await axios.post('https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com/', {
    when: '2024-06-01',
    lanes: 2,
    people: 4,
    shoes: ['Size 9', 'Size 10'],
  });

  // Assert that the response matches the expected data
  expect(response.status).toEqual(200);
  expect(response.data).toEqual({
    active: true,
    when: '2024-06-01',
    people: 4,
    lanes: 2,
    shoes: ['Size 9', 'Size 10'],
    id: '12345',
    price: 820,
  });
});