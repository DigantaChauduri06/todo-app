# Todo List Application

## Overview
This repository contains the source code for a full-stack Todo List application. The frontend is built using Angular, while the backend is developed with Node.js and TypeScript.

## Tech Stack
### Frontend:
- **Framework**: Angular 17
- **UI Components**: Angular Material
- **State Management**: RxJS
- **Styling**:  SCSS
- **Date Management**: Day.js

### Backend:
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose for ODM)
- **Authentication**: (To be implemented if needed)
- **UUID Generation**: UUID package
- **Environment Variables**: Dotenv
- **Status Codes**: HTTP-Status-Codes
- **CORS Handling**: CORS package

## How to Run the Application
### Prerequisites:
- Node.js installed (v18+ recommended)
- MongoDB instance (local or cloud)
- Angular CLI installed globally (`npm install -g @angular/cli`)

### Backend Setup:
1. Clone the repository:  
   ```sh
   git clone <your-repo-url>
   cd todo-backend
   ```
2. Install dependencies:  
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following:  
   ```sh
   MONGO_URI=mongodb+srv://digantachaudhuri03:MongoDiganta06@todocluster.wd0w4.mongodb.net/?retryWrites=true&w=majority&appName=todocluster
   ```
4. Start the backend server:  
   ```sh
   npm run dev
   ```

### Frontend Setup:
1. Navigate to the frontend directory:  
   ```sh
   cd ../todo-frontend
   ```
2. Install dependencies:  
   ```sh
   npm install
   ```
3. Start the Angular application:  
   ```sh
   npm start
   ```

### API Endpoints
- **Create Todo:** `POST /api/todos`
- **Get Todos by User ID:** `GET /api/todos/user/:userId`
- **Get Single Todo:** `GET /api/todos/:id`
- **Update Todo:** `PUT /api/todos/:id`
- **Delete Todo:** `DELETE /api/todos/:id`

## Assumptions & Design Decisions
- Each Todo is associated with a `createdBy` user ID.
- Pagination is implemented for fetching Todos.
- Status and priority validation is enforced at the backend.
- Todos can have multiple assigned users.
- Proper error handling is included.

## Additional Features / Improvements
- Implemented pagination for better performance.
- Used Mongoose validation for schema consistency.
- Used Angular Material for UI consistency.
- Set up environment variable handling for database connection security.
- I have created some users in db so that we can proceed with main testing


## Not Implemented
- Media Query not implemented
- Authtentication is not implemented
- Some of the extra feature (for example: bulk complete, bulk delete) frontend is ready backend is not.



### User API - GET / CREATE

1. GET
```
curl --location 'http://localhost:8080/api/users/'
```

2. CREATE
```
curl --location 'http://localhost:8080/api/users/' \
--header 'Content-Type: application/json' \
--data '{
    "username": "Robin"
}'
```
