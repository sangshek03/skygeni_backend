# SKYGENI Data API Service

Backend service providing business metrics data for the SKYGENI dashboard, built with Nestjs with postgres.

[SKYGENI Project Video](https://drive.google.com/file/d/1qkyPhPBPOl6M4rURDv4zHFtdUMHgc4mg/view?usp=sharing).


## API Endpoints

### Account Industry Data
- `GET /api/v1/analytics/account-industry?quarter=YYYY-QX`
```json
// Example Response
[
  {
    "industry": "Technology",
    "count": 42,
    "acv": "1250000.00",
    "quarter": "2024-Q1"
  }
]
```

### ACV Range Data
- GET /api/v1/analytics/acv-range/waterfall

```json
// Example Response
{
  "data": [
    {"stage": "Initial", "value": 500000},
    {"stage": "Upsell", "value": 200000}
  ]
}
```

### Team Performance Data
- GET /api/v1/analytics/team/horizontal-bar?quarter=YYYY-QX
```json
// Example Response
[
  {
    "type": "count",
    "teams": [
      {"name": "Europe", "value": 35, "quarter": "2024-Q1"}
    ]
  }
]
```


### Installation

1st you have to connect you db with backend.

## Ideal .env file

```bash
DB_HOST='localhost'
DB_PORT=5433
DB_NAME='db_name'
DB_USER='db_user'
DB_PASSWORD='pass'
DB_SCHEMA='db_schema'
NODE_ENV='development'
PORT=3001
```
Then after connecting db, you have to install all dependencies and run migration files
```bash
npm install
npm run migration:generate (optional)
npm run migration:run
npm run start
```

## API Documentation

Access Swagger UI at:
```bash
http://localhost:3001/api-docs
```