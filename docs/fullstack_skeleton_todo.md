# DONE: FULLSTACK APPLICATION SKELETON

## About
Some steps to create a fullstack web application skeleton with:

- Backend express server
- Frontend React development server
- Google Oauth flow (with passportjs)
- Integration with remotely hosted MongoDB
- Heroku deployment

Thanks to Stephen Grider for the excellent course
[*"Node with React: Fullstack Web Development"*]
(https://www.udemy.com/node-with-react-fullstack-web-development/). These steps are copied from the course lectures with maybe just a little bit of rearranging some stuff in a couple of places.

## Steps

### Init Git-repository

### Creating project and first dependencies

    mkdir server
    cd server
    npm init
    npm install --save express

- Coding dummy-express server

### Heroku deployment

- Dynamic port binding
- Specify Node Environment
- Specify start script
- Add server .gitignore file

### Setting up new Heroku app

    sudo snap install heroku
    heroku login
    heroku create
    git remote add heroku [https://git...]

### Credentials for Google Oauth (development AND production)

- Google+ API
- Authorized JavaScript origins
- Authorized redirect URIs

### Handling first credentials
- Add server/config/ with necessary key-files
- Add Oauth-keys to Heroku env variables

### Add nodemon
    npm install --save nodemon

### Passport and oauth stuff (backend)

    npm install --save passport passport-google-oauth20
- Coding initial steps for oauth routes, services

### MongoDB setup (remote-hosted)

    npm install --save mongoose

- mlab.com
 - Setup db for development in mlab.com
 - Setup db for production in mlab.com
 - Set users
 - Get credentials

- Save new credentials to keys and Heroku env variables

- Add serializeUser and deserializeUser
- Connect to db, make user schema
- Add new user to db when authenticating

### Session handling - Cookies

    npm install --save cookie-session

- Add cookie key to keys and Heroku env variables
- Integrate passport with cookie-session
- Fix Heroku proxy issue in GoogleStrategy!

### Bringing in the frontend!

    npm install -g create-react-app
    create-react-app client
    npm install --save concurrently

- **Note:** We have two servers in development mode!
 - Set proper starting scripts in serverside package.json
- Add proxy-settings to frontend package.json
- Be sure to add port 3000 as authorized callback in google
- **Architecture decision:** Single server for api and frontend resources in production
 - (Easier to handle cookies and other stuff...) 

### Building front skeleton

**Client-side:**
    
    npm install --save redux react-redux react-router-dom
    npm install --save axios
    npm install --save redux-thunk

- Lots of coding for little things
  - Building needed components, reducers and actions for oauth flow
 - Adding logout redirection and auth callback redirection in serverside

### More Deployment stuff:
(Section 9 in Stephen's course)

- React + Express Routing in Production
- How to build frontend assets for production?

**Architecture decision:** We choose option #2 in lecture 110: Heroku installs all dependencies and build the whole client project

- *We DON'T commit built assets to git!*
- Adding "default" routes to index.js serverside to return assets and index.html
- Adding heroku-postbuild -> install deps -> npm run build
