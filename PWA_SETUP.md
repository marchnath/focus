# PWA (Progressive Web App) Setup for Nottifly

## What's been implemented:

1. **Enhanced Manifest** (`public/manifest.json`)

   - Proper PWA configuration
   - Icon definitions for different sizes
   - Standalone display mode
   - Theme colors and branding

2. **Service Worker** (`public/sw.js`)

   - Caching strategy for offline functionality
   - Background sync capabilities
   - Improved performance

3. **Install Prompt** (`components/PWAInstall.js`)

   - Custom install button/banner
   - Handles the browser's install prompt
   - Only shows when the app is installable

4. **PWA Detection** (`lib/hooks/usePWA.js`)
   - Detects if running in standalone mode
   - Determines if app is installable
   - Useful for conditional UI

## How to test PWA installation:

### On Mobile (Chrome/Safari):

1. Open your app in Chrome or Safari
2. Look for "Add to Home Screen" in the browser menu
3. Tap it and confirm installation
4. The app icon will appear on your home screen
5. When you tap the icon, it should open in standalone mode (no browser UI)

### On Desktop (Chrome/Edge):

1. Open your app in Chrome or Edge
2. Look for an install icon in the address bar
3. Click it to install the app
4. The app will open in its own window

### On Android:

1. Chrome will show an install banner automatically
2. You can also go to Chrome menu → "Add to Home screen"
3. The app will behave like a native app

### On iOS (Safari):

1. Open Safari and navigate to your app
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm the installation

## What makes it feel like a native app:

- **Standalone display**: No browser UI (address bar, etc.)
- **Custom splash screen**: Uses your theme colors and icon
- **Offline capability**: Works without internet (basic functionality)
- **App-like behavior**: Feels like a native mobile app
- **Install prompts**: Browser suggests installation
- **Home screen icon**: Proper app icon and name

## Next steps to improve PWA experience:

1. **Generate proper icon sizes**:

   ```bash
   # Install ImageMagick first
   brew install imagemagick

   # Run the icon generation script
   ./generate-icons.sh
   ```

2. **Update manifest.json** to use the new icon sizes:

   ```json
   "icons": [
     {
       "src": "/icon-192.png",
       "sizes": "192x192",
       "type": "image/png"
     },
     {
       "src": "/icon-512.png",
       "sizes": "512x512",
       "type": "image/png"
     }
   ]
   ```

3. **Add push notifications** (optional)
4. **Implement background sync** for offline data
5. **Add update notifications** when new versions are available

## Troubleshooting:

If the PWA doesn't feel different from the web app:

- Make sure you're opening it from the home screen icon, not the browser
- Check that the manifest.json is valid (no syntax errors)
- Ensure the service worker is registering properly (check browser dev tools)
- Verify the display mode is set to "standalone" in manifest.json

The difference should be:

- **Browser**: Shows address bar, browser UI, tabs
- **PWA**: Full-screen app experience, no browser UI, app-like navigation
