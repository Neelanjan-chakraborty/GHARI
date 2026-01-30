import {
    signInWithCredential,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Complete auth session for web browser
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs
// You need to create an OAuth 2.0 Client ID for "Web application" in Google Cloud Console
// and add https://auth.expo.io/@your-username/your-app-slug as authorized redirect URI
export const GOOGLE_CONFIG = {
    // For Expo Go development, use the web client ID
    expoClientId: '399403302252-ngcrsegtatn47oicbc2ri8ji4i0p05tl.apps.googleusercontent.com',
    // For standalone Android app (after building)
    androidClientId: '399403302252-ngcrsegtatn47oicbc2ri8ji4i0p05tl.apps.googleusercontent.com',
    // Web client ID (same as expoClientId for Firebase)
    webClientId: '399403302252-ngcrsegtatn47oicbc2ri8ji4i0p05tl.apps.googleusercontent.com',
};

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    avatar: string;
    settings: {
        theme: 'light' | 'dark';
        pomodoro: { focus: number; break: number };
    };
    createdAt?: any;
    hasCompletedOnboarding?: boolean;
}

// Sign in with Google using ID token (called from component with expo-auth-session)
export const signInWithGoogleCredential = async (idToken: string): Promise<User> => {
    try {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);
        
        // Create/update user profile in Firestore
        await createOrUpdateUserProfile(result.user);
        
        return result.user;
    } catch (error: any) {
        console.error('Google Sign-In Error:', error);
        throw error;
    }
};

// Sign in with Email/Password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return result.user;
    } catch (error: any) {
        console.error('Email Sign-In Error:', error);
        throw error;
    }
};

// Sign up with Email/Password
export const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
): Promise<User> => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update display name
        await updateProfile(result.user, { displayName: name });
        
        // Create user profile in Firestore
        await createOrUpdateUserProfile(result.user, name);
        
        return result.user;
    } catch (error: any) {
        console.error('Email Sign-Up Error:', error);
        throw error;
    }
};

// Sign out
export const signOut = async (): Promise<void> => {
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error('Sign Out Error:', error);
        throw error;
    }
};

// Create or update user profile in Firestore
export const createOrUpdateUserProfile = async (
    user: User,
    displayName?: string
): Promise<void> => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
        // Create new user profile
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            name: displayName || user.displayName || 'User',
            avatar: user.photoURL || '',
            settings: {
                theme: 'light',
                pomodoro: { focus: 25, break: 5 },
            },
            createdAt: serverTimestamp(),
            hasCompletedOnboarding: false,
        };
        
        await setDoc(userRef, userProfile);
    } else {
        // Update existing profile with latest info
        await setDoc(userRef, {
            email: user.email,
            name: displayName || user.displayName || userSnap.data().name,
            avatar: user.photoURL || userSnap.data().avatar,
        }, { merge: true });
    }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        return userSnap.data() as UserProfile;
    }
    
    return null;
};

// Update onboarding status
export const completeOnboarding = async (uid: string): Promise<void> => {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { hasCompletedOnboarding: true }, { merge: true });
};

// Listen to auth state changes
export const subscribeToAuthState = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};

// Export Google hook for use in components
export { Google };
