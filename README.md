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
When you start app, it run's on localhost and cache all data from images API immediately after launch, 
and after that it caches data and refresh token every 15 minutes.
You can get data from images API or cache by specific endpoints.
To run the app you need only to run npm run start or npm run start:dev to run it in watch mode.

### endpoints
```
1.Get fisrt paginated page with images: GET /images.
2.Get specific paginated page with images: GET /images?page=2.
3.Get details about specific images: GET /images/${id}.
4.Get array of images by searchTerm: GET /images/${searchTerm}.
4.1.This endpoint get's data from cache by searchTerm and looking for coincidences
in tags, camera and author fields.
```

### environment
.env:
```
PORT - specifies on which port app will run.
API_KEY - api key for which allows us to get authentication token.
API_URL - Api images URl.
CACHE_EXPIRATION_TIME_IN_MINITES - time in minutes to store all images in cache.
```
