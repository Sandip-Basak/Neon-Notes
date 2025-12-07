# Neon Notes

A simple notes application built with a modern stack, featuring a React TypeScript frontend and a Django backend. This app allows users to create, view, edit, and delete notes, with support for image attachments.

## Features

-   **Create and Manage Notes**: Add new notes with titles and detailed content.
-   **Image Support**: Attach images to your notes for visual context.
-   **User Authentication**: Secure your notes with user accounts (Signup/Login).
-   **Modern UI**: Clean and responsive interface built with React and styled for usability.
-   **RESTful API**: Robust backend communication using Django.

## Tech Stack

### Frontend
-   **React** (v19)
-   **TypeScript**
-   **Vite** - For fast development and building.
-   **React Router** - For client-side navigation.
-   **Axios** - For API requests.
-   **Lucide React** - For icons.

### Backend
-   **Django** - High-level Python web framework.
-   **Python**
-   **SQLite** (Default) - Can be configured for PostgreSQL etc.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   Node.js (v16+ recommended)
-   Python (v3.8+)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd notes_project
    ```

2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:
    -   **Windows**:
        ```bash
        venv\Scripts\activate
        ```
    -   **macOS/Linux**:
        ```bash
        source venv/bin/activate
        ```

4.  Install dependencies:
    ```bash
    pip install django pillow django-cors-headers djangorestframework
    ```
    *(Note: Ensure you have all necessary requirements installed. A `requirements.txt` is recommended for the future.)*

5.  Apply migrations:
    ```bash
    python manage.py migrate
    ```

6.  Run the server:
    ```bash
    python manage.py runserver
    ```
    The backend will start at `http://127.0.0.1:8000/`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd neonnotes
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will start at `http://localhost:5173/` (or the port shown in your terminal).

## Contributing

Contributions are welcome! Please create a pull request or open an issue for any changes or suggestions.
