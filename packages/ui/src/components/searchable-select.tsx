"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Search, ChevronDown, Check, X } from "./icons";

export interface SearchableSelectOption {
  value: string;
  label: string;
  subLabel?: string;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  invalid?: boolean;
  allowCustom?: boolean;
  id?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found",
  disabled = false,
  clearable = true,
  className,
  invalid = false,
  allowCustom = false,
  id
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Selected item
  const selectedOption = React.useMemo(() => {
    return (
      options.find((o) => o.value.toLowerCase() === (value || "").toLowerCase()) ||
      null
    );
  }, [options, value]);

  // Filtered options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const q = search.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        (o.subLabel && o.subLabel.toLowerCase().includes(q))
    );
  }, [options, search]);

  // Click outside to close
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Auto focus search on open
  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch("");
    }
  }, [open]);

  // Handle key down (Esc)
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[0]?.value) {
        handleSelect(filteredOptions[0].value);
      } else if (allowCustom && search.trim()) {
        handleSelect(search.trim());
      }
    }
  }

  function handleSelect(val: string) {
    onChange(val);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", open && "z-30", className)} onKeyDown={handleKeyDown}>
      {/* Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-xl border border-input/80 bg-background px-3.5 py-2 text-sm text-foreground shadow-2xs transition-all duration-150 text-left cursor-pointer",
          "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          invalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          disabled && "cursor-not-allowed opacity-50 bg-muted/30"
        )}
      >
        <span className="truncate flex-1 mr-2">
          {selectedOption ? (
            <span className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">{selectedOption.label}</span>
              {selectedOption.subLabel && (
                <span className="text-xs text-muted-foreground">({selectedOption.subLabel})</span>
              )}
            </span>
          ) : value ? (
            <span className="font-medium text-foreground">{value}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>

        <span className="flex items-center gap-1 shrink-0 text-muted-foreground">
          {clearable && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="p-0.5 rounded-full hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
              title="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180")}
          />
        </span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl border border-border bg-card text-card-foreground p-1.5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 animate-in fade-in-0 zoom-in-95">
          {/* Search Input */}
          <div className="relative mb-1 px-1 pt-1">
            <Search className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={searchPlaceholder}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
            />
          </div>

          {/* Options list */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 p-0.5 scrollbar-thin">
            {allowCustom &&
              search.trim() &&
              !options.some((o) => o.value.toLowerCase() === search.trim().toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleSelect(search.trim())}
                  className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs text-left cursor-pointer transition-colors bg-primary/10 hover:bg-primary/15 text-primary font-medium border border-primary/20 mb-1"
                >
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <span className="text-muted-foreground text-[11px]">Use custom:</span>
                    <span className="font-semibold underline truncate">&ldquo;{search.trim()}&rdquo;</span>
                  </div>
                  <span className="text-[10px] bg-primary/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-primary shrink-0">
                    Select
                  </span>
                </button>
              )}

            {filteredOptions.length === 0 &&
            (!allowCustom ||
              !search.trim() ||
              options.some((o) => o.value.toLowerCase() === search.trim().toLowerCase())) ? (
              <div className="py-5 text-center text-xs text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value.toLowerCase() === (value || "").toLowerCase();
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs text-left cursor-pointer transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted/70 text-foreground"
                    )}
                  >
                    <div className="flex flex-col truncate pr-2">
                      <span className="truncate font-medium text-foreground">{opt.label}</span>
                      {opt.subLabel && (
                        <span className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {opt.subLabel}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
