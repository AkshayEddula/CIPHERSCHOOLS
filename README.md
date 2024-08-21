
# Online Test Application

## Overview

This project is a web-based online test application built using React.js. The application allows users to take a timed test, submit their answers, and view a live camera preview while the test is in progress. It also ensures that users have granted permission for camera and microphone access before starting the test.

## Features

- **Instructions Section**: Displays the test instructions to the user, who must confirm they have read them before proceeding.
- **Camera and Microphone Access**: Prompts the user to grant access to their camera and microphone. A live video preview is shown after permission is granted.
- **Timed Test**: A timer counts down the time available for the test. If the time runs out, the test is automatically submitted.
- **Test Submission**: Users can answer multiple-choice questions and submit the test. The test data is sent to a backend server for processing.

## Email Template

![Screenshot of the Email Template](/template.png)

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **State Management**: React Context API
- **API Calls**: Axios
- **Routing**: React Router
- **Video and Audio Capture**: WebRTC (via `navigator.mediaDevices.getUserMedia`)
- **Backend**: Example API endpoints (replace with your actual backend details)

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (version 14.x or later)
- npm or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AkshayEddula/CIPHERSCHOOLS.git
   cd CIPHERSCHOOLS
   ```

2. Install the dependencies:
   ```bash
   run this in both frontend and backend folders
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Application

To start the application in development mode, run:

```bash
cd frontools && npm run dev
cd backend && nodemon start
```

This will launch the application on `http://localhost:5173`.

### Building for Production

To build the application for production, use:

```bash
npm run build
```
or
```bash
yarn build
```

The build will be output to the `build/` directory.

### Deployment

You can deploy the application on any static site hosting service like Vercel, Netlify, or GitHub Pages.

## Project Structure

```
/src
├── /components
│   ├── /camera
│   │   └── CameraAndMicrophone.jsx
│   ├── Instructions.jsx
│   ├── Nav.jsx
│   ├── ShowTest.jsx
│   └── Timer.jsx
├── /context
│   └── context.jsx
├── /pages
│   └── HomePage.jsx
├── /styles
│   └── tailwind.css
└── index.js
```

## API Endpoints

- **GET /test/writetest/:id** - Fetches the test data by ID.
- **POST /test/writetest/submittest** - Submits the test data.

> **Note**: Replace `https://cipherschools-uaa0.onrender.com` with your actual backend URL.

## Known Issues

- The video preview may not start on the first attempt to allow camera and microphone access. If this occurs, the user may need to click the button again.
- Ensure that you handle network errors gracefully to avoid disruptions during the test.

## Future Enhancements

- Implement user authentication and secure test submissions.
- Add more question types (e.g., fill-in-the-blank, essay).
- Improve the UI/UX with better design components and accessibility features.
- Implement a more sophisticated error-handling mechanism.

## Contributing

If you would like to contribute to this project, feel free to fork the repository and submit a pull request. All contributions are welcome!

## Contact

For any inquiries or support, please contact `akshayeddula454@gmail.com`.
