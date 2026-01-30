# GHARI

Now you need to configure Google Cloud Console to allow the Expo redirect URI. Here's what you need to do:

Steps to fix Google OAuth:
Go to Google Cloud Console

Edit your OAuth 2.0 Client ID (the Web application one with ID 399403302252-ngcrsegtatn47oicbc2ri8ji4i0p05tl)

Add these Authorized redirect URIs:


https://auth.expo.io/@your-expo-username/temp_ghari
Replace your-expo-username with your actual Expo username. You can find it by running:


npx expo whoami
Also add the Authorized JavaScript origins (if not already there):


https://auth.expo.io
Save the changes and wait a few minutes for them to propagate.

Would you like me to help you check your Expo username, or do you know it already?