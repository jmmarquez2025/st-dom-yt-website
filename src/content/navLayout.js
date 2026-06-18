/**
 * Navigation layout overrides — reorder and hide top-level menu items.
 * Structure (routes) stays fixed in code; this only changes which top-level
 * entries show and in what order. Stored in the stdom_nav_layout shard.
 */

const STORAGE_KEY = "stdom_nav_layout";

export function getNavLayout() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { order: [], hidden: [] };
    const p = JSON.parse(raw);
    return {
      order: Array.isArray(p.order) ? p.order : [],
      hidden: Array.isArray(p.hidden) ? p.hidden : [],
    };
  } catch {
    return { order: [], hidden: [] };
  }
}

export function setNavLayout(order, hidden) {
  const data = { order: order || [], hidden: hidden || [] };
  try {
    if (data.order.length || data.hidden.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* quota / disabled */
  }
}

/** Apply the saved layout to the shipped NAV_ITEMS: drop hidden, then reorder. */
export function applyNavLayout(items) {
  const { order, hidden } = getNavLayout();
  const visible = items.filter((it) => !hidden.includes(it.key));
  if (!order.length) return visible;
  const rank = (key) => {
    const i = order.indexOf(key);
    return i === -1 ? order.length + items.findIndex((x) => x.key === key) : i;
  };
  return [...visible].sort((a, b) => rank(a.key) - rank(b.key));
}
