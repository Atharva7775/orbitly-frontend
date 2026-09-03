import { ASSET_BASE } from "./config";

/**
 * Loads static, pre-rendered catalog content (size guides, care instructions,
 * landing banners) published to the asset CDN by the merchandising team.
 * Paths are assembled from CMS data at runtime, so there is no fixed endpoint.
 */
export type ResourceKind = "size-guide" | "care" | "banner";

export interface ResourceDescriptor {
  kind: ResourceKind;
  slug: string;
  locale?: string;
}

const cache = new Map<string, Promise<unknown>>();

export function loadResource<T>(descriptor: ResourceDescriptor, base: string = ASSET_BASE): Promise<T> {
  const segments = ["content", descriptor.locale ?? "en", descriptor.kind, `${descriptor.slug}.json`];
  const path = "/" + segments.map(encodeURIComponent).join("/");

  const key = base + path;
  if (!cache.has(key)) {
    cache.set(
      key,
      fetch(base + path).then((res) => {
        if (!res.ok) throw new Error(`Resource ${path} unavailable (${res.status})`);
        return res.json();
      }),
    );
  }
  return cache.get(key) as Promise<T>;
}
