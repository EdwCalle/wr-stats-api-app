# WR Stats API

**WR Stats API** is a prototype REST API built with NestJS that serves as the backend for **WR Stats**, a web application designed to help *League of Legends: Wild Rift* players record their daily wins and losses, monitor their performance, and analyze their progress across ranked seasons.

The API manages player accounts, match records, ranked seasons, and ranked tiers, providing the necessary data and functionality for the WR Stats frontend.

## Current Features

- **Player Authentication:** Register and log in players using JWT-based authentication.
- **Match Management:** Create, read, update, and delete match records.
- **Season Management:** Manage ranked seasons through CRUD operations.
- **Ranked Tier Management:** Manage ranked tiers and their associated information.
- **API Documentation:** Explore available endpoints through Swagger.

> **Disclaimer:** This application was developed for learning and demonstration purposes only. It is a prototype and may contain bugs, inaccurate data, or unexpected behavior.

## Tech Stack

- **Backend:** NestJS
- **Database:** MongoDB
- **Authentication:** JWT
- **API Documentation:** Swagger
- **Containerization:** Docker and Docker Compose

## Getting Started with Docker

### Prerequisites

Make sure the following tools are installed:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (for local development)

### Installation and Setup

**Important:** Follow the steps in the specified order. The database must be initialized with sample data before starting the API to ensure the application functions correctly.

### 1. Clone the Repository

Clone this repository and navigate to the project directory:

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Configure Environment Variables

Create a `.env.development` file in the project root and add the following variables:

```env
JWT_SECRET=your-secret-key
MONGO_DB_URI=mongodb://mongodb:27017/wr_stats
NODE_ENV=development
```

Replace `your-secret-key` with a secure, randomly generated secret.

Ensure that your Docker Compose configuration loads these environment variables.

### 3. Start MongoDB

Build and start the MongoDB container:

```bash
docker compose up -d --build mongodb
```

This command starts the database service in detached mode.

### 4. Build the MongoDB Tools Container

Build the service containing the MongoDB database utilities:

```bash
docker compose build mongo-tools
```

These utilities are required to import the sample data.

### 5. Restore the Sample Database

Once MongoDB is running, execute the following command to import the sample data:

```bash
docker compose run --rm mongo-tools mongorestore --uri="mongodb://mongodb:27017" --archive=./assets/sample-data.gz --gzip
```

This command:

- Connects to the MongoDB service.
- Restores the database from the compressed archive.
- Removes the temporary tools container after execution.

**Note:** This step is only required during the initial setup, provided the database data is preserved. Ensure the archive file is available at the specified path inside the tools container.

> **Important — Database Initialization Required**
>
> The sample database must be successfully restored before starting the API. It contains essential default data, including **ranked seasons and ranked tiers**, which are required for the application to function correctly.
>
> **If the database restoration fails, is skipped, or is incomplete, the application will not function as expected.**
>
> Make sure the restoration process completes successfully before proceeding to the next step.

### 6. Start the Backend API

After restoring the database, build and start the API:

```bash
docker compose up -d --build api
```

The API should now be running and connected to MongoDB.

### 7. Access the API

Once the containers are running, you can access the following endpoints:

| Service | URL |
|---|---|
| REST API | http://localhost:3000/api/v1 |
| Swagger Documentation | http://localhost:3000/docs |

Use the Swagger documentation to explore and test the available API endpoints.

## Frontend Application

This API is designed to work with the **WR Stats** frontend application.

**Frontend Repository:** [WR Stats Web](https://github.com/EdwCalle/wr-stats-web-app/)

Once the API is running and the database has been initialized, follow the instructions in the frontend repository to complete the setup.


## Project Status

WR Stats API is currently a **prototype under development**.

The project was created for educational purposes, focusing on backend development, REST API design, authentication, database management, and Docker-based deployment.

Features, endpoints, and database structures may change as development continues.
