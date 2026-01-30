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
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
GoogleSignin.configure({
    webClientId: '399403302252-YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your web client ID from Firebase Console
    offlineAccess: true,
});

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

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        
        const idToken = userInfo.data?.idToken;
        if (!idToken) {
            throw new Error('No ID token present');
        }
        
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
        // Sign out from Google if signed in
        try {
            await GoogleSignin.signOut();
        } catch (googleError) {
            // Google sign out may fail if user wasn't signed in with Google
            console.log('Google sign out skipped:', googleError);
        }
        
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
