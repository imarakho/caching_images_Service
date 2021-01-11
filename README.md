## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Description
When you start app, Service cache all data from images API, 
and after that it caches data and refresh token every 15 minutes.
You can get data from data or cache by specific endpoints.

# endpoints
```
1.Get fisrt paginated page with images: GET /images.
2.Get specific paginated page with images: GET /images?page=2.
3.Get details about specific images: GET /images/${id}.
4.Get array of images by searchTerm: GET /images/${searchTerm}.
4.1.This endpoint get's data from cache by searchTerm and looking for coincidences
in tags, camera and author fields.
```
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
