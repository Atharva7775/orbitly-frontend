"use client";

import { useEffect, useState } from "react";
import { loadResource } from "@/lib/api/resource";

interface SizeGuideContent {
  title: string;
  rows: { size: string; chestCm: number; lengthCm: number }[];
}

/** Renders the merchandising size guide for a SKU if one has been published. */
export function SizeGuide({ slug }: { slug: string }) {
  const [guide, setGuide] = useState<SizeGuideContent | null>(null);

  useEffect(() => {
    loadResource<SizeGuideContent>({ kind: "size-guide", slug: slug.toLowerCase() })
      .then(setGuide)
      .catch(() => setGuide(null));
  }, [slug]);

  if (!guide) return null;
  return (
    <details className="card" style={{ margin: "16px 0" }}>
      <summary>{guide.title}</summary>
      <table>
        <thead>
          <tr>
            <th>Size</th>
            <th>Chest (cm)</th>
            <th>Length (cm)</th>
          </tr>
        </thead>
        <tbody>
          {guide.rows.map((r) => (
            <tr key={r.size}>
              <td>{r.size}</td>
              <td>{r.chestCm}</td>
              <td>{r.lengthCm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
