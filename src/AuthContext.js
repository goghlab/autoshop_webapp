import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth'; // Import auth object from Firebase authentication module

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(); // Get the auth object

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const signUp = async (email, password) => {
    try {
      const newUserCredential = await auth.createUserWithEmailAndPassword(email, password);
      setUser(newUserCredential.user);
      localStorage.setItem('uid', newUserCredential.user.uid);
    } catch (error) {
      console.error('Error signing up:', error.message);
      throw error; // Rethrow the error to handle it in the component
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      setUser(userCredential.user);
      localStorage.setItem('uid', userCredential.user.uid);
    } catch (error) {
      console.error('Error signing in:', error.message);
      throw error; // Rethrow the error to handle it in the component
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      localStorage.removeItem('uid');
    } catch (error) {
      console.error('Error signing out:', error.message);
      throw error; // Rethrow the error to handle it in the component
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
