# GraphQL Server Boilerplate

### Overview

Whenever I start a new project, I always write out a bunch of code that I've written far too many
times before. So I've decided to create some good boilerplate and share it with the community.

### What's in the box?

[apollo-server-express](https://github.com/apollographql/apollo-server#readme), [TypeORM](http://typeorm.io/#/) and [ts-node](https://github.com/TypeStrong/ts-node) connected to a postgres database. The boilerplate also provides some basic user management, see below for more details on how this works.

## Quickstart

1. Clone this directory
2. Add a `.env` file to the root of the project(NOTE: For email to work, you'll need to provide a valid sparkpost api key)
3. run `yarn && yarn start` or `npm install && npm run start`

**Bonus:** Create some awesome schema and run `yarn generate` or `npm run generate` to generate type definitions for your schema.

### What do I need inside my `.env` file?

_Example `.env` file_

```
// Server connection options
PORT="1337"
SPARKPOST_API_KEY = "{this needs to be a valid sparkpost api key}"
JWT_SECRET = "super-duper-secret-goes-here"

// TypeORM configuration options
TYPEORM_CONNECTION = "{db connection}"
TYPEORM_HOST = "{db host}"
TYPEORM_USERNAME = "{db user}"
TYPEORM_PASSWORD = ""
TYPEORM_DATABASE = "{db name}"
TYPEORM_PORT = 5432
TYPEORM_SYNCHRONIZE = true
TYPEORM_LOGGING = false
TYPEORM_ENTITIES = "src/models/**/*.entity.ts"
```

## How does user management work?

We use a couple of different login strategies. Essentially, we pass around signed JWT's([json-web-token](https://jwt.io/)(s)) that the client sends back to the server to make sure users are authorised.

#### User signup.

When a new user wishes to sign up, we provide and endpoint that will take the user's email and password. Passwords are hashed and salted using [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme). Once the user has been saved to the database, we send out an email to the registered email address, with a token that contains metadata about the user's account status. The user can then follow the link to a client. The client can then send this token back to the server's specific endpoint which will verify the user.

#### User login

The client can choose to handle logins, either through credentials, or a valid token. This is pretty straight forward, if a user logs in using their credentials, we send back a new token to the client, the client can then use that token for authorisation. However the client can choose to sign in users using cached tokens. If the user attempts a sign in with a token, the server will make sure that the token is still valid, if it is, we simply return the same token back to the user and the client can then use that token to handle authorisation.

#### User logout

This is a quite simply metadata on the token, the server provides an endpoint that will take the session's active token, set that user's loging status to false and return this new status on the token.

#### Password reset

When a forgetful user needs a new password, the client can simply send their token to the specific endpoint. The server will then capture this against the user record and send out an email to the registered email address. The email will once again contain a token that will allow the user to change their password.
