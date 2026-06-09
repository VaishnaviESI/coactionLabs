type OktaDebugEntry = {
  ts: string;
  event: string;
  details?: Record<string, unknown>;
};

declare global {
  interface Window {
    __oktaDebugEvents?: OktaDebugEntry[];
  }
}

const STORAGE_KEY = "okta_debug_events";
const MAX_ENTRIES = 200;

const safePush = (entry: OktaDebugEntry) => {
  if (typeof window === "undefined") {
    return;
  }

  const existing = window.__oktaDebugEvents ?? [];
  const next = [...existing, entry].slice(-MAX_ENTRIES);
  window.__oktaDebugEvents = next;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore storage errors in private mode or restricted environments.
  }
};

export const logOktaEvent = (event: string, details?: Record<string, unknown>) => {
  const entry: OktaDebugEntry = {
    ts: new Date().toISOString(),
    event,
    details,
  };

  if (details) {
    console.info("[OKTA]", event, details);
  } else {
    console.info("[OKTA]", event);
  }

  safePush(entry);
};

export const hydrateOktaDebugEvents = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (window.__oktaDebugEvents?.length) {
    return;
  }

  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (fromStorage) {
      const parsed = JSON.parse(fromStorage) as OktaDebugEntry[];
      window.__oktaDebugEvents = Array.isArray(parsed) ? parsed.slice(-MAX_ENTRIES) : [];
    }
  } catch {
    window.__oktaDebugEvents = [];
  }
};
