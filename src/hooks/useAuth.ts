"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Global state to cache auth across page navigations
let globalAuthState: AuthState | null = null;
let authCheckPromise: Promise<void> | null = null;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Use cached global state if available
    return globalAuthState || {
      user: null,
      loading: true,
      error: null,
    };
  });

  // Check authentication status with caching
  const checkAuth = useCallback(async (force = false) => {
    // If we already have a valid user and not forcing refresh, skip API call
    if (!force && globalAuthState?.user && !globalAuthState.loading) {
      setAuthState(globalAuthState);
      return;
    }

    // If there's already an ongoing auth check, wait for it
    if (authCheckPromise && !force) {
      await authCheckPromise;
      if (globalAuthState) {
        setAuthState(globalAuthState);
      }
      return;
    }

    // Create new auth check promise
    authCheckPromise = (async () => {
      try {
        const newState: AuthState = {
          user: globalAuthState?.user || null,
          loading: true,
          error: null,
        };
        
        globalAuthState = newState;
        setAuthState(newState);
        
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          const successState: AuthState = {
            user: data.user,
            loading: false,
            error: null,
          };
          globalAuthState = successState;
          setAuthState(successState);
        } else {
          const errorState: AuthState = {
            user: null,
            loading: false,
            error: null,
          };
          globalAuthState = errorState;
          setAuthState(errorState);
        }
      } catch (error) {
        const errorState: AuthState = {
          user: null,
          loading: false,
          error: "Failed to check authentication",
        };
        globalAuthState = errorState;
        setAuthState(errorState);
      } finally {
        authCheckPromise = null;
      }
    })();

    await authCheckPromise;
  }, []);

  // Login function
  const login = useCallback(async (username: string, password: string) => {
    try {
      const loadingState: AuthState = {
        user: null,
        loading: true,
        error: null,
      };
      globalAuthState = loadingState;
      setAuthState(loadingState);
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const successState: AuthState = {
          user: data.user,
          loading: false,
          error: null,
        };
        globalAuthState = successState;
        setAuthState(successState);
        return { success: true };
      } else {
        const errorState: AuthState = {
          user: null,
          loading: false,
          error: data.message || "Login failed",
        };
        globalAuthState = errorState;
        setAuthState(errorState);
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      const errorMessage = "Login failed";
      const errorState: AuthState = {
        user: null,
        loading: false,
        error: errorMessage,
      };
      globalAuthState = errorState;
      setAuthState(errorState);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      const loadingState: AuthState = {
        user: null,
        loading: true,
        error: null,
      };
      globalAuthState = loadingState;
      setAuthState(loadingState);
      
      await fetch("/api/auth/logout", { method: "POST" });
      
      const logoutState: AuthState = {
        user: null,
        loading: false,
        error: null,
      };
      globalAuthState = logoutState;
      setAuthState(logoutState);
      
      // Redirect to login page
      window.location.href = "/admin/login";
    } catch (error) {
      const errorState: AuthState = {
        user: null,
        loading: false,
        error: "Logout failed",
      };
      globalAuthState = errorState;
      setAuthState(errorState);
    }
  }, []);

  // Check auth on mount only if we don't have cached auth state
  useEffect(() => {
    // Only check auth if we don't have a cached user or if we're still loading
    if (!globalAuthState?.user && !authCheckPromise) {
      checkAuth();
    } else if (globalAuthState && globalAuthState !== authState) {
      // Sync with global state if they differ
      setAuthState(globalAuthState);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run on mount

  return {
    user: authState.user,
    loading: authState.loading,
    isLoading: authState.loading,
    error: authState.error,
    login,
    logout,
    checkAuth,
    isAuthenticated: authState.user !== null,
  };
}