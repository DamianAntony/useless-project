#Parallel Mate Project

## Overview
This is a web application that allows users to upload an image, provide personal details, and engage in interactive chat functionality. The project leverages modern web technologies for an engaging user experience, including:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Image processing**: Cloudinary
- **Generative AI**: Google Gemini API

## Features
1. **Image Upload and Transformation**:
   - Users can upload an image which is processed and transformed using the Cloudinary API.
2. **Personal Details Form**:
   - Users fill out a form with their name, age, email, and a short description.
3. **Prompt Generation**:
   - The system extracts personality traits from the user's description and generates opposite personality traits using a predefined list.
4. **Chat Interaction**:
   - Users can engage in chat where the AI responds with a personality that contrasts with the user's traits.

## Technologies Used
### Frontend
- **HTML/CSS/JavaScript**: Used for structuring and styling the web interface.
- **Google Fonts**: Custom font styling.

### Backend
- **Node.js & Express**: Server-side logic.
- **Cloudinary**: For image upload and transformation.
- **Google Generative AI**: To generate personality-based responses.
- **express-fileupload**: For handling file uploads.
- **dotenv**: For environment variable management.
- **cors**: To enable cross-origin resource sharing.

## Project Structure
```
project-root
|-- frontend
|   |-- index.html
|   |-- script.js
|   |-- style.css
|-- index.js
|-- .env
|-- package.json
|-- README.md
```

## Installation and Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/DamianAntony/useless-project
   cd useless-project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   CLOUD_NAME=get from  https://console.cloudinary.com/
    API_KEY= get from  https://console.cloudinary.com/
    API_SECRET= get from  https://console.cloudinary.com/
    G_API_KEY=  get from https://ai.google.dev/
   ```

4. **Run the server**:
   ```bash
   npm start
   ```
   The server will start on [http://localhost:3000](http://localhost:3000).

## Usage
1. Open the application in your browser at [http://localhost:3000](http://localhost:3000).
2. **Fill out the form**:
   - Enter your name, age, email, and a brief description.
3. **Upload an Image**:
   - Click on the "Upload Image" button after filling out the personal details form.
4. **Submit your details**:
   - Prompts are generated based on your description.
5. **Interact via Chat**:
   - Send a message and receive AI responses embodying opposite traits.

## API Endpoints
### `/prompt` (POST)
- **Description**: Generates opposite personality traits based on the user's input.
- **Body**:
  ```json
  {
    "prompt": "string"
  }
  ```
- **Response**:
  ```json
  {
    "longNegativePrompt": "string",
    "negativePrompt": "string",
    "realPrompt": "string"
  }
  ```

### `/upload` (POST)
- **Description**: Handles image upload and transformation.
- **Body**: Multipart form data with image file.
- **Response**:
  ```json
  {
    "transformedUrl": "string"
  }
  ```

### `/api/chat` (POST)
- **Description**: Processes chat messages and returns AI-generated responses.
- **Body**:
  ```json
  {
    "message": "string",
    "identity": "string"
  }
  ```
- **Response**:
  ```json
  {
    "response": "string"
  }
  ```



## Acknowledgements
- **Cloudinary** for image processing.
- **Google Generative AI** for chat responses.





