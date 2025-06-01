import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import ChatRoom from './pages/ChatRoom';
import StealthMode from './components/StealthMode';
import FirebaseLogin from './pages/FirebaseLogin';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Firebase User context
const UserContext = createContext<User | null>(null);
export const useFirebaseUser = () => useContext(UserContext);

// Username context
const UsernameContext = createContext<{ username: string | null, setUsername: (u: string) => void, logout: () => void }>({ username: null, setUsername: () => {}, logout: () => {} });
export const useUsername = () => useContext(UsernameContext);

const UsernameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useFirebaseUser();
  const [username, setUsernameState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUsernameState(null);
      setLoading(false);
      return;
    }
    const fetchUsername = async () => {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUsernameState(userDoc.data().username || null);
      } else {
        setUsernameState(null);
      }
      setLoading(false);
    };
    fetchUsername();
  }, [user]);

  const setUsername = async (newUsername: string) => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), { username: newUsername });
    setUsernameState(newUsername);
  };

  const logout = async () => {
    await signOut(auth);
    setUsernameState(null);
  };

  if (loading) return null;
  return (
    <UsernameContext.Provider value={{ username, setUsername, logout }}>
      {children}
    </UsernameContext.Provider>
  );
};

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  if (user === undefined) return null; // loading
  if (!user) return <Navigate to="/firebase-login" state={{ from: location }} replace />;
  return <UserContext.Provider value={user}><UsernameProvider>{children}</UsernameProvider></UserContext.Provider>;
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-stealth-dark text-white">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/firebase-login" element={<FirebaseLogin />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/room/:roomId" element={<ChatRoom />} />
                    <Route path="/stealth" element={<StealthMode />} />
                  </Routes>
                </RequireAuth>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
};

export default App; 