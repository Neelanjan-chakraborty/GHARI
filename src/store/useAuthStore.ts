import { create } from 'zustand';
import { User } from 'firebase/auth';
import { UserProfile, getUserProfile, completeOnboarding as completeOnboardingService } from '../services/auth';

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    initialized: boolean;
    hasCompletedOnboarding: boolean;
    
    // Actions
    setUser: (user: User | null) => void;
    setProfile: (profile: UserProfile | null) => void;
    setLoading: (loading: boolean) => void;
    setInitialized: (initialized: boolean) => void;
    fetchUserProfile: (uid: string) => Promise<void>;
    completeOnboarding: () => Promise<void>;
    reset: () => void;
}

const initialState = {
    user: null,
    profile: null,
    loading: true,
    initialized: false,
    hasCompletedOnboarding: false,
};

export const useAuthStore = create<AuthState>((set, get) => ({
    ...initialState,
    
    setUser: (user) => set({ user }),
    
    setProfile: (profile) => set({ 
        profile,
        hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
    }),
    
    setLoading: (loading) => set({ loading }),
    
    setInitialized: (initialized) => set({ initialized }),
    
    fetchUserProfile: async (uid: string) => {
        try {
            const profile = await getUserProfile(uid);
            set({ 
                profile,
                hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    },
    
    completeOnboarding: async () => {
        const { user } = get();
        if (user) {
            try {
                await completeOnboardingService(user.uid);
                set({ hasCompletedOnboarding: true });
                
                // Update profile
                const profile = get().profile;
                if (profile) {
                    set({ 
                        profile: { ...profile, hasCompletedOnboarding: true } 
                    });
                }
            } catch (error) {
                console.error('Error completing onboarding:', error);
            }
        }
    },
    
    reset: () => set(initialState),
}));
