# Tally

A full-stack inventory management system built with C#, ASP.NET Core, React, and SQL Server. Manage products, track stock levels, get low stock alerts, and maintain a full audit trail of every inventory change.

## Tech Stack

**Backend:** C#, ASP.NET Core, Entity Framework Core, SQL Server  
**Frontend:** React, TypeScript, Material UI  
**Tools:** Git, Visual Studio

## Features

- **Product Management** — create, update, and delete inventory items with SKU, category, price, and stock levels
- **Low Stock Alerts** — products automatically flagged when quantity drops below configurable threshold
- **Optimistic Concurrency** — concurrent stock updates detected and rejected using Entity Framework's RowVersion token, preventing one user from silently overwriting another's changes
- **Audit Trail** — every create, update, and delete operation logged with previous value, new value, user, and timestamp for full accountability

## How It Works

```
User updates product stock
        ↓
RowVersion sent with request
        ↓
Entity Framework compares RowVersion to database
        ↓
If match → update succeeds, new RowVersion issued
If mismatch → conflict detected, request rejected
        ↓
Audit log records old value, new value, user, timestamp
```

## Running Locally

### Prerequisites
- .NET 10 SDK
- SQL Server (LocalDB included with Visual Studio)
- Node.js 18+

### Backend

1. Clone the repo
2. Open `Tally.sln` in Visual Studio
3. Run migrations:
```
Update-Database
```
4. Press **F5** to run

API runs at `http://localhost:5154`  
Swagger docs at `http://localhost:5154/swagger`

### Frontend

```bash
cd frontend
npm install
npm start
```

App runs at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/Products` | Get all products |
| GET | `/api/Products/low-stock` | Get low stock products |
| GET | `/api/Products/{id}` | Get product by ID |
| POST | `/api/Products` | Create product |
| PUT | `/api/Products/{id}` | Update product |
| DELETE | `/api/Products/{id}` | Delete product |