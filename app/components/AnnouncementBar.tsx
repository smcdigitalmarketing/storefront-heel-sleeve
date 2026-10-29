import type { ReactElement } from "react";

interface Announcement {
  content: ReactElement;
}

// Add announcements as JSX elements here.
const ANNOUNCEMENTS: Announcement[] = [];

export function AnnouncementBar() {
  if (ANNOUNCEMENTS.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="bg-primary text-primary-foreground px-4 py-2.5 text-center text-sm"
    >
      <ul role="list">
        {ANNOUNCEMENTS.map((announcement, index) => (
          <li key={index} className="wrap-anywhere">
            {announcement.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
