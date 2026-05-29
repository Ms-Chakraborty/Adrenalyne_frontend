import { createContext, useContext, useEffect, useMemo, useState } from "react";

type DevUserProfile = {
  preferred_username: string;
  email?: string;
  roles: string[];
};

type DevUser = {
  access_token: string;
  profile: DevUserProfile;
};

type DevAuthContextValue = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: DevUser | null;
  signinRedirect: () => void;
  signoutRedirect: () => void;
  signIn: (input: { username: string; roles: string[] }) => void;
};

const STORAGE_KEY = "adrenalyne-dev-auth";

const DevAuthContext = createContext<DevAuthContextValue | undefined>(undefined);

const readStoredUser = (): DevUser | null => {
  const storedValue = localStorage.getItem(STORAGE_KEY);
  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue) as DevUser;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<DevUser | null>(null);

  useEffect(() => {
    setUser(readStoredUser());
    setIsLoading(false);
  }, []);

  const signIn = (input: { username: string; roles: string[] }) => {
    const nextUser: DevUser = {
      access_token: `dev-${input.username}`,
      profile: {
        preferred_username: input.username,
        email: `${input.username}@local.dev`,
        roles: input.roles,
      },
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const signoutRedirect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    window.location.href = "/";
  };

  const signinRedirect = () => {
    window.location.href = "/login";
  };

  const value = useMemo<DevAuthContextValue>(
    () => ({
      isLoading,
      isAuthenticated: Boolean(user),
      user,
      signinRedirect,
      signoutRedirect,
      signIn,
    }),
    [isLoading, user],
  );

  return <DevAuthContext.Provider value={value}>{children}</DevAuthContext.Provider>;
};

export const useAuth = (): DevAuthContextValue => {
  const context = useContext(DevAuthContext);

  if (context) {
    return context;
  }

  const fallbackUser = readStoredUser();

  return {
    isLoading: false,
    isAuthenticated: Boolean(fallbackUser),
    user: fallbackUser,
    signinRedirect: () => {
      window.location.href = "/login";
    },
    signoutRedirect: () => {
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "/";
    },
    signIn: (input: { username: string; roles: string[] }) => {
      const nextUser: DevUser = {
        access_token: `dev-${input.username}`,
        profile: {
          preferred_username: input.username,
          email: `${input.username}@local.dev`,
          roles: input.roles,
        },
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      window.location.reload();
    },
  };

  return context;
};