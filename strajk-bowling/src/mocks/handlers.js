// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.post('https://h5jbtjv6if.execute-api.eu-north-1.amazonaws.com/', (req, res, ctx) => {
    const { when, lanes, people, shoes } = req.body;
    return res(
      ctx.status(200),
      ctx.json({
        active: true,
        when,
        people,
        lanes,
        id: '12345',
        price: 820,
      })
    );
  }),
];