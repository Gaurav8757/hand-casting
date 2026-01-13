"use client";

import { useState, useEffect } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Calendar, Monitor, Cpu, Globe, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export type CustomerVisit = {
  id: string;
  submission_id: string;
  visit_timestamp: string;
  page_visited: string;
  user_agent: string;
  ip_address: string;
  browser: string;
  os: string;
  device_type: string;
};

export default function CustomerVisitsTable() {
  const [data, setData] = useState<CustomerVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "visit_timestamp", desc: true },
  ]);
  const [timeFilter, setTimeFilter] = useState<string>("all");

  useEffect(() => {
    fetchVisits();
  }, [timeFilter]);

  const fetchVisits = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("customer_visits")
        .select("*")
        .order("visit_timestamp", { ascending: false });

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfQuarter = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      switch (timeFilter) {
        case "today":
          query = query.gte("visit_timestamp", today.toISOString());
          break;
        case "month":
          query = query.gte("visit_timestamp", startOfMonth.toISOString());
          break;
        case "quarter":
          query = query.gte("visit_timestamp", startOfQuarter.toISOString());
          break;
        case "year":
          query = query.gte("visit_timestamp", startOfYear.toISOString());
          break;
      }

      const { data: visits, error } = await query;

      if (error) {
        console.error("Error fetching visits:", error);
        return;
      }

      setData(visits || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<CustomerVisit>[] = [
    {
      accessorKey: "visit_timestamp",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px] font-black"
        >
          <Calendar size={12} className="text-primary" />
          Chronology
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("visit_timestamp"));
        return (
          <div className="flex flex-col">
            <div className="font-bold text-foreground font-mono text-sm tracking-tighter">
              {date.toLocaleDateString("en-GB")}
            </div>
            <div className="font-black text-[10px] text-foreground/30 uppercase tracking-widest mt-1">
              {date.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "page_visited",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black">
          Entry Point
        </div>
      ),
      cell: ({ row }) => (
        <div className="inline-flex px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-black uppercase tracking-widest text-foreground/60 italic">
          {row.getValue("page_visited") || "/"}
        </div>
      ),
    },
    {
      accessorKey: "ip_address",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black">
          IP Architecture
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Globe size={12} className="text-primary/30" />
          <span className="text-xs font-mono font-black text-foreground/40">
            {row.getValue("ip_address") || "0.0.0.0"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "device_info",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black">
          Hardware Protocol
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10">
            {row.original.device_type === "mobile" ? (
              <Monitor size={14} className="text-primary" />
            ) : (
              <Monitor size={14} className="text-primary" />
            )}
          </div>
          <div>
            <div className="text-xs font-black text-foreground/70 uppercase tracking-tight italic">
              {row.original.browser}
            </div>
            <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mt-0.5">
              {row.original.os} • {row.original.device_type}
            </div>
          </div>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] text-foreground/60 w-64">
            <div className="flex items-center gap-3">
              <Calendar size={14} className="text-primary" />
              <SelectValue placeholder="Filter Span" />
            </div>
          </SelectTrigger>
          <SelectContent className="glass border-white/10 rounded-2xl p-2">
            <SelectItem
              value="all"
              className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
            >
              All Time Records
            </SelectItem>
            <SelectItem
              value="today"
              className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
            >
              Today Only
            </SelectItem>
            <SelectItem
              value="month"
              className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
            >
              Monthly Span
            </SelectItem>
            <SelectItem
              value="quarter"
              className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
            >
              Quarterly Span
            </SelectItem>
            <SelectItem
              value="year"
              className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
            >
              Annual Cycle
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/20 to-transparent" />
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-white/5 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-16 px-6">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <td colSpan={columns.length} className="h-64 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">
                      Scanning Transmission Logs...
                    </p>
                  </div>
                </td>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group border-white/5 hover:bg-white/2 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-8">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center gap-6 opacity-20 grayscale">
                    <Monitor size={80} strokeWidth={1} />
                    <p className="text-2xl font-black uppercase tracking-[0.5em]">
                      No Footprints Found
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
          <Hash size={14} className="text-amber-500" />
          {table.getFilteredRowModel().rows.length} Unique Sessions Identified
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10 text-foreground/60 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 disabled:opacity-20 translate-y-0 hover:-translate-y-0.5"
          >
            Previous Log
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10 text-foreground/60 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 disabled:opacity-20 translate-y-0 hover:-translate-y-0.5"
          >
            Next Log
          </Button>
        </div>
      </div>
    </div>
  );
}
