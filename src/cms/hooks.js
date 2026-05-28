import { useState, useEffect, useCallback } from "react";
import { fetchStaff, fetchSchedule, fetchMinistries, fetchAnnouncements, fetchEvents, fetchBulletins, fetchBlogPosts, getDeletedBlogIds } from "./client";
import { friars as staticFriars, staff as staticStaff } from "../data/staff";
import { sundayMass, dailyMass, confession, adoration } from "../data/schedule";
import { ministries as staticMinistries } from "../data/ministries";
import { announcements as staticAnnouncements } from "../data/announcements";
import { events as staticEvents } from "../data/events";
import { bulletins as staticBulletins } from "../data/bulletins";
import { blogPosts as staticBlogPosts } from "../data/blog";
import { getAll as getLocalEvents, hasAny as hasLocalEvents } from "../events/store";
import { getAll as getLocalSchedule } from "../schedule-admin/store";
import { getAll as getLocalStaff } from "../staff-admin/store";
import { getAll as getLocalMinistries } from "../ministries-admin/store";
import { getVisible as getLocalVisibleAnnouncements } from "../announcements/store";

export function useAdminSyncSignal() {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const bump = () => setVersion((v) => v + 1);
    window.addEventListener("stdom:admin-synced", bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener("stdom:admin-synced", bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  return version;
}

/**
 * Generic CMS hook. Tries the CMS fetch first, falls back to static data.
 * Returns { data, loading, isLive } where isLive indicates whether data
 * came from the CMS (true) or static fallbacks (false).
 */
function useCmsData(fetcher, fallback) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetcher().then((result) => {
      if (!cancelled && result) {
        setData(result);
        setIsLive(true);
      }
      if (!cancelled) setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
    // Fetch once on mount. Callers pass module-level fetchers and inline
    // fallback objects, so deps would re-fire every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, isLive };
}

/** Staff data — returns { friars, staff }. localStorage admin overrides CMS if present. */
export function useStaff() {
  const cms = useCmsData(fetchStaff, { friars: staticFriars, staff: staticStaff });
  useAdminSyncSignal();
  const local = getLocalStaff();
  if (local) {
    return {
      ...cms,
      data: {
        friars: local.friars || cms.data.friars,
        staff: local.staff || cms.data.staff,
      },
    };
  }
  return cms;
}

/** Schedule data — localStorage admin overrides CMS if present. */
export function useSchedule() {
  const cms = useCmsData(fetchSchedule, { sundayMass, dailyMass, confession, adoration });
  useAdminSyncSignal();
  const local = getLocalSchedule();
  if (local) {
    return {
      ...cms,
      data: {
        sundayMass: local.sundayMass || cms.data.sundayMass,
        dailyMass: local.dailyMass || cms.data.dailyMass,
        confession: local.confession || cms.data.confession,
        adoration: local.adoration || cms.data.adoration,
      },
    };
  }
  return cms;
}

/** Ministries list — localStorage admin overrides CMS if present. */
export function useMinistries() {
  const cms = useCmsData(fetchMinistries, staticMinistries);
  useAdminSyncSignal();
  const local = getLocalMinistries();
  if (local) return { ...cms, data: local };
  return cms;
}

/** Announcements — falls back to static sample data */
export function useAnnouncements() {
  const cms = useCmsData(fetchAnnouncements, staticAnnouncements);
  useAdminSyncSignal();
  const local = getLocalVisibleAnnouncements().map((ann) => ({
    ...ann,
    date: ann.date || ann.startDate || ann.createdAt?.slice(0, 10) || "",
  }));
  if (local.length > 0) return { ...cms, data: local };
  return cms;
}

/** Events — localStorage admin overrides CMS if present. */
export function useEvents() {
  const cms = useCmsData(fetchEvents, staticEvents);
  useAdminSyncSignal();
  const local = hasLocalEvents() ? getLocalEvents() : null;
  if (local) return { ...cms, data: local };
  return cms;
}

/** Bulletin archive — falls back to static sample data */
export function useBulletins() {
  return useCmsData(fetchBulletins, staticBulletins);
}

/**
 * Blog posts — tries the Google Docs CMS first, falls back to static sample posts.
 * CMS posts are merged with static posts (CMS takes precedence on matching IDs).
 * Locally-tombstoned IDs (see deleteBlogPost) are filtered out from both sides.
 *
 * Returns { data, loading, isLive, refresh } — call refresh() after
 * mutations (create / update / delete) to re-read the post list.
 */
export function useBlogPosts() {
  const syncVersion = useAdminSyncSignal();
  const [data, setData] = useState(() => {
    const deleted = new Set(getDeletedBlogIds());
    return staticBlogPosts.filter((p) => !deleted.has(p.id));
  });
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const deleted = new Set(getDeletedBlogIds());
    fetchBlogPosts().then((cmsPosts) => {
      if (cancelled) return;
      if (cmsPosts && cmsPosts.length > 0) {
        const cmsIds = new Set(cmsPosts.map((p) => p.id));
        const merged = [
          ...cmsPosts.filter((p) => !deleted.has(p.id)),
          ...staticBlogPosts.filter((p) => !cmsIds.has(p.id) && !deleted.has(p.id)),
        ];
        setData(merged);
        setIsLive(true);
      } else {
        // CMS returned nothing — still need to apply tombstones to static posts
        setData(staticBlogPosts.filter((p) => !deleted.has(p.id)));
      }
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [tick, syncVersion]);

  return { data, loading, isLive, refresh };
}
