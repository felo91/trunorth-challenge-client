# React Client Calculator Application

This is a calculator application built with React. It interacts with an AWS Serverless API (built separately) for its operations.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) TS template.

## Getting Started

Follow these steps to get a local copy up and running.

### Installation

Start by installing all the dependencies required for this project.

```shell
npm install
```

### Local Setup

To run the application locally, simply use the following command:

```shell
npm start
```

### Environment Variables

To setup your environment variables, generate a `.env` file. Here's an example of what it should look like:

```shell
# .env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENV=dev
```

### Build Setup

To run the build use the following command:

```shell
yarn build
```

## AWS Deployment

This application can be deployed to an S3 bucket using the following command:

```shell
npm run deploy
```

## Endpoints

The application makes requests to the following endpoints:

- `user login` - POST | {REACT_APP_API_URL}/dev/v1/login
- `record new user operation` - POST | {REACT_APP_API_URL}/dev/v1/record 
- `soft delete user operation` - DELETE | {REACT_APP_API_URL}/dev/v1/record
- `get all user operations` - GET | {REACT_APP_API_URL}/dev/v1/record
- `get all operations` - GET | {REACT_APP_API_URL}/dev/v1/operation

Replace `{REACT_APP_API_URL}` with the actual API URL from your environment variable.

## Live demo

http://true-north-client-us-east-2.s3-website.us-east-2.amazonaws.com/

## License

This project is licensed under the [MIT License](LICENSE.md).

