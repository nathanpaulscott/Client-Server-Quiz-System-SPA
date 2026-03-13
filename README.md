# Client-Server Quiz System

## Overview
Full-stack quiz management application built with **Flask**, **SQLite** and a JavaScript-driven frontend.

The system supports two user roles:

- **Teachers / administrators**: create, import, export, edit and delete quizzes, upload images, mark submissions, manage users, and view quiz statistics
- **Students**: log in, take timed quizzes, submit answers, review marks and feedback, and view performance statistics

The project uses a Flask backend with token-based session handling, SQLAlchemy models, and dynamic page rendering driven by AJAX requests.

---

## Main Features

### Authentication and session handling
- User registration and login
- Password hashing using Werkzeug
- Token-based session handling using JWT
- Login expiry and inactivity checks
- Login attempt tracking and lockout after repeated failures

### Quiz management
- Create, edit, import, export and delete quizzes
- Support for:
  - multiple-choice questions
  - short-answer questions
  - image-based questions
- Quiz definitions stored in a structured JSON-based `.quiz` format
- Client-side validation before quiz import

### Student workflow
- Timed quiz attempts
- Auto-save / intermediate submission support
- Final submission handling
- Review of completed and marked quizzes
- Individual statistics view

### Teacher workflow
- Quiz administration dashboard
- Submission marking with marks and feedback per question
- User account management
- Summary and statistics views across quizzes

### Reporting and analytics
- Quiz-level summary statistics
- Mean and standard deviation of marks
- Histogram-style visualisation using Google Charts
- Administrative and student-specific performance views

---

## Architecture

### Backend
- **Python / Flask**
- **Flask-SQLAlchemy**
- **SQLite**
- **PyJWT**
- **Werkzeug security utilities**

### Frontend
- HTML templates rendered by Flask
- JavaScript / jQuery for AJAX-driven page loading and interaction
- CSS for custom UI styling
- DataTables for sortable / searchable tables
- Google Charts for statistics visualisation

### Application style
This project is implemented as a **client-server web application with dynamic AJAX navigation**.  
After login, page content is loaded and updated through authorised GET/POST requests rather than full-page reloads.

---

## Data Model

The main database tables are:

- **User** – user accounts, roles and login tracking
- **Question_Set** – quiz metadata
- **Question** – question content, marks and answer metadata
- **Submission** – quiz attempt status per user
- **Submission_Answer** – submitted answers, marks and comments
- **Log** – application activity log

This structure supports quiz delivery, marking, auditing and summary statistics.

---

## Quiz Format

Quizzes are stored in a JSON-based `.quiz` format.

A quiz contains:
- header metadata (`topic`, `time`, `enabled`, optional `qs_id`)
- one or more questions
- support for text and image question components
- support for multiple-choice or free-text answers

This allows quizzes to be imported/exported and edited outside the UI if needed.

---

## Security / Validation Features

Implemented safeguards include:

- password hashing
- token verification on protected routes
- client-side validation for usernames and passwords
- import validation for uploaded quiz files
- submission state checking to prevent illegal re-submission
- secure file upload handling for quiz images

---

## Tech Stack

- Python
- Flask
- Flask-SQLAlchemy
- SQLite
- JavaScript
- jQuery
- CSS
- JWT
- DataTables
- Google Charts

---

## Running the Application

1. Install the required packages
2. Navigate to the application folder
3. Run:

```bash
python app.py
```

4. Open:

```text
http://127.0.0.1:5000/
```

---

## Example Capabilities Demonstrated

This project demonstrates:

- full-stack web application development
- client-server architecture
- relational data modelling
- token-based authentication
- dynamic front-end behaviour with AJAX
- quiz workflow state management
- statistics and reporting features
- structured JSON import/export workflows

---

## Notes

This was developed as a university software engineering project.  
The codebase reflects a practical emphasis on functionality, role-based workflows, and end-to-end system integration rather than production deployment hardening.

---

## Author

Nathan Scott
