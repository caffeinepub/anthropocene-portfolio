const SESSION_KEY = "anthropocene_admin_session";
const ADMIN_PASSWORD = "anthropocene2024";

export function useAdminAuth() {
  const isAuthenticated = sessionStorage.getItem(SESSION_KEY) === "true";

  const login = async (password: string): Promise<boolean> => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
  };

  return { isAuthenticated, login, logout };
}
