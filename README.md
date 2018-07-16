# Macrocalory
## What is Macrocalory?
It's an app for counting your food calories. It's main purpose for now, is to add support for Finnish foods for fitbit.
It's started as Kaloriraptorit by a team particimming in programming course which has now ended. I'm continueing by myself and further developing for my own needs.

# Kaloriraptorit
## What is Kaloriraptorit?
* Name of the team participating in the programming course
* Work title of the application developed by the team of two.


## What does the application do?

Kaloriraptorit is a simple web application for tracking what you eat. It's nothing very innovative and there are plenty of applications doing the same thing. But the functional requirements are quite easy to understand and they offer a great opportunity to try out some technologies building up a fullstack system.


## "Production" environment (repo version is newer, and this will be update soon in heroku)
* https://afternoon-escarpment-67756.herokuapp.com/

## Technologies, frameworks, modules and architecture
### Frontend
* Frontend was developed using [React](https://reactjs.org/) with [Redux](https://redux.js.org/).
* Necessary boilerplate was setup using [create-react-app](https://github.com/facebook/create-react-app)
* Bootstrap 3 was used via [react-bootstrap](https://react-bootstrap.github.io/)

* Some other necessary modules used:
  * axios
  * react-dom
  * react-redux
  * react-router-dom
  * react-widgets
  * recharts
  * redux-form

### Backend

* Backend is an [Express](https://expressjs.com/) -server running in [Nodejs](https://nodejs.org/en/) -runtime.

* Our backend uses [MongoDB](https://www.mongodb.com/) as a database technology. It is used with [Mongoose](http://mongoosejs.com/) and hosted remotely in [mLab](https://mlab.com/).

* Users sign in with Google OAuth and the authentication is implemented using [Passport](http://www.passportjs.org/).

### Production environment

* Our application is deployed to production using [The Heroku Platform](https://www.heroku.com)

* Only backend server is deployed. Frontend assets are built in postbuild -scripts and backend serves all the frontend assets to the client browser.

## Development environment and tools
The team used these tools:
* [Git](https://git-scm.com/)
* [GitHub](https://github.com/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Prettier](https://prettier.io/)
* [eslint](https://eslint.org/)
* [Postman](https://www.getpostman.com/)

## About the processes, practices and... quality :)
The point of the course was to give everybody an opportunity to code! No quality criteria was enforced and the team decided all the used methods.

* We did not determine strict coding conventions and we did not have any review practices. Different files can have very different looking code depending on who wrote it and in which phase of the course it was written.

* We did not spend time on creating tests or building up any CI-environment. We wanted to use our time for coding.

* We used a simple [Trello-board](https://trello.com/) to have some kind of backlog of functional and non-functional stuff.

## Want to run it yourself? What is not provided by the repository?

* Install nodejs + npm
* Clone the repository
* Install modules
* Setup mongoDB in mLab or some other way (need mlab-account and user credentials for the db instance)
* Activate Google+ API for the project and get the credentials for Google OAuth
* You need to create server/config/dev.js with the needed credentials
