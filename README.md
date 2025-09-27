# AI PDF Generator - Project Documentation

This document serves as the internal technical guide for the AI PDF Generator application.

## 1. Overview

This project is a full-stack web application that allows users to generate styled PDF documents from natural language prompts. It uses a Next.js frontend and API layer that communicates with a Python/FastAPI backend for all AI-powered heavy lifting. The system supports context-aware generation by allowing users to upload their own documents, which are stored and queried from a vector database.

## 2. Key Features

* **AI-Powered PDF Generation**: Users can write natural language prompts to generate complete, styled documents.
* **Context-Aware Generation**: Ability to upload personal PDF files, which are vectorized and stored, allowing the AI to use them as a knowledge base for generation.
* **PDF Management Dashboard**: A user-specific dashboard that lists all previously generated documents.
* **User Authentication & Plans**: Secure user authentication with a credit-based system for free and premium tiers.
* **Live Preview**: A WYSIWYG editor that displays the generated HTML in real-time before downloading the final PDF.

## 3. Tech Stack

| Category              | Technology             | Purpose                                        |
| --------------------- | ---------------------- | ---------------------------------------------- |
| **Frontend** | Next.js, React, Tailwind CSS | UI, client-side logic, and previewing documents. |
| **Backend (BFF)** | Next.js API Routes     | User auth, CRUD operations, proxy to Python.   |
| **AI Backend** | FastAPI (Python)       | AI logic, PDF generation, context processing.  |
| **AI / LangChain** | LangChain, Gemini API  | LLM calls, document processing, embeddings.    |
| **Authentication** | BetterAuth             | User authentication and management.            |
| **Database (Primary)**| Supabase (PostgreSQL)  | Storing user data, PDF metadata, credits.      |
| **Database (Vector)** | Pinecone               | Storing text embeddings for context search.    |

## 4. Architecture Overview

The application is split into two main services: the **Next.js App** and the **FastAPI Server**.

* **Next.js App**: Serves the user-facing UI and a "Backend for Frontend" (BFF) via its API routes. The BFF handles all direct communication from the client, manages authentication with BetterAuth, performs CRUD operations on the Supabase database (e.g., fetching PDF lists), and acts as a secure proxy for all requests to the FastAPI server.

* **FastAPI Server**: A stateless Python service that exposes endpoints for all AI-related tasks. It is never directly accessed by the end-user. Its sole purpose is to receive requests from the Next.js BFF, perform complex operations using LangChain and the Gemini API, and return the result.

*(A diagram illustrating the flow between Client -> Next.js -> FastAPI -> Databases/Services should be embedded here.)*

### Core Workflows

#### A. New PDF Generation

The generation process is a multi-layered pipeline designed to produce high-quality, well-formatted documents.

1.  **Request**: The Next.js API sends a user prompt to the `/generate` endpoint on the FastAPI server.
2.  **Workflow Execution**: The main `workflow` function calls four distinct layers in sequence:
    * **Layer 1: Prompt Refinement (`prompt_refine.py`)**: The initial prompt is sent to Gemini to be broken down into three parts: a detailed content description, specific formatting instructions (e.g., colors, fonts), and structural instructions (e.g., "use a table").
    * **Layer 2: Content Draft (`content_draft.py`)**: The content description and structural instructions are used to generate the initial Markdown draft. If context is required, the workflow performs a similarity search against Pinecone and injects the results into the prompt.
    * **Layer 3: Structure Refinement (`refine_structure.py`)**: The Markdown draft is passed through another LLM call to clean up the structure, improve flow, and ensure adherence to the structural instructions.
    * **Layer 4: Formatting & Rendering (`formatting.py`, `renderer.py`)**: The formatting instructions are used to generate a JSON object of CSS styles. The refined Markdown is converted to HTML, and the CSS styles are injected as inline styles on each HTML element.
3.  **Response**: The final, self-contained HTML string is returned to the Next.js BFF, which then sends it to the frontend for rendering via `dangerouslySetInnerHTML`.

#### B. Context Upload

1.  **Upload**: The user uploads a PDF. The Next.js BFF streams this file to the `/add_context` endpoint on the FastAPI server.
2.  **Processing**: The FastAPI server uses LangChain's document loaders to parse the PDF, split it into text chunks, generate embeddings for each chunk using an embedding model, and upsert the resulting vectors into the Pinecone database, tagged with the user's ID.

## 5. API Endpoints & Contract

This section defines the primary communication contract between the services.

### Next.js API Routes (BFF)

* `POST /api/generate`: Receives prompt from client, proxies to FastAPI, saves metadata to Supabase.
* `POST /api/context`: Receives PDF file from client, streams it to FastAPI.
* `POST /api/edit`: Receives edit instructions, proxies to FastAPI.
* `GET /api/pdfs`: Fetches the list of a user's generated PDFs from Supabase.
* `POST /api/download-pdf`: Receives final HTML and uses Playwright to convert it to a downloadable PDF.

### FastAPI Endpoints

* `POST /generate`: Expects a JSON payload with `userPrompt`, `userId`, etc. Executes the full AI workflow and returns a final HTML string.
* `POST /add_context`: Expects a file upload. Processes the PDF and stores it in Pinecone.
* `POST /edit`: Expects `userPrompt` and existing `html`. Returns a modified HTML string.

## 6. Credit System

* **Free Plan**: Users start on a free plan with 20 credits.
* **Premium Plan**: Users can upgrade to a premium plan, which also provides 20 credits. (Note: Clarify if this is a monthly refresh or a one-time allocation).
* **Credit Deduction**: One credit is deducted for each successful call to the `/generate` or `/edit` endpoints. Context uploads are free.
* **Management**: The credit count for each user is stored and managed in the Supabase `user` table. 
