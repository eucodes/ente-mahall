import { ApiClient } from "@mahalle/api-client";
import { API_URL, appScopeFromHost } from "./env";

/** Browser-side API client — cookies are attached automatically by the browser. */
export const apiClient = new ApiClient({
  baseUrl: API_URL,
  // Computed per-request (not at module load) since the same browser bundle
  // serves every subdomain — window.location reflects whichever site is
  // actually open right now.
  getAppScope: () => (typeof window !== "undefined" ? appScopeFromHost(window.location.host) : undefined),
  onSessionExpired: () => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (!path.includes("/login") && !path.includes("/register") && !path.includes("/onboarding")) {
        const currentPath = window.location.pathname + window.location.search;
        window.location.href = `/login?reason=expired&returnTo=${encodeURIComponent(currentPath)}`;
      }
    }
  }
});

export { ApiError } from "@mahalle/api-client";
