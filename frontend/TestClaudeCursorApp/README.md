# TestClaudeCursorApp

A React Native application with Multi-Channel Publishing (MCP) setup.

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. For iOS:
   ```bash
   cd ios && pod install && cd ..
   npx react-native run-ios
   ```

3. For Android:
   ```bash
   npx react-native run-android
   ```

## Multi-Channel Publishing (MCP)

This project uses GitHub Actions for Multi-Channel Publishing. The workflow is defined in `.github/workflows/mcp.yml`.

### Workflow Stages

1. **Build and Test**
   - Runs on every push and pull request
   - Installs dependencies
   - Runs tests
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

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
