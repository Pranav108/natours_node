# Natour Node

A node.js project built for honing my skills in back-end web development.

## Features

- API endpoints availabe as per user need
- Authentication and Authorization
- Update username, photo, email, and password
- Security: encryption, sanitization, rate limiting, etc.

## Lesson Learned

- RESTful API design and development with advanced features: filtering, sorting, aliasing, pagination
- CRUD operations with MongoDB database locally and on the Atlas platform (in the cloud)
- Fundamentals of Mongoose (MongoDB JS driver): Data models, CRUD operations, data validation, and middleware
- Using the MVC (Model-View-Controller) architecture
- Complete modern authentication with JWT: user sign up, log in, password reset, secure cookies, etc.
- Security: best practices, encryption, sanitization, rate limiting, etc.
- Sending emails with Mailtrap .
- Advanced error handling workflows.

## Tech stacks

- NodeJS - JS runtime environment
- Express - The web framework used
- Mongoose - Object Data Modelling (ODM) library
- MongoDB Atlas - Cloud database service
- JSON Web Token - Security Token
- Postman - API testing
- Mailtrap - Test email delivery
- Heroku - Cloud platform

## Demo

<img src="/ScreenShots/Screenshot1.png" width="49%"/> <img src="/ScreenShots/Screenshot2.png" width="49%"/>

## Setting Up Your Local Environment

If you wish to play around with the code base in your local environment, do the following

```bash
* Clone this repo to your local machine.
* Using the terminal, navigate to the cloned repo.
* Install all the neccessary dependencies, as stipulated in the package.json file.
* If you don't already have one, set up accounts with: MONGODB and MAILTRAP. Please ensure to have at least basic knowledge of how these services work.
* In your .env file, set environment variables for the following:
    * NODE_ENV=development
    * PORT=3000
    * USER=yourUsername
    * DATABASE=your-mongodb-database-url
    * DATABASE_PASSWORD=your-mongodb-password

    * SECRET=your-json-web-token-secret
    * JWT_EXPIRES_IN=90d
    * JWT_COOKIE_EXPIRES_IN=90

    * EMAIL_USERNAME=your mailtrap-username
    * EMAIL_PASSWORD=your mailtrap-password
    * EMAIL_HOST=smtp.mailtrap.io
    * EMAIL_PORT=2525
    * EMAIL_FROM=your-real-life-email-address

* Start the server.
* Your app should be running just fine.
```

Helpful commands

```bash
$ git clone https://github.com/yourGitHubUsername/natours_node
$ cd natours_node
$ npm install
$ npm run start_dev(for development)
$ npm run start_prod(for production)
```

## Optimizations

- Arranged and grouped all the variables, functions, middleware as per bussiness rule.
- Implemented MVC(Model-View-Controller) architecture
- Proper organized module structure.
- Advanced error handling methods implementation.
- Implemented handlerFactory to remove redundency in Controllers.

## API Features

API Documentation can be Found [here](https://documenter.getpostman.com/view/20551158/UzQuNQQY).Try to play around them.

## Acknowledgements

- [Jonas Schmedtmann](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/)
- [readme.so](https://readme.so/)

## Authors

- [@Pranav108](https://github.com/Pranav108/)

## NOTE

This project is not yet completed , I'm still working on it and many impovement are still possible for this app.
