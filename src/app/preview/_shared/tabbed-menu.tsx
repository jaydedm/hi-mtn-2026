"use client";

import { useState } from "react";
import { MENU } from "./menu-data";

export type MenuStyles = {
  tabs: string;
  tab: string;
  tabActive: string;
  tabIdle: string;
  blurb: string;
  item: string;
  name: string;
  price: string;
  desc: string;
  leader?: string;
  footer: string;
};

/**
 * Tabbed HTML menu built from the printed menu. Replaces the PDF so it is
 * searchable, accessible, and readable on a phone.
 */
export function TabbedMenu({ styles, initial = "burgers" }: { styles: MenuStyles; initial?: string }) {
  const [active, setActive] = useState(initial);
  const section = MENU.find((s) => s.id === active) ?? MENU[0];

  return (
    <div>
      <div role="tablist" aria-label="Menu sections" className={styles.tabs}>
        {MENU.map((s) => {
          const on = s.id === section.id;
          return (
            <button
              key={s.id}
              role="tab"
              type="button"
              id={`tab-${s.id}`}
              aria-selected={on}
              aria-controls={`panel-${s.id}`}
              onClick={() => setActive(s.id)}
              className={`${styles.tab} ${on ? styles.tabActive : styles.tabIdle}`}
            >
              {s.title}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${section.id}`} aria-labelledby={`tab-${section.id}`} className="pv-reveal">
        {section.blurb && <p className={styles.blurb}>{section.blurb}</p>}
        <ul className="grid gap-x-10 md:grid-cols-2">
          {section.items.map((it) => (
            <li key={it.name} className={styles.item}>
              <div className="flex items-baseline gap-2">
                <span className={styles.name}>{it.name}</span>
                {styles.leader && <span className={`flex-1 ${styles.leader}`} aria-hidden="true" />}
                <span className={styles.price}>{it.price}</span>
              </div>
              {(it.desc || it.note) && (
                <p className={styles.desc}>
                  {it.desc}
                  {it.note && <span className="ml-2 opacity-70">({it.note})</span>}
                </p>
              )}
            </li>
          ))}
        </ul>
        {section.footer && <p className={styles.footer}>{section.footer}</p>}
      </div>
    </div>
  );
}
