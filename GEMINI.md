# Gemini Project Guide: Evolve on Click (EvOC)

This document provides a comprehensive overview of the "Evolve on Click" project, specifically focusing on the `controller_microservice_v2`. It is intended as a guide for AI agents and developers to understand the project's architecture, conventions, and operational procedures.

## 1. Project Overview

This project is the central backend controller for the **Evolve on Click (EvOC) v2** platform, a system designed to provide a Jupyter-style notebook interface for working with Evolutionary Algorithms (EAs).

The `controller_microservice_v2` is a **Go-based** microservice that acts as the brain of the operation. It handles API requests from the frontend, manages the lifecycle of notebooks and coding problems, and communicates with a `Jupyter Kernel Gateway` to execute code written by users.

The broader architecture, as defined in `docker-compose.yaml` and design documents, includes:
- **`controller_microservice_v2`**: The main Go service.
- **`jupyter_gateway`**: Manages code execution kernels.
- **`python_runner`**: The Docker environment where Python code (using libraries like `deap`) is executed.
- **`cockroachdb`**: A distributed SQL database for storing all metadata related to users, problems, notebooks, and evolution runs.
- **`minio`**: An S3-compatible object store for large files like plots and graphs.
- **AI Pipeline**: A separate, asynchronous service (communicating via a message queue) responsible for the "code evolution" feature.

## 2. Building and Running

The project uses a `Makefile` for standardized development and operational commands.

- **Start the entire stack (recommended for development):**
  ```bash
  make docker-up
  ```

- **Run the Go service locally (requires other services to be running):**
  ```bash
  make run
  ```

- **Build the Go binary:**
  ```bash
  make build
  ```

- **Run tests:**
  ```bash
  make test
  ```

- **Stop and clean up Docker containers:**
  ```bash
  make clean
  ```

## 3. Development Conventions

The project follows a set of clear conventions to ensure code quality and maintainability, as outlined in `ARCHITECTURE.md`.

- **Layered Architecture**: Code is strictly separated into layers:
  **`routes`** (API definition) -> **`controllers`** (HTTP handling) -> **`modules`** (Business Logic) -> **`repository`** (Data Access).

- **API Design**:
  - The API is versioned under `/api/v1/`.
  - It follows RESTful principles.
  - Routing is handled by the standard library's `http.ServeMux` with explicit `METHOD /path` patterns (e.g., `POST /api/v1/kernels`).

- **Database Interaction**:
  - The database schema is defined in `db/schema.sql`.
  - The **Repository Pattern** is the standard for all database operations. Business logic in the `modules` layer should not contain raw SQL queries; it must call methods on a repository interface.

- **Logging**:
  - **`zerolog`** is used for structured logging.
  - The use of `fmt.Print*` or `log.Print*` is forbidden and blocked by a pre-commit hook.
  - The logger instance is injected as a dependency from `main.go`.

- **Configuration**:
  - All configuration (DB URLs, tokens, etc.) is managed via **environment variables**.
  - There should be **no hardcoded configuration values**. The `.env` file is used for local development.

- **Tooling**:
  - `Makefile` provides standard commands for building, running, and testing.
  ## Gemini Added Memories
- The user has successfully started both the `auth_microservice` and the `controller_microservice_v2`. I have implemented a gRPC authentication middleware in the controller that communicates with the auth service. The `POST /api/v1/sessions` route is now protected by this middleware. The user will begin testing this new authentication flow next.
- I have refactored the notebook object structure in the frontend to align with the backend's `controller_microservice_v2` and `llm_microservice` expectations. This involved renaming `type` to `cell_type`, `content` to `source`, and adding `execution_count` to code cells. I updated `useNotebookCells.js`, `useNotebook.js`, `useNotebookFetch.js`, `notebook-mapper.js`, and `useNotebookExecution.js` to ensure consistency across the application.
- I have improved the "modify" and "fix" functionality for individual cells and the chat window. This includes:
    - Modifying `useNotebookLLM.js` to return the full API response.
    - Updating `useNotebook.js` to correctly process API responses, handle conditional in-cell messages (only for single cell modifications), and manage chat messages.
    - Enhancing `ChatWindow.js` to display LLM responses, including `changes_made`, and visually distinguish user and bot messages.
    - Adding in-cell messages that appear for 5 seconds after a cell is modified or fixed.
    - Correcting the indexing logic in `useNotebook.js` for `cells_modified` to use the cell's index instead of its ID.
- I have also updated the UI of the notebook page to match the theme of the rest of the application. This included:
    - Changing the background to a light gray gradient.
    - Applying the `Geist Mono` font to the entire notebook layout.
    - Updating buttons in `CodeCellControls`, `ChatWindow`, `KernelControls`, and `ActionsToolbarModern` to use a teal color scheme.
    - Updating the code cell containers to have rounded corners and borders consistent with other card components.
    - Improving the output area with a teal theme, better error display, and a "Clear" button.
    - Implementing a confirmation popup for deleting cells, and resizing it for better fit.
- I have also implemented a new "Add Cell" functionality with a single plus icon at the top and bottom centers of each cell. Clicking this plus icon opens a small popup menu allowing the user to select between adding a "Code" or "Markdown" cell at that specific index. This functionality has been implemented in both `CodeCell.js` and `MarkdownCell.js`, and the `AddCellMenu` has been refactored into a separate reusable component.
- I have implemented a new, more engaging loading screen for the notebook page (`NotebookLoadingScreen.js`) that displays cycling text and icons. I also fixed a critical bug where the semantic `cell_name` was being lost during API data mapping, which involved correcting logic in `useNotebookFetch.js`, `notebook-mapper.js`, and `useNotebook.js`. Finally, I improved the cell controls UI by adding a manual close button to in-cell messages and ensuring that loading spinners and disabled states are correctly applied during LLM operations.
- I have implemented a new delta-based autosave system to efficiently persist notebook changes. This includes a new `useAutosave.js` hook that tracks changes (new, modified, deleted, and reordered cells) and sends them to a `PATCH /api/v1/notebooks/{id}/cells` endpoint every 5 minutes. The UI now includes a status indicator (`Saving...`, `Last saved at...`). I also re-integrated the manual save button to use this same efficient delta-based logic.

## 4. LLM Microservice (`evocv2_llm_microservice`)

This service is responsible for the AI-powered generation, modification, and fixing of DEAP (Distributed Evolutionary Algorithms in Python) code notebooks.

### 4.1. Project Overview

The `evocv2_llm_microservice` is a **Python-based** service using **FastAPI**. It exposes a REST API to create and manage 12-cell Jupyter notebooks for evolutionary algorithms. It uses a Large Language Model (LLM) via the Groq API to understand specifications and natural language instructions.

-   **Architecture**:
    -   **FastAPI**: Serves the REST API.
    -   **LangGraph**: Orchestrates the workflow for generating, modifying, and fixing notebooks, including validation and retry loops.
    -   **Instructor & Pydantic**: Ensures structured, validated JSON output from the LLM.
    -   **Groq**: Provides fast LLM inference.
    -   **Mem0**: An optional memory layer to persist session history and user preferences.
-   **Key Features**:
    -   **Generate**: Creates a complete, 12-cell DEAP notebook from a flexible JSON specification in a single LLM call.
    -   **Modify**: Updates an existing notebook based on natural language instructions.
    -   **Fix**: Attempts to automatically repair a broken notebook using an error traceback.
    -   **Session Management**: Maintains the state of notebooks across API calls.

### 4.2. Building and Running

The service is designed to be run with Docker.

-   **Prerequisites**:
    -   Docker and Docker Compose
    -   A Groq API key, which should be placed in a `.env` file.

-   **Set up environment variables**:
    ```bash
    cp .env.example .env
    # Edit .env and add your GROQ_API_KEY
    ```

-   **Build and run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```

-   **Run locally (without Docker)**:
    1.  Create a Python virtual environment and activate it.
    2.  Install dependencies: `pip install -r requirements.txt`
    3.  Run the server: `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`

-   **Verify it's running**:
    -   Access the health check endpoint: `curl http://localhost:8000/health`
    -   Or view the OpenAPI docs: `http://localhost:8000/docs`

### 4.3. API Endpoints

-   `POST /v1/generate`: Creates a new notebook.
-   `POST /v1/sessions/{session_id}/modify`: Modifies an existing notebook.
-   `POST /v1/sessions/{session_id}/fix`: Fixes a broken notebook.
-   `GET /v1/sessions/{session_id}`: Retrieves session details.
-   `GET /v1/sessions`: Lists all active sessions.

## 5. Autosave and Persistence

To ensure user work is saved efficiently without overwhelming the backend, the notebook implements a **timed, delta-based autosave system**.

### 5.1. How It Works

1.  **Change Tracking**: The frontend (`useAutosave.js` hook) constantly monitors the notebook for changes. It tracks:
    *   New cells being added.
    *   Existing cells being modified (source code changes).
    *   Cells being deleted.
    *   The order of cells being changed.
2.  **Dirty Flag**: Any change marks the notebook as "dirty," indicating it has unsaved changes.
3.  **Timed Autosave**: A timer runs every 5 minutes. If the notebook is "dirty," it automatically triggers a save.
4.  **Manual Save**: A manual save button is also available, which triggers the same save logic immediately.
5.  **Delta-Based Payload**: Instead of sending the entire notebook, the save logic calculates a "delta" containing only what has changed. This delta is sent to the backend.

### 5.2. API Endpoint

-   **Endpoint**: `PATCH /api/v1/notebooks/{id}/cells`
-   **Method**: `PATCH`
-   **Payload Structure**:
    ```json
    {
      "updated_order": ["id-1", "id-3", "id-2"],
      "cells_to_upsert": {
        "id-3": { "cell_type": "code", "source": "print('modified')" },
        "id-4": { "cell_type": "markdown", "source": "## New Cell" }
      },
      "cells_to_delete": ["id-5"]
    }
    ```
    *All fields are optional. Only fields with actual changes are sent.*

This approach minimizes network traffic and backend load, providing an efficient and reliable persistence layer.