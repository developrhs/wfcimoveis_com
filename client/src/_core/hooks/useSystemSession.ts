import { FormEvent, useCallback, useEffect, useState } from "react";
import { SystemApiError, SystemSummary, SystemUser, systemApi } from "../systemSession";

export function useSystemSession() {
  const [user, setUser] = useState<SystemUser | null>(null);
  const [summary, setSummary] = useState<SystemSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [sessionChecking, setSessionChecking] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const clearSession = useCallback((message?: string) => {
    setUser(null);
    setSummary(null);
    if (message) setNotice(message);
  }, []);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const result = await systemApi<{ data: SystemSummary }>("summary");
      setSummary(result.data);
    } catch (summaryError) {
      setSummary(null);
      if (summaryError instanceof SystemApiError && summaryError.status === 401) {
        clearSession("Sua sessão expirou. Entre novamente para acessar os dados.");
      }
    } finally {
      setSummaryLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    systemApi<{ user: SystemUser }>("auth/me")
      .then(async ({ user: currentUser }) => {
        setUser(currentUser);
        await loadSummary();
      })
      .catch(() => undefined)
      .finally(() => setSessionChecking(false));
  }, [loadSummary]);

  async function login(identity: string, password: string, event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError("");
    setNotice("");
    setLoginLoading(true);
    try {
      const result = await systemApi<{ user: SystemUser }>("auth/login", {
        method: "POST",
        body: JSON.stringify({ identity: identity.trim(), password }),
      });
      setUser(result.user);
      await loadSummary();
      setNotice(`Sessão iniciada para ${result.user.name || result.user.username || "usuário"}.`);
      return true;
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Não foi possível entrar no sistema.");
      return false;
    } finally {
      setLoginLoading(false);
    }
  }

  async function logout() {
    setLogoutLoading(true);
    try {
      await systemApi("auth/logout", { method: "POST" });
    } finally {
      clearSession("Sessão encerrada.");
      setLogoutLoading(false);
    }
  }

  return {
    user,
    summary,
    summaryLoading,
    sessionChecking,
    loginLoading,
    logoutLoading,
    error,
    notice,
    setError,
    setNotice,
    login,
    logout,
  };
}
