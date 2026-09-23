"use client";

import * as React from "react";
import { cn } from "../lib/cn";
import { Search, ChevronDown, Check, X, PlusCircle } from "./icons";

export interface SearchableSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  group?: string;
  badge?: string;
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
  triggerClassName?: string;
  popoverClassName?: string;
  invalid?: boolean;
  allowCustom?: boolean;
  id?: string;
  /** Callback when user clicks "+ New / Quick Add" at bottom of dropdown (like in Image 1) */
  onAddNew?: () => void;
  /** Label for the "+ New / Quick Add" button, defaults to "New Option" */
  addNewLabel?: string;
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
  triggerClassName,
  popoverClassName,
  invalid = false,
  allowCustom = false,
  id,
  onAddNew,
  addNewLabel = "New Option"
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
        (o.subLabel && o.subLabel.toLowerCase().includes(q)) ||
        (o.group && o.group.toLowerCase().includes(q))
    );
  }, [options, search]);

  // Grouped options if options contain `group`
  const groupedData = React.useMemo(() => {
    const groups: { name: string; items: SearchableSelectOption[] }[] = [];
    const groupMap = new Map<string, SearchableSelectOption[]>();
    const ungrouped: SearchableSelectOption[] = [];

    for (const opt of filteredOptions) {
      if (opt.group) {
        if (!groupMap.has(opt.group)) {
          groupMap.set(opt.group, []);
        }
        groupMap.get(opt.group)!.push(opt);
      } else {
        ungrouped.push(opt);
      }
    }

    groupMap.forEach((items, name) => {
      groups.push({ name, items });
    });

    return { groups, ungrouped, hasGroups: groups.length > 0 };
  }, [filteredOptions]);

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

  function renderOptionItem(opt: SearchableSelectOption) {
    const isSelected = opt.value.toLowerCase() === (value || "").toLowerCase();
    return (
      <button
        key={opt.value}
        type="button"
        onClick={() => handleSelect(opt.value)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-left cursor-pointer transition-all duration-100",
          isSelected
            ? "bg-blue-600 dark:bg-blue-600 text-white font-medium shadow-xs"
            : "hover:bg-muted/80 text-foreground"
        )}
      >
        <div className="flex flex-col truncate pr-2">
          <span className={cn("truncate font-medium", isSelected ? "text-white" : "text-foreground")}>
            {opt.label}
          </span>
          {opt.subLabel && (
            <span
              className={cn(
                "text-[11px] truncate mt-0.5",
                isSelected ? "text-white/80" : "text-muted-foreground"
              )}
            >
              {opt.subLabel}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {opt.badge && (
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded font-medium",
                isSelected ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {opt.badge}
            </span>
          )}
          {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0" />}
        </div>
      </button>
    );
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
          open && "border-blue-600 ring-2 ring-blue-600/20",
          invalid && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          disabled && "cursor-not-allowed opacity-50 bg-muted/30",
          triggerClassName
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
            className={cn("h-4 w-4 transition-transform duration-200", open && "rotate-180 text-blue-600 dark:text-blue-400")}
          />
        </span>
      </button>

      {/* Dropdown Popover */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 w-full min-w-[240px] rounded-2xl border border-border/80 bg-popover text-popover-foreground shadow-2xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden animate-in fade-in-0 zoom-in-95",
            popoverClassName
          )}
        >
          {/* Search Header */}
          <div className="p-2 border-b border-border/60 bg-popover">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={searchPlaceholder}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-input/80 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1.5 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 scrollbar-thin">
            {allowCustom &&
              search.trim() &&
              !options.some((o) => o.value.toLowerCase() === search.trim().toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleSelect(search.trim())}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs text-left cursor-pointer transition-colors bg-primary/10 hover:bg-primary/15 text-primary font-medium border border-primary/20 mb-1"
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
              <div className="py-6 text-center text-xs text-muted-foreground">
                {emptyMessage}
              </div>
            ) : groupedData.hasGroups ? (
              <div className="space-y-2">
                {groupedData.groups.map((grp) => (
                  <div key={grp.name} className="space-y-0.5">
                    {/* Group Header matching Image 1 */}
                    <div className="px-3 pt-1.5 pb-1 text-xs font-bold text-foreground select-none">
                      {grp.name}
                    </div>
                    {/* Group Items */}
                    <div className="space-y-0.5">
                      {grp.items.map((opt) => renderOptionItem(opt))}
                    </div>
                  </div>
                ))}
                {groupedData.ungrouped.length > 0 && (
                  <div className="space-y-0.5 pt-1.5 border-t border-border/40">
                    {groupedData.ungrouped.map((opt) => renderOptionItem(opt))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredOptions.map((opt) => renderOptionItem(opt))}
              </div>
            )}
          </div>

          {/* Bottom Action Footer (like Image 1 '+ New Account') */}
          {onAddNew && (
            <div className="border-t border-border/60 p-1.5 bg-muted/20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onAddNew();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer text-left"
              >
                <PlusCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>{addNewLabel}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
