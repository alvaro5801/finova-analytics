"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, Search } from "lucide-react";
import clsx from "clsx";
import { searchNavItems, type NavItem } from "@/config/nav";
import { motionTokens } from "@/lib/tokens";

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** D6: busca de páginas no cliente (combobox acessível). Atalho "/" foca o campo. */
export function PageSearch() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const results = useMemo(() => searchNavItems(query), [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !isTypingTarget(e.target)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(item: NavItem) {
    router.push(item.href);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      const item = results[activeIndex];
      if (item) {
        e.preventDefault();
        go(item);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const expanded = open;
  const optionId = (i: number) => `${listId}-opt-${i}`;

  return (
    <div className="relative">
      <label className="flex items-center gap-2 rounded-xl border border-line bg-sunken/80 px-3 py-2 text-sm transition-colors duration-200 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
        <Search size={15} className="shrink-0 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Buscar páginas"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded && results.length ? optionId(activeIndex) : undefined}
          value={query}
          placeholder="Buscar páginas…"
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="w-32 bg-transparent text-fg outline-none placeholder:text-faint lg:w-44"
        />
        <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted lg:inline">
          /
        </kbd>
      </label>

      <AnimatePresence>
        {expanded && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label="Páginas"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: motionTokens.fast, ease: motionTokens.ease }}
            className="absolute end-0 top-full z-50 mt-2 w-64 origin-top-right rounded-xl border border-line-strong bg-surface p-1.5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]"
          >
            {results.length === 0 && (
              <li className="px-3 py-2.5 text-sm text-muted">Nenhuma página encontrada</li>
            )}
            {results.map((item, i) => {
              const Icon = item.icon;
              const active = i === activeIndex;
              return (
                <li
                  key={item.href}
                  id={optionId(i)}
                  role="option"
                  aria-selected={active}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    go(item);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={clsx(
                    "flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                    active ? "bg-primary/[0.14] text-fg" : "text-muted",
                  )}
                >
                  <Icon size={16} aria-hidden="true" className={active ? "text-primary-light" : ""} />
                  <span className="flex-1">{item.label}</span>
                  {active && <CornerDownLeft size={14} aria-hidden="true" className="text-muted" />}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
