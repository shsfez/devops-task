![](assets/cymptom_logo.svg)
&nbsp;

# Angular-NodeJS docker based task

You are going to build a really lightweight simple web interface + API which will later be containerized using docker.
We will use Redis as the database to store data on a separate container.


## Architecture

Our architecture design will be implemented in the following way:

- Redis container which the API will store data into.
- NodeJS & Angular running on the same container. Angular will be delivered through NodeJS server.
  You can read on how to access Redis with NodeJS on the following guide: [https://redislabs.com/lp/node-js-redis/](https://redislabs.com/lp/node-js-redis/)

## Requirements

- NodeJS (v12) + typescript (v3.6~), based on Express to build our api.
- Mocha + Chai for NodeJS unit tests
- Angular 8
- Docker & Docker-Compose


### Before you get started

1. Fork this repository.
2. Create your NodeJS code in the repository directory, all code should be inside the `src` folder, other environment related files like: docker files,`.gitignore`,`.tsconfig`, etc should be at the root directory of the repository.
3. Create your angular project inside the `angular-src` directory using the Angular CLI.

**You must follow this convention as NodeJS and Angular will be later merged to run together.**


### NodeJS

Your project must be written in typescript (~3.6) and not on javascript.

Build a simple API containing 4 endpoints:

- /api/test (GET) - This will simply return a json saying the following:

    ```json
    { "status": "ok" }
    ```

- /api/update_date (POST) - This will simply update a simple file with the date this endpoint was called, for example:

    ```json
    { "status": "ok", "message": "Date was updated in the file!" }
    ```

    **When calling this endpoint, the the file will be created if it does not exist, if it does we simply update it.**

- /api/update_date (GET) - This will simply return the last date that the file was updated in the user-readable format:

    ```json
    { "status": "ok", "message": "The last update date was: Sun Jan 19 2020 16:37:25 GMT+020" }
    ```

    **Notice that when the webserver is shut down, the file should remain consistent and not be deleted!**


- /api/update_redis?key={KEY}&value={VALUE} - This will update the redis database with the provided key and value from url query params.


Create mocha + chai based unit tests which will test these 3 endpoints. Check edge cases as well.

### Angular

Create an angular application which loads a simple page showing the data fetched from `/api/update_date`.


### Merging Angular and NodeJS on the same server

Angular must be compiled and copied to the NodeJS `/src` directory, you can call that directory `angular-dist`.

Create a route inside your NodeJS to allow all other requests other then `/api` to be routed to Angular `browser/index.html` file inside the `angular-dist` directory. This will allow you to run Angular within the same NodeJS server.

Notice that we are not using the `ng serve` command anymore as it is not necessary when angular is compiled.

**If you did this well, the following should occur:**

- When opening up your browser at:
`http://localhost:3000/api/test`, should show you the api response with `{"status": "ok"}`.

- When opening up your browser at:
`http://localhost:3000`, you will see your Angular UI with the response of the date\time the file was updated.


### Redis server
Run a simple Redis server which will be accessed through NodeJS API.
You can use ready-to-use docker images.

### Docker build

Our docker container will build both NodeJS and angular on the same container.

General guidelines:

- All of the docker related files and script should be at the root directory of the repository (and not inside the `src` directory).

- Create `.dockerignore` to ignore useless files from uploading to the container.

- Create a `build.sh` script which will install both node_modules for Angular and NodeJS, then compile Angular and NodeJS typescript and copy the distribution of Angular into the distribution of NodeJS.


- After compiling both NodeJS and Angular make sure to clean any source files, this is highly important both for image size and in case of container hack. Also make sure to clean-up useless dev dependencies.


### CI\CD Using Bitbucket

After you docker image is ready and fully working, please use BitBucket integrated CI\CD to perform the following:

- On each push to the develop\master, all unit tests (you have written in NodeJS using Mocha + Chai) will run.
- If code was pushed to the master branch, code will automatically be deployed **only after unit tests are passed**.
- Deploy your code to any service you feel free (GCP\AWS\Azure\etc).


**Good luck!**