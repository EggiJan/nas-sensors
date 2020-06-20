import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import createAuth0Client, { Auth0Client, RedirectLoginResult, Auth0ClientOptions } from '@auth0/auth0-spa-js';

interface ContextValue {
  isAuthenticated: boolean;
  user: any;
  loginWithRedirect: () => Promise<void>;
  handleRedirectCallback: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  getIdTokenClaims: () => Promise<string | undefined>
}

interface AuthContextProviderProps {
  onRedirectCallback?: (appState: RedirectLoginResult['appState']) => void;
}

const AuthContext = React.createContext<ContextValue>({
  isAuthenticated: false,
  user: null,
  loginWithRedirect: () => Promise.resolve(),
  handleRedirectCallback: () => Promise.resolve(),
  logout: () => undefined,
  loading: false,
  getIdTokenClaims: () => Promise.resolve(''),
});

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);


export const useAuth0 = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ 
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  children,
}) => {
  const [authClient, setAuthClient] = useState<Auth0Client|null>(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const initAuth0 = async () => {
      const initOptions: Auth0ClientOptions = {
        domain: process.env.AUTH0_DOMAIN || '',
        client_id: process.env.AUTH0_CLIENT_ID || '',
        cacheLocation: 'localstorage',
      };

      let auth0Client;
      try {
        auth0Client = await createAuth0Client(initOptions);
      } catch (error) {
        console.error(error);
        return;
      }

      setAuthClient(auth0Client);

      if (window.location.search.includes("code=") && window.location.search.includes("state=")) {
        try {
          const redirectResult = await auth0Client.handleRedirectCallback();
          onRedirectCallback(redirectResult.appState);
        } catch (error) {
          onRedirectCallback(null);
        }
      }

      const isAuthenticated = await auth0Client.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0Client.getUser();
        setUser(user);
      }

      setLoading(false);
    };

    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithRedirect = async () => {
    if (!authClient) {
      return; 
    }

    try {
      console.log('redirect uri', process.env.AUTH0_REDIRECT_URI);
      await authClient.loginWithRedirect({
        redirect_uri: process.env.AUTH0_REDIRECT_URI,
      });
    } catch (error) {
      console.error(error);
    }

    const user = await authClient.getUser();
    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    if (!authClient) {
      return;
    }

    setLoading(true);

    await authClient.handleRedirectCallback();
    
    const user = await authClient.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  const getIdTokenClaims = async () => {
    if (!authClient) {
      return;
    }

    try {
      const claims = await authClient.getIdTokenClaims();

      if (!claims) {
        return;
      }

      return claims.__raw;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  const logout = () => {
    if(!authClient) {
      return;
    }

    return authClient.logout({
      returnTo: process.env.AUTH0_REDIRECT_URI
    });
  }

  return (
    <AuthContext.Provider value={{
        isAuthenticated,
        user,
        loading,
        loginWithRedirect,
        handleRedirectCallback,
        getIdTokenClaims,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  )
};