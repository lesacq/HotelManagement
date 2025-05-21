# Hotel Management API

This API has been migrated from MySQL to PostgreSQL using Sequelize ORM.

## Setup Instructions

1. Make sure you have PostgreSQL installed and running. If not, download and install from [postgresql.org](https://www.postgresql.org/download/)

2. Create a database named `hotel` in PostgreSQL:
```sql
CREATE DATABASE hotel;
```

3. Install dependencies:
```bash
npm install
```

4. Configure environment variables in `.env` file:
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hotel
DB_PORT=5432
PORT=3000
NODE_ENV=development
```

5. Start the server:
```bash
npm start
```

## Migration from MySQL to PostgreSQL

If you need to migrate your existing MySQL data to PostgreSQL:

1. Make sure both MySQL and PostgreSQL are running.
2. Verify MySQL connection details in `config/migration.js`.
3. Run the migration script:
```bash
npm run migrate
```

## API Endpoints

The API maintains the same endpoints as before:

- Staff: `/api/staff`
- Guests: `/api/guest`
- Services: `/api/services`
- Rooms: `/api/rooms`
- Bookings: `/api/bookings`
- Payments: `/api/payments`
- Dashboard: `/api/dashboards` 