# 40.1 Biztime

## Init

1. Initialize

```bash
npm init
npm install
npm install express
npm install pg
```

2. Create Database and load SQL

```bash
createdb biztime
psql biztime < data.sql
```

Open database and run `\d` or `\dt` to make sure it's loaded correctly.

## Testing the routes in Insomnia

### localhost:3000
{"error":{"message":"Not Found","status":404},"message":"Not Found"}

#### localhost:3000/companies
GET
displays the db

POST
{
  "code": "company1code",
  "name": "company1name",
  "description": "Description of the company"
}

DELETE
`localhost:3000/companies/company1code`
this will delete the company

#### localhost:300/companies/:code
##### Enter the company :code:
GET display

DELETE will delete the company

PUT 
{
  "name": "Updated Company Name",
  "description": "Updated description"
}


### localhost:3000/invoices
GET displays from the db

POST `apple` has to be an existing `comp_code`
{
  "comp_code": "apple",
  "amt": 100
}

#### localhost:3000/invoices/id
GET localhost:3000/invoices/1
this displays the JSON of the 1 id invoice

DELETE localhost:3000/invoices/1
this will delete that specific invoice