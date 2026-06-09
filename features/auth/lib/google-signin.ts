type GoogleSigninModule = typeof import('@react-native-google-signin/google-signin');

let configurePromise: Promise<GoogleSigninModule['GoogleSignin']> | null = null;

export async function getGoogleSignin() {
  if (!configurePromise) {
    configurePromise = (async () => {
      const { GoogleSignin } = await import('@react-native-google-signin/google-signin');

      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        scopes: ['profile', 'email'],
      });

      return GoogleSignin;
    })();
  }

  return configurePromise;
}

export async function getGoogleSigninHelpers() {
  return import('@react-native-google-signin/google-signin');
}
