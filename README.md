# Run and deploy your AI Studio app

This repository contains everything you need to run the DiviCuenta app locally and prepare the Android project.

## Run Locally

**Prerequisites:** Node.js and the Capacitor CLI.

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env` and set `API_KEY` to your Gemini API key.
3. Run the app in development mode:
   `npm run dev`

## Prepare Android project

After building the web assets you can generate the native Android project.

1. Build the web assets:
   `npm run build`
2. Add the Android platform (run once):
   `npx cap add android`
3. Sync the assets whenever they change:
   `npm run android:sync`
4. Open the project in Android Studio:
   `npx cap open android`

From Android Studio you can build an APK normally.

## Android permissions

The app requires these permissions:

- `CAMERA` to capture bill images.
- `READ_MEDIA_IMAGES` (or `READ_EXTERNAL_STORAGE` on older Android versions) to select photos from the gallery.
- `INTERNET` to send requests to the API.

After updating Capacitor plugins or modifying the Android manifest, run:

`npx cap sync android`

to apply permission changes to the native project.
