# DL BACKEND

## About

API built for `DEEL`

## Stack

This API is built using [Typescript](https://www.typescriptlang.org/) and,[Express](https://expressjs.com/), [Node](https://nodejs.org/en/) and [Sequalize](https://sequelize.org/).

## Getting Started 🏁

### Prerequisites

1. [Node](https://nodejs.org/en/). We recommend using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) to make it easier to use the correct Node version.
2. [NPM](https://www.npmjs.com/package/npm)

### Running Locally 🏃🏽‍♂️

1. `npm i`
2. `npm start dev`

`API` will be available on `localhost:30001` 🚀

#### Endpoints

| Method | Endpoint                                                                     |
| ------ | ---------------------------------------------------------------------------- |
| GET    | <http://localhost:3001/contracts/:id>                                        |
| GET    | <http://localhost:3001/users/:id>                                            |
| GET    | <http://localhost:3001/admin/best-profession?start=date&end=date>            |
| GET    | <http://localhost:3001/admin/best-clients?start=date&end=date&limit=integer> |
| GET    | <http://localhost:3001/jobs/unpaid>                                          |
| POST   | <http://localhost:3001/jobs/:job_id/pay>                                     |
| POST   | <http://localhost:3001/balances/deposit/:userId>                             |

The request body in order to create or update the user needs to be in the following format:

## TODO

**The following bugs need to be fixed**

- Pay job, no locking or transaction management/isolation levels included on the tables used to fetch job data, at risk of concurrency issues.
- Pay job no check if job has already been paid.
- Update balance not including the check query in the transaction, also open to concurrency issues.
- Malformed JSON in deposit endpoint request returns a stack trace to API client.
- Admin best profession not returning the highest performing profession (incorrect aggregate column)

**The following needs to be done to improve the code quality**:

- Add integration tests for the endpoints using [SuperTest](https://www.npmjs.com/package/supertest)
- Add Unit tests for the helper functions
- Added service files that are responsible for the `sql` queries
- Create a simple pipeline using `github actions`
- Create a very simple front end using `react`
- Use husk to valdate git commits
- Convert `seedDb.js` and `model.js` into a typescript file