# Bun Project

This project uses [Bun](https://bun.sh/) as the JavaScript runtime for server-side development. It also includes support for process management with [PM2](https://pm2.keymetrics.io/) in production environments.

## Prerequisites

- Install [Bun](https://bun.sh/) by running:

  ```bash
  curl https://bun.sh/install | bash
  ```

- Install PM2 for process management:

  ```bash
  npm install pm2 -g
  ```

- Create the `.env` file by copying the variables from `.env.example` file in the root folder of the project

## Scripts

The project includes the following Bun scripts in package.json:

### start

Starts the server using Bun.

```bash
bun start
```

### dev

Starts the server in watch mode for development. This will automatically restart the server whenever changes are detected in server/index.ts.

```bash
bun dev
```

### prod

Starts the server in production using PM2. It runs Bun as the interpreter via PM2, ensuring that the server process is automatically restarted if it crashes.

```bash
bun prod
```

### kill

Stops the PM2-managed process for server/index.ts. Use this to clean up running instances of the server.

```bash
bun kill
```

## Running the Project

### Development Mode

To start the server in development mode with automatic reloading:

```bash
bun run dev
```

### Production Mode

To start the server in production mode with PM2:

```bash
bun run prod
```

To stop the server in production mode:

```bash
bun run kill
```

## Additional Notes

Bun is used as the runtime for both development and production.
PM2 is used to manage the production server, ensuring high availability with process monitoring and automatic restarts.
