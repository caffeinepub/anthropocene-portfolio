import {
  AuthClient,
  type AuthClientCreateOptions,
  type AuthClientLoginOptions,
} from "@dfinity/auth-client";
import type { Identity } from "@icp-sdk/core/agent";
import {
  type PropsWithChildren,
  type ReactNode,
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadConfig } from "../config";

export type Status =
  | "initializing"
  | "idle"
  | "logging-in"
  | "success"
  | "loginError";

export type InternetIdentityContext = {
  /** The identity is available after successfully loading the identity from local storage
   * or completing the login process. */
  identity?: Identity;

  /** Connect to Internet Identity to login the user. */
  login: () => void;

  /** Clears the identity from the state and local storage. Effectively "logs the user out". */
  clear: () => void;

  /** The loginStatus of the login process. */
  loginStatus: Status;

  /** `loginStatus === "initializing"` */
  isInitializing: boolean;

  /** `loginStatus === "idle"` */
  isLoginIdle: boolean;

  /** `loginStatus === "logging-in"` */
  isLoggingIn: boolean;

  /** `loginStatus === "success"` */
  isLoginSuccess: boolean;

  /** `loginStatus === "loginError"` */
  isLoginError: boolean;

  loginError?: Error;
};

const ONE_HOUR_IN_NANOSECONDS = BigInt(3_600_000_000_000);
const DEFAULT_IDENTITY_PROVIDER = process.env.II_URL;

type ProviderValue = InternetIdentityContext;
const InternetIdentityReactContext = createContext<ProviderValue | undefined>(
  undefined,
);

async function createAuthClient(
  createOptions?: AuthClientCreateOptions,
): Promise<AuthClient> {
  const config = await loadConfig();
  const options: AuthClientCreateOptions = {
    idleOptions: {
      disableDefaultIdleCallback: true,
      disableIdle: true,
      ...createOptions?.idleOptions,
    },
    loginOptions: {
      derivationOrigin: config.ii_derivation_origin,
    },
    ...createOptions,
  };
  return AuthClient.create(options);
}

function assertProviderPresent(
  context: ProviderValue | undefined,
): asserts context is ProviderValue {
  if (!context) {
    throw new Error(
      "InternetIdentityProvider is not present. Wrap your component tree with it.",
    );
  }
}

export const useInternetIdentity = (): InternetIdentityContext => {
  const context = useContext(InternetIdentityReactContext);
  assertProviderPresent(context);
  return context;
};

export function InternetIdentityProvider({
  children,
  createOptions,
}: PropsWithChildren<{
  children: ReactNode;
  createOptions?: AuthClientCreateOptions;
}>) {
  // Use a ref for authClient to avoid re-initialization loops
  const authClientRef = useRef<AuthClient | null>(null);
  const initializedRef = useRef(false);
  const [identity, setIdentity] = useState<Identity | undefined>(undefined);
  const [loginStatus, setStatus] = useState<Status>("initializing");
  const [loginError, setError] = useState<Error | undefined>(undefined);

  const setErrorMessage = useCallback((message: string) => {
    setStatus("loginError");
    setError(new Error(message));
  }, []);

  const handleLoginError = useCallback(
    (maybeError?: string) => {
      setErrorMessage(maybeError ?? "Login failed");
    },
    [setErrorMessage],
  );

  const login = useCallback(() => {
    const client = authClientRef.current;
    if (!client) {
      setErrorMessage(
        "AuthClient is not initialized yet, make sure to call `login` on user interaction.",
      );
      return;
    }

    // FIXED: Removed the "already authenticated" guard that was silently blocking
    // the II popup. login() ALWAYS opens the II popup so the user can get a fresh
    // 30-day delegation at any time — critical after backend redeployments.
    const options: AuthClientLoginOptions = {
      identityProvider: DEFAULT_IDENTITY_PROVIDER,
      onSuccess: () => {
        const latestIdentity = authClientRef.current?.getIdentity();
        if (latestIdentity) {
          setIdentity(latestIdentity);
          setStatus("success");
        } else {
          setErrorMessage("Identity not found after successful login");
        }
      },
      onError: handleLoginError,
      maxTimeToLive: ONE_HOUR_IN_NANOSECONDS * BigInt(24 * 30), // 30 days
    };

    setStatus("logging-in");
    void client.login(options);
  }, [handleLoginError, setErrorMessage]);

  const clear = useCallback(() => {
    const client = authClientRef.current;
    if (!client) {
      setIdentity(undefined);
      setStatus("idle");
      setError(undefined);
      return;
    }

    void client
      .logout()
      .then(() => {
        // Keep authClientRef.current alive — do NOT null it out.
        // Nulling it causes a re-init loop in the useEffect.
        setIdentity(undefined);
        setStatus("idle");
        setError(undefined);
      })
      .catch((unknownError: unknown) => {
        setIdentity(undefined);
        setStatus("idle");
        setError(
          unknownError instanceof Error
            ? unknownError
            : new Error("Logout failed"),
        );
      });
  }, []);

  useEffect(() => {
    // Guard: only initialize once even if createOptions reference changes
    if (initializedRef.current) return;
    initializedRef.current = true;

    let cancelled = false;
    void (async () => {
      try {
        setStatus("initializing");
        const client = await createAuthClient(createOptions);
        if (cancelled) return;
        authClientRef.current = client;
        const isAuthenticated = await client.isAuthenticated();
        if (cancelled) return;
        if (isAuthenticated) {
          setIdentity(client.getIdentity());
        }
      } catch (unknownError) {
        if (!cancelled) {
          setStatus("loginError");
          setError(
            unknownError instanceof Error
              ? unknownError
              : new Error("Initialization failed"),
          );
        }
      } finally {
        if (!cancelled) setStatus("idle");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [createOptions]);

  const value = useMemo<ProviderValue>(
    () => ({
      identity,
      login,
      clear,
      loginStatus,
      isInitializing: loginStatus === "initializing",
      isLoginIdle: loginStatus === "idle",
      isLoggingIn: loginStatus === "logging-in",
      isLoginSuccess: loginStatus === "success",
      isLoginError: loginStatus === "loginError",
      loginError,
    }),
    [identity, login, clear, loginStatus, loginError],
  );

  return createElement(InternetIdentityReactContext.Provider, {
    value,
    children,
  });
}
