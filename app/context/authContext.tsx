import { firebaseAuth } from "app/lib/firebase";
import { onAuthStateChanged, signInAnonymously, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type AuthContextValue = { authReady: boolean; user: User | null };

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (nextUser) => {
      if (nextUser) {
        setUser(nextUser);
        setAuthReady(true);
        return;
      }

      try {
        const credentials = await signInAnonymously(firebaseAuth);
        setUser(credentials.user);
      } catch (error) {
        console.error("Anonymous auth failed", error);
        setUser(null);
      } finally {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  const value = useMemo(() => ({ authReady, user }), [authReady, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
