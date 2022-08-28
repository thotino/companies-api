# NODE COMPANIES API
This project is a simple API that can create, retrieve and delete companies data.

## Install and start locally
```sh
git clone https://github.com/thotino/companies-api.git
cd companies-api
npm install
npm start
```

The server is now listening on the port 3000.
You can now navigate to http://localhost:3000/documentation/ to view the documentation.

## Features
* ExpressJS server
* SQLite3 database with Sequelize ORM
* CRUD services for the data

### Overview of the calls

Here are some example of calls

#### Create a new company
```sh
curl -X POST \
  http://localhost:3000/api/companies \
  -H 'Content-Type: application/json' \
  -d '{
	"name": "test",
	"sector": "test",
	"siren": 1234
}'
```

#### Create a company accounting results
```sh
curl -X POST \
  http://localhost:3000/api/companies/1234/results \
  -H 'Content-Type: application/json' \
  -d '{
	"year": 2020,
	"ca": 10,
	"margin": 10,
	"ebitda": 20,
	"loss": 100
}'
```

#### Retrieve all companies
```sh
curl -X GET \
  http://localhost:3000/api/companies
```

#### Retrieve all companies using name and/or sector (filtering)
```sh
curl -X GET \
  'http://localhost:3000/api/companies?name=Sons&sector=Retail'
```

#### Retrieve all companies with pagination
```sh
curl -X GET \
  'http://localhost:3000/api/companies?page=2&limit=25'
```

#### Filter all companies with pagination
```sh
curl -X GET \
  'http://localhost:3000/api/companies?name=Sons&sector=Retail&page=1&limit=10'
```

#### Retrieve a single company with its accounting results using its siren
```sh
curl -X GET \
  http://localhost:3000/api/companies/176873074
```

#### Delete all companies
```sh
curl -X DELETE \
  http://localhost:3000/api/companies
```

#### Delete a single company
```sh
curl -X DELETE \
  http://localhost:3000/api/companies/1234
```

#### Get a comparison of the accounting results
```sh
curl -X GET \
  http://localhost:3000/api/companies/105376773/compare
```

#### Populate a local database
```sh
curl -X POST \
  http://localhost:3000/api/companies/populate
```