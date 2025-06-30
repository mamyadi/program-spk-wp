import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: { userId: number; username: string } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ userId: number; username: string } | null>(
    null
  );

  // Check for token in localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);

      // Set the authentication header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      console.log(
        "Auth token loaded from localStorage and set in axios headers"
      );
    } else {
      console.log("No stored authentication found in localStorage");
      // Clear the header if there's no token
      delete axios.defaults.headers.common["Authorization"];
    }

    // Add an axios interceptor to log requests (helpful for debugging)
    axios.interceptors.request.use(
      (config) => {
        console.log("Making request to:", config.url);
        if (!config.headers.Authorization && storedToken) {
          console.log("Adding Authorization header to request");
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
        return config;
      },
      (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
      }
    );
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    try {
      console.log("AuthContext: Sending login request to API");
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AuthContext: Login API response received:", {
        status: response.status,
        data: {
          ...response.data,
          token: response.data.token ? "[TOKEN]" : null,
        },
      });

      const { token, userId, username: responseUsername } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({ userId, username: responseUsername })
      );

      setToken(token);
      setUser({ userId, username: responseUsername });
      setIsAuthenticated(true);

      // Set the authentication header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      console.log("AuthContext: Authentication successful, state updated");
      return true;
    } catch (error: any) {
      console.error("AuthContext: Login error:", error);
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Remove the authentication header
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    isAuthenticated,
    token,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
