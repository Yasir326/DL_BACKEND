# DEEL BACKEND

## About

API built for `DEEL`

## Stack

This API is built using [Typescript](https://www.typescriptlang.org/) and,[Express](https://expressjs.com/), [Node](https://nodejs.org/en/) and [Sequalize](https://sequelize.org/)

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

## If Had More Time

**If I had more time I would have done the following**:

- Add integration tests for the endpoints
- Add Unit tests for the helper functions
- Added service files which do the `sql` queries
- created a simple pipeline using `github actions`
- create a very simple frontend using `react`
