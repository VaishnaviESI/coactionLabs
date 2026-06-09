// Lightweight, dependency-free user analytics.
//
// Everything is kept client-side: events are buffered in localStorage and
// exposed on `window.__analytics` for inspection. No third-party library and
// no network calls are involved.
//
// Usage:
//   import { trackEvent, identify } from "@/lib/analytics";
//   trackEvent("agent_created", { template: "claims" });
//
// Inspect from the browser console:
//   window.__analytics.summary()
//   window.__analytics.getEvents()

export type AnalyticsEventType =
  | "page_view"
  | "click"
  | "identify"
  | "session_start"
  | "session_end"
  | (string & {});

export interface AnalyticsEvent {
  ts: string;
  type: AnalyticsEventType;
  name: string;
  props?: Record<string, unknown>;
  sessionId: string;
  userId: string | null;
  // Monotonic sequence number, used to track which events have been flushed
  // to the server so we never re-send the same event.
  seq: number;
}

interface AnalyticsSession {
  id: string;
  startedAt: number;
  lastActivityAt: number;
}

interface AnalyticsSummary {
  totalEvents: number;
  byType: Record<string, number>;
  topPages: Array<{ path: string; views: number }>;
  session: AnalyticsSession | null;
  sessionDurationMs: number;
  userId: string | null;
}

interface AnalyticsWindowApi {
  getEvents: () => AnalyticsEvent[];
  getSession: () => AnalyticsSession | null;
  summary: () => AnalyticsSummary;
  track: typeof trackEvent;
  identify: typeof identify;
  reset: () => void;
  flush: () => Promise<void>;
  clear: () => void;
}

declare global {
  interface Window {
    __analytics?: AnalyticsWindowApi;
    __analyticsEvents?: AnalyticsEvent[];
  }
}

const EVENTS_KEY = "analytics_events";
const SESSION_KEY = "analytics_session";
const USER_KEY = "analytics_user_id";
const SENT_KEY = "analytics_last_sent_seq";
const TOKEN_KEY = "auth_token";
const FLUSH_ENDPOINT = "/api/analytics/events";
const FLUSH_INTERVAL_MS = 30 * 1000; // Flush buffered events every 30 seconds.
const MAX_ENTRIES = 500;
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity.

let buffer: AnalyticsEvent[] = [];
let session: AnalyticsSession | null = null;
let userId: string | null = null;
let initialized = false;
let eventSeq = 0; // Last assigned event sequence number.
let lastSentSeq = 0; // Highest sequence number confirmed delivered to the server.
let flushInFlight = false;
let flushTimer: ReturnType<typeof setInterval> | null = null;

const hasWindow = () => typeof window !== "undefined";

const newId = () =>
  hasWindow() && window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const persistEvents = () => {
  if (!hasWindow()) return;
  window.__analyticsEvents = buffer;
  try {
    window.localStorage.setItem(EVENTS_KEY, JSON.stringify(buffer));
  } catch {
    // Ignore storage errors (private mode / quota / restricted environments).
  }
};

const persistSession = () => {
  if (!hasWindow() || !session) return;
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Ignore storage errors.
  }
};

const loadEvents = () => {
  if (!hasWindow()) return;
  try {
    const raw = window.localStorage.getItem(EVENTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    buffer = Array.isArray(parsed) ? parsed.slice(-MAX_ENTRIES) : [];
  } catch {
    buffer = [];
  }
  // Restore / backfill sequence numbers so flush tracking survives reloads.
  // Older persisted events (pre-seq) are renumbered deterministically here.
  eventSeq = buffer.reduce((max, e) => Math.max(max, e.seq ?? 0), 0);
  for (const e of buffer) {
    if (typeof e.seq !== "number") {
      e.seq = ++eventSeq;
    }
  }
  try {
    lastSentSeq = Number(window.localStorage.getItem(SENT_KEY) ?? 0) || 0;
  } catch {
    lastSentSeq = 0;
  }
  window.__analyticsEvents = buffer;
};

const loadUserId = () => {
  if (!hasWindow()) return;
  try {
    userId = window.localStorage.getItem(USER_KEY);
  } catch {
    userId = null;
  }
};

const pushEvent = (
  type: AnalyticsEventType,
  name: string,
  props?: Record<string, unknown>,
) => {
  if (!hasWindow()) return;

  ensureSession();

  const event: AnalyticsEvent = {
    ts: new Date().toISOString(),
    type,
    name,
    props,
    sessionId: session?.id ?? "unknown",
    userId,
    seq: ++eventSeq,
  };

  buffer = [...buffer, event].slice(-MAX_ENTRIES);
  persistEvents();

  if (session) {
    session.lastActivityAt = Date.now();
    persistSession();
  }

  if (import.meta.env.DEV) {
    console.info("[ANALYTICS]", type, name, props ?? "");
  }
};

const startSession = () => {
  const now = Date.now();
  session = { id: newId(), startedAt: now, lastActivityAt: now };
  persistSession();
  pushEvent("session_start", "session_start");
};

const ensureSession = () => {
  if (!hasWindow()) return;

  if (!session) {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      session = raw ? (JSON.parse(raw) as AnalyticsSession) : null;
    } catch {
      session = null;
    }
  }

  const now = Date.now();
  if (!session || now - session.lastActivityAt > SESSION_TIMEOUT_MS) {
    startSession();
  }
};

const endSession = () => {
  if (!session) return;
  const durationMs = Date.now() - session.startedAt;
  pushEvent("session_end", "session_end", { durationMs });
};

const handleClick = (e: MouseEvent) => {
  const target = e.target as Element | null;
  const el = target?.closest<HTMLElement>("[data-analytics]");
  if (!el) return;

  const name = el.dataset.analytics || "unknown";
  const props: Record<string, unknown> = {};

  // Collect any data-analytics-* attributes as extra properties.
  for (const [key, value] of Object.entries(el.dataset)) {
    if (key === "analytics" || !key.startsWith("analytics")) continue;
    const propKey = key.charAt(8).toLowerCase() + key.slice(9);
    props[propKey] = value;
  }

  const text = el.textContent?.trim().slice(0, 80);
  if (text) props.text = text;

  pushEvent("click", name, props);
};

/** Track an arbitrary custom event. */
export function trackEvent(name: string, props?: Record<string, unknown>) {
  pushEvent(name, name, props);
}

/** Track a page/route view. */
export function trackPageView(path: string, props?: Record<string, unknown>) {
  pushEvent("page_view", path, {
    title: hasWindow() ? document.title : undefined,
    ...props,
  });
}

/** Associate subsequent events with a user. */
export function identify(id: string, traits?: Record<string, unknown>) {
  userId = id;
  if (hasWindow()) {
    try {
      window.localStorage.setItem(USER_KEY, id);
    } catch {
      // Ignore storage errors.
    }
  }
  pushEvent("identify", "identify", traits);
}

/** Clear the current user association (e.g. on logout). */
export function resetUser() {
  userId = null;
  if (hasWindow()) {
    try {
      window.localStorage.removeItem(USER_KEY);
    } catch {
      // Ignore storage errors.
    }
  }
}

const buildSummary = (): AnalyticsSummary => {
  const byType: Record<string, number> = {};
  const pageViews: Record<string, number> = {};

  for (const event of buffer) {
    byType[event.type] = (byType[event.type] ?? 0) + 1;
    if (event.type === "page_view") {
      pageViews[event.name] = (pageViews[event.name] ?? 0) + 1;
    }
  }

  const topPages = Object.entries(pageViews)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalEvents: buffer.length,
    byType,
    topPages,
    session,
    sessionDurationMs: session ? Date.now() - session.startedAt : 0,
    userId,
  };
};

const persistSentSeq = () => {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(SENT_KEY, String(lastSentSeq));
  } catch {
    // Ignore storage errors.
  }
};

/**
 * Flush unsent buffered events to the backend. Events stay in the localStorage
 * buffer regardless — `lastSentSeq` tracks delivery so a failed POST simply
 * leaves them to be retried on the next flush (localStorage is the fallback).
 *
 * Uses `fetch` with `keepalive` directly (rather than the api client) so the
 * final flush can complete during page unload, where sendBeacon cannot carry
 * the Authorization header.
 */
export async function flushEvents(useKeepalive = false): Promise<void> {
  if (!hasWindow() || flushInFlight) return;

  const token = window.localStorage.getItem(TOKEN_KEY);
  if (!token) return; // Not authenticated yet — keep buffering locally.

  const pending = buffer.filter((e) => e.seq > lastSentSeq);
  if (pending.length === 0) return;

  const highestSeq = pending[pending.length - 1].seq;
  flushInFlight = true;
  try {
    const res = await fetch(FLUSH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ events: pending }),
      keepalive: useKeepalive,
    });
    if (res.ok) {
      lastSentSeq = highestSeq;
      persistSentSeq();
    }
  } catch {
    // Network failure — events remain buffered for the next attempt.
  } finally {
    flushInFlight = false;
  }
}

/**
 * Initialise analytics: hydrate stored state, start/resume a session, and
 * attach global click + session listeners. Safe to call more than once.
 */
export function initAnalytics() {
  if (!hasWindow() || initialized) return;
  initialized = true;

  loadEvents();
  loadUserId();
  ensureSession();

  document.addEventListener("click", handleClick, { capture: true });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      endSession();
      void flushEvents(true);
    }
  });
  window.addEventListener("pagehide", () => {
    endSession();
    void flushEvents(true);
  });

  // Periodic background flush.
  flushTimer = setInterval(() => void flushEvents(false), FLUSH_INTERVAL_MS);

  window.__analytics = {
    getEvents: () => [...buffer],
    getSession: () => (session ? { ...session } : null),
    summary: buildSummary,
    track: trackEvent,
    identify,
    reset: resetUser,
    flush: () => flushEvents(false),
    clear: () => {
      buffer = [];
      persistEvents();
    },
  };
}
