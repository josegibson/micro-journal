# Micro Journal

A minimalist journaling application that focuses on simplicity and ease of use. Built to help users maintain daily journal entries with minimal friction.

## Live Demo
https://micro-journal.netlify.app/

## Features

- 📝 Quick bullet-point journaling
- 🔄 Offline-first with local storage sync
- 📱 Responsive design (mobile & desktop)
- 👤 Basic user authentication
- 🌐 Cross-device synchronization
- 🎨 Dark mode interface

## Tech Stack

### Frontend
- React (Create React App)
- React Router for navigation
- SCSS for styling
- Local Storage for offline data persistence

### Backend
- Express.js
- SQLite with Sequelize ORM
- Basic REST API

## Limitations & Areas for Improvement

- Basic authentication (no password protection)
- Limited formatting options for journal entries
- No data encryption at rest
- No rich text or media support
- Basic error handling
- Limited test coverage

## Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/micro-journal.git
    cd micro-journal
    ```

2. **Set up the backend**
    ```bash
    cd backend
    npm install
    npm start
    ```

3. **Set up the frontend**
    ```bash
    cd ../micro-journal
    npm install
    npm start
    ```

## Usage

After installation, open [https://micro-journal.netlify.app/](https://micro-journal.netlify.app/) in your browser to start using the application.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.