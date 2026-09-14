"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Clock,
  LogOut,
  Sparkles
} from "@mahalle/ui";
import { apiClient } from "@/lib/api-client";

export interface IdleTimeoutProviderProps {
  /** Inactivity duration before warning modal appears. Default: 28 minutes. */
  idleTimeoutMs?: number;
  /** Countdown duration once the warning modal appears. Default: 2 minutes (120s). Total: 30m. */
  countdownMs?: number;
  /** Endpoint to call when logging out. Defaults to "/auth/logout". */
  logoutEndpoint?: string;
  /** Target redirect URL after logout. Defaults to "/login?reason=inactivity". */
  redirectUrl?: string;
  /** LocalStorage key for cross-tab sync. */
  storageKey?: string;
  children: ReactNode;
}

interface IdleTimeoutContextValue {
  resetTimer: () => void;
  isWarningOpen: boolean;
  secondsRemaining: number;
}

const IdleTimeoutContext = createContext<IdleTimeoutContextValue>({
  resetTimer: () => {},
  isWarningOpen: false,
  secondsRemaining: 0
});

export function useIdleTimeout() {
  return useContext(IdleTimeoutContext);
}

const THROTTLE_MS = 5000;
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "click",
  "keydown",
  "touchstart",
  "scroll",
  "wheel"
];

export function IdleTimeoutProvider({
  idleTimeoutMs = 28 * 60 * 1000,
  countdownMs = 2 * 60 * 1000,
  logoutEndpoint = "/auth/logout",
  redirectUrl = "/login?reason=inactivity",
  storageKey = "mahalle_last_active",
  children
}: IdleTimeoutProviderProps) {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.ceil(countdownMs / 1000));
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const lastActiveRef = useRef<number>(Date.now());
  const lastThrottleRef = useRef<number>(Date.now());
  const isWarningOpenRef = useRef<boolean>(false);
  const isLoggingOutRef = useRef<boolean>(false);

  // Sync ref with state
  isWarningOpenRef.current = isWarningOpen;
  isLoggingOutRef.current = isLoggingOut;

  const performLogout = useCallback(
    async (reasonUrl = redirectUrl) => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;
      setIsLoggingOut(true);

      try {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(storageKey);
        }
        await apiClient.post(logoutEndpoint).catch(() => undefined);
      } finally {
        if (typeof window !== "undefined") {
          window.location.href = reasonUrl;
        }
      }
    },
    [logoutEndpoint, redirectUrl, storageKey]
  );

  const resetTimer = useCallback(
    (triggerBackendRefresh = false) => {
      const now = Date.now();
      lastActiveRef.current = now;
      lastThrottleRef.current = now;

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(storageKey, now.toString());
        } catch {
          // ignore storage quota errors
        }
      }

      setIsWarningOpen(false);
      setSecondsRemaining(Math.ceil(countdownMs / 1000));

      // If requested (e.g. clicked "Stay Logged In"), ping refresh to extend JWT session
      if (triggerBackendRefresh && logoutEndpoint === "/auth/logout") {
        void apiClient.post("/auth/refresh").catch(() => undefined);
      }
    },
    [countdownMs, logoutEndpoint, storageKey]
  );

  // User activity listeners (throttled to avoid performance overhead)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize to current time on mount.
    // If there is an existing localStorage entry, only adopt it if it is RECENT (not expired).
    const now = Date.now();
    lastActiveRef.current = now;
    lastThrottleRef.current = now;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed > now - idleTimeoutMs && parsed <= now) {
          lastActiveRef.current = parsed;
        } else {
          // Discard stale timestamp from previous sessions to prevent instant logouts
          window.localStorage.setItem(storageKey, now.toString());
        }
      } else {
        window.localStorage.setItem(storageKey, now.toString());
      }
    } catch {
      // ignore storage access errors
    }

    function handleActivity() {
      const current = Date.now();
      // If warning modal is open, user must explicitly click "Stay Logged In"
      if (isWarningOpenRef.current) return;

      if (current - lastThrottleRef.current > THROTTLE_MS) {
        lastThrottleRef.current = current;
        lastActiveRef.current = current;
        try {
          window.localStorage.setItem(storageKey, current.toString());
        } catch {
          // ignore
        }
      }
    }

    ACTIVITY_EVENTS.forEach((evt) => {
      window.addEventListener(evt, handleActivity, { passive: true });
    });

    // Cross-tab synchronization: if another tab reports activity, reset timer
    function handleStorageChange(e: StorageEvent) {
      if (e.key === storageKey && e.newValue) {
        const tabActiveTime = parseInt(e.newValue, 10);
        if (!isNaN(tabActiveTime) && tabActiveTime > lastActiveRef.current) {
          lastActiveRef.current = tabActiveTime;
          if (isWarningOpenRef.current) {
            setIsWarningOpen(false);
            setSecondsRemaining(Math.ceil(countdownMs / 1000));
          }
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      ACTIVITY_EVENTS.forEach((evt) => {
        window.removeEventListener(evt, handleActivity);
      });
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [countdownMs, idleTimeoutMs, storageKey]);

  // Proactive background session refresh: while user is active, keep JWT access token alive
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (logoutEndpoint !== "/auth/logout") return;

    // Refresh every 4 minutes if user was active recently
    const refreshInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceActive = now - lastActiveRef.current;
      if (timeSinceActive < idleTimeoutMs && !isWarningOpenRef.current) {
        void apiClient.post("/auth/refresh").catch(() => undefined);
      }
    }, 4 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [idleTimeoutMs, logoutEndpoint]);

  // Periodic ticker to check idle duration and countdown
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      if (isLoggingOutRef.current) return;

      const now = Date.now();
      const elapsed = now - lastActiveRef.current;
      const totalTimeout = idleTimeoutMs + countdownMs;

      if (elapsed >= totalTimeout) {
        // Complete timeout reached -> execute logout
        clearInterval(interval);
        void performLogout();
      } else if (elapsed >= idleTimeoutMs) {
        // Inactivity warning phase
        const remaining = Math.max(0, Math.ceil((totalTimeout - elapsed) / 1000));
        setIsWarningOpen(true);
        setSecondsRemaining(remaining);
      } else {
        // Still active
        if (isWarningOpenRef.current) {
          setIsWarningOpen(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownMs, idleTimeoutMs, performLogout]);

  const countdownSecondsTotal = Math.ceil(countdownMs / 1000);
  const progressPercent = Math.max(
    0,
    Math.min(100, (secondsRemaining / countdownSecondsTotal) * 100)
  );

  return (
    <IdleTimeoutContext.Provider value={{ resetTimer, isWarningOpen, secondsRemaining }}>
      {children}

      <Dialog open={isWarningOpen} onOpenChange={() => {}}>
        <DialogContent
          role="alertdialog"
          showClose={false}
          className="sm:max-w-md border-amber-500/20 shadow-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="h-6 w-6 animate-pulse" />
            </div>

            <DialogTitle className="text-center text-lg font-bold">
              Session Expiring Soon
            </DialogTitle>

            <DialogDescription className="text-center text-sm text-muted-foreground">
              You have been inactive for a while. For your security, your session will automatically
              expire in:
            </DialogDescription>

            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <span className="font-mono text-3xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                {secondsRemaining}s
              </span>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isLoggingOut}
              onClick={() => void performLogout()}
              className="w-full sm:w-auto text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              Log out now
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={isLoggingOut}
              autoFocus
              onClick={() => resetTimer(true)}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <Sparkles className="h-4 w-4 mr-1.5" />
              Stay Logged In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </IdleTimeoutContext.Provider>
  );
}
