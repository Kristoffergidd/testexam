import { rest } from 'msw';

export const handlers = [
  rest.post('https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        bookingId: '12345',
        price: 820,
      })
    );
  }),
];