# evolve-frontend

## Setup ENV

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
NEXT_PUBLIC_AUTH_BASE_URL=<auth_microservice_base_url>
NEXT_PUBLIC_BACKEND_BASE_URL=<runner_controller_microservice_base_url>
NEXT_PUBLIC_MINIO_BASE_URL=<minio_base_url>
```

## Installation

```bash
npm install
```

## Run in Development Mode

```bash
npm run dev
```

## Run in Production Mode

```bash
npm run build && npm run start
```
