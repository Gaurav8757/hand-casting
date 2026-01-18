"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export interface Option {
    value: string;
    label: string;
}

interface MultipleSelectProps {
    value?: Option[];
    defaultOptions?: Option[];
    placeholder?: string;
    onChange?: (value: Option[]) => void;
    className?: string;
    hidePlaceholderWhenSelected?: boolean;
    hideClearAllButton?: boolean;
    emptyIndicator?: React.ReactNode;
}

export function MultipleSelector({
    value = [],
    defaultOptions = [],
    placeholder = "Select options...",
    onChange,
    className,
    hidePlaceholderWhenSelected = false,
    hideClearAllButton = false,
    emptyIndicator = <p className="text-center text-sm text-muted-foreground">No results found</p>,
}: MultipleSelectProps) {
    const [selected, setSelected] = React.useState<Option[]>(value);
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setSelected(value);
    }, [value]);

    // Click outside handler
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const handleSelect = (option: Option) => {
        const isSelected = selected.some((item) => item.value === option.value);
        const newSelected = isSelected
            ? selected.filter((item) => item.value !== option.value)
            : [...selected, option];

        setSelected(newSelected);
        onChange?.(newSelected);
    };

    const handleRemove = (option: Option) => {
        const newSelected = selected.filter((item) => item.value !== option.value);
        setSelected(newSelected);
        onChange?.(newSelected);
    };

    const handleClearAll = () => {
        setSelected([]);
        onChange?.([]);
    };

    return (
        <div ref={containerRef} className={cn("w-full", className)}>
            <div
                className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-wrap gap-1 flex-1">
                    {selected.length > 0 ? (
                        selected.map((option) => (
                            <Badge
                                key={option.value}
                                variant="secondary"
                                className="rounded-sm px-2 py-0.5 font-normal"
                            >
                                {option.label}
                                <button
                                    type="button"
                                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleRemove(option);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(option);
                                    }}
                                >
                                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                </button>
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                </div>
                {!hideClearAllButton && selected.length > 0 && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleClearAll();
                        }}
                        className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {open && (
                <div className="relative mt-2">
                    <Command className="rounded-lg border shadow-md">
                        <CommandList>
                            <CommandGroup>
                                {defaultOptions.length === 0 ? (
                                    <div className="py-6">{emptyIndicator}</div>
                                ) : (
                                    defaultOptions.map((option) => {
                                        const isSelected = selected.some((item) => item.value === option.value);
                                        return (
                                            <CommandItem
                                                key={option.value}
                                                onSelect={() => handleSelect(option)}
                                                className="cursor-pointer"
                                            >
                                                <div
                                                    className={cn(
                                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50 [&_svg]:invisible"
                                                    )}
                                                >
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <span>{option.label}</span>
                                            </CommandItem>
                                        );
                                    })
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            )}
        </div>
    );
}
