# AURA — installable Android PWA

AURA is a personal AI-companion web app designed for Android Chrome. It includes:
- Local chat history, editable memory and personality settings
- Text sample import (`.txt` / `.json`) to guide conversational style
- Optional Gemini API connection for real generative replies
- Browser text-to-speech and speech recognition where supported
- PWA manifest and service worker for installation/offline app shell

## Important about “free”
The app files are free. In demo mode, chat replies are local scripted examples, not a real AI model. For generative AI replies, add your own Gemini API key in **Personalize → AI connection**. Google AI Studio may provide a free quota depending on current availability, region, model and usage limits; it is not guaranteed unlimited. The key is stored in browser local storage and sent directly from your device to Google. Treat it as a personal prototype key; don't distribute a public copy with your key embedded.

## Install on Android
A PWA must be served from HTTPS (or localhost) to install and use its service worker. Easiest free path:
1. Create a GitHub account if needed.
2. Create a new public repository named `aura-pwa`.
3. Upload all files and folders from this ZIP (keep the folder structure; `index.html` must be at the repository root).
4. In repository **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish. Open the published HTTPS URL in Chrome on Android.
6. Tap Chrome's ⋮ menu → **Install app** (or **Add to Home screen**) → Install.

You can also use any HTTPS static host. Do not open `index.html` directly from the Files app: install/offline features require HTTPS.

## Use
- Start in demo mode, or add a Gemini API key from Google AI Studio in Personalize.
- Add your personal preferences in Memories.
- Upload an exported text chat sample in Memories. It is used as style inspiration in AI requests. Avoid uploading private details or chats without permission.
- Chat content, memory, sample and key are stored in this browser on this device. Use **Export my data** before clearing browser data if you want a backup.

## Limitations
- This is a client-only personal PWA, not a Play Store APK.
- Voice input depends on browser speech-recognition support and may require internet.
- Text-to-speech uses voices available on the phone/browser; a specific female voice is not guaranteed.
- Image/screenshot chat samples are not OCR-processed in this starter build; use text exports.
- No push notifications or background proactive messaging in this starter build.
