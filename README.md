# Splitwise Mini

A modern, full-stack web application designed to simplify shared expenses. Built with a focus on advanced state management, algorithmic efficiency, and a premium "Glassmorphism" user interface.

## Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Framer Motion
* **Backend:** Python, FastAPI
* **Concepts Applied:** Greedy Algorithms, Dynamic Form Generation, Micro-interactions, RESTful API Integration

## Core Features
* **Algorithmic Debt Settlement:** Utilizes a greedy algorithm with $O(N \log N)$ time complexity to calculate the minimum number of transactions required to settle all debts.
* **Dynamic Group Generation:** Users can dynamically instantiate groups of $N$ size, seamlessly mapping UI state to underlying data structures.
* **Premium UI/UX:** Features a deeply blurred, glassmorphism aesthetic with interactive physics-based particle animations (`canvas-confetti`) for gamified feedback.
* **AI Vision Integration (Mocked):** Includes a Python FastAPI backend endpoint structured to handle image uploads for future OCR/Vision Model integration.

## Running Locally

### Frontend Setup
1. Navigate to the frontend directory: `cd splitwise-mini`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

### Backend Setup
1. Navigate to the backend directory: `cd splitwise-api`
2. Install dependencies: `pip install fastapi "uvicorn[standard]" python-multipart`
3. Start the FastAPI server: `uvicorn main:app --reload`
