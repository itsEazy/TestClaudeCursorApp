# TestClaudeCursor

A full-stack application with React Native frontend and Spring Boot backend.

## Project Structure

```
TestClaudeCursor/
├── frontend/          # React Native frontend
│   └── TestClaudeCursorApp/
└── backend/           # Spring Boot backend
    ├── src/
    └── pom.xml
```

## Features

- Beautiful React Native UI with a centered button
- Java Spring Boot REST API endpoint
- Cross-platform mobile support (iOS/Android)
- Pretty CSS styling with shadows and colors
- Loading states and error handling

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or if you have Maven installed:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080` and provide a `/hello` endpoint that returns:
```json
{
  "message": "Hello World"
}
```

## Frontend Setup

1. Navigate to the React Native app directory:
   ```bash
   cd frontend/TestClaudeCursorApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. For iOS:
   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

4. For Android:
   ```bash
   npx react-native run-android
   ```

## Multi-Channel Publishing (MCP)

This project uses GitHub Actions for Multi-Channel Publishing. The workflow is defined in `.github/workflows/mcp.yml`.

### Workflow Stages

1. **Build and Test**
   - Runs on every push and pull request
   - Builds and tests both frontend and backend
   - Builds Android and iOS apps

2. **Deploy**
   - Runs only on the main branch
   - Deploys to staging environment
   - If successful, deploys to production

### Environment Variables

The following environment variables need to be set in your GitHub repository secrets:

- `STAGING_API_URL`: URL for the staging backend
- `PRODUCTION_API_URL`: URL for the production backend
- `ANDROID_KEYSTORE_BASE64`: Base64 encoded Android keystore
- `ANDROID_KEYSTORE_PASSWORD`: Android keystore password
- `ANDROID_KEY_ALIAS`: Android key alias
- `ANDROID_KEY_PASSWORD`: Android key password

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request
4. Ensure all tests pass
5. Get code review approval
6. Merge to main branch

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Usage

1. Start the backend server first (port 8080)
2. Launch the React Native app on your device/simulator
3. Tap the "Get Message" button
4. The app will fetch "Hello World" from the backend and display it

## Styling Features

- Light blue background (`#f0f8ff`)
- Blue button with rounded corners and shadow
- Green message text with white container
- Loading state with disabled button
- Responsive design with proper spacing