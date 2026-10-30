import { useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as fbSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  lastLoginAt?: string;
  bookmarkedProjects?: string[];
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setProfile(snap.data() as AppUserProfile);
          } else {
            const newProfile: AppUserProfile = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              lastLoginAt: new Date().toISOString(),
              bookmarkedProjects: [],
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err: unknown) {
          console.warn('Firestore profile sync error:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return res.user;
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      setError(err?.message || 'Failed to sign in with Google');
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await fbSignOut(auth);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError(err?.message || 'Failed to sign out');
    }
  };

  const toggleBookmark = async (projectId: string) => {
    if (!user || !profile) return;
    const currentBookmarks = profile.bookmarkedProjects || [];
    const updated = currentBookmarks.includes(projectId)
      ? currentBookmarks.filter((id) => id !== projectId)
      : [...currentBookmarks, projectId];

    const updatedProfile = { ...profile, bookmarkedProjects: updated };
    setProfile(updatedProfile);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { bookmarkedProjects: updated }, { merge: true });
    } catch (err) {
      console.warn('Bookmark sync warning:', err);
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    signInWithGoogle,
    signOut,
    toggleBookmark,
  };
}
