"use client";

import { useState, useEffect } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Search,
  Filter,
  Layers,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export type CustomerSubmission = {
  id: string;
  name: string;
  mobile_number: string;
  email: string;
  address: string;
  inquiry_type: string;
  service_types: string[];
  message: string;
  commitment_accepted: boolean;
  submission_status: "pending" | "completed" | "in-progress";
  advance_payment: number;
  final_payment: number;
  total_amount: number;
  created_at: string;
};

export default function CustomerSubmissionsTable() {
  const [data, setData] = useState<CustomerSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [timeFilter, setTimeFilter] = useState<string>("all");

  useEffect(() => {
    fetchSubmissions();
  }, [timeFilter]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("customer_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfQuarter = new Date(
        now.getFullYear(),
        Math.floor(now.getMonth() / 3) * 3,
        1
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (timeFilter) {
        case "today":
          query = query.gte("created_at", today.toISOString());
          break;
        case "month":
          query = query.gte("created_at", startOfMonth.toISOString());
          break;
        case "quarter":
          query = query.gte("created_at", startOfQuarter.toISOString());
          break;
        case "year":
          query = query.gte("created_at", startOfYear.toISOString());
          break;
      }

      const { data: submissions, error } = await query;

      if (error) {
        console.error("Error fetching submissions:", error);
        return;
      }

      setData(submissions || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("customer_submissions")
        .update({ submission_status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, submission_status: newStatus as any }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const columns: ColumnDef<CustomerSubmission>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-primary transition-colors uppercase tracking-[0.2em] text-[10px] font-black"
        >
          <User size={12} className="text-primary" />
          Name
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="font-black text-foreground uppercase italic tracking-tight text-base">
            {row.getValue("name")}
          </div>
          <div className="text-[10px] font-mono text-foreground/30 font-bold uppercase tracking-widest mt-0.5">
            #{row.original.id.slice(0, 8)}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black">
          Contact Vector
        </div>
      ),
      cell: ({ row }) => (
        <div className="space-y-1">
          <a
            href={`tel:${row.original.mobile_number}`}
            className="flex items-center gap-2 text-xs font-bold text-foreground/60 hover:text-accent transition-colors"
          >
            <Phone size={10} className="text-accent" />
            {row.original.mobile_number}
          </a>
          <a
            href={`mailto:${row.original.email}`}
            className="flex items-center gap-2 text-xs font-bold text-foreground/60 hover:text-accent transition-colors"
          >
            <Mail size={10} className="text-accent" />
            {row.original.email}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "inquiry_type",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black">
          Segment
        </div>
      ),
      cell: ({ row }) => (
        <div className="inline-flex px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-foreground/50 italic">
          {row.getValue("inquiry_type")}
        </div>
      ),
    },
    {
      accessorKey: "service_types",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black">
          Services
        </div>
      ),
      cell: ({ row }) => {
        const services = row.original.service_types || [];
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {services.length > 0 ? (
              services.map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[9px] font-bold uppercase tracking-wider text-accent"
                >
                  {service}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-foreground/30 italic">None</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "commitment_accepted",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black text-center">
          Commitment
        </div>
      ),
      cell: ({ row }) => {
        const accepted = row.original.commitment_accepted;
        return (
          <div className="flex justify-center">
            {accepted ? (
              <div className="w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "submission_status",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black text-center">
          Protocol Status
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("submission_status") as string;
        return (
          <div className="flex justify-center">
            <Select
              value={status}
              onValueChange={(value) =>
                handleStatusChange(row.original.id, value)
              }
            >
              <SelectTrigger
                className={cn(
                  "w-35 h-9 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl border border-white/10 shadow-lg transition-all",
                  status === "pending"
                    ? "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20 shadow-muted-foreground/5"
                    : status === "in-progress"
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5"
                      : "bg-green-500/10 text-green-500 border-green-500/20 shadow-green-500/5"
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-2xl">
                <SelectItem
                  value="pending"
                  className="text-[10px] font-black uppercase tracking-widest"
                >
                  Pending
                </SelectItem>
                <SelectItem
                  value="in-progress"
                  className="text-[10px] font-black uppercase tracking-widest"
                >
                  In-Progress
                </SelectItem>
                <SelectItem
                  value="completed"
                  className="text-[10px] font-black uppercase tracking-widest"
                >
                  Completed
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      accessorKey: "total_amount",
      header: () => (
        <div className="uppercase tracking-[0.2em] text-[10px] font-black text-right">
          Financials
        </div>
      ),
      cell: ({ row }) => {
        const total = row.original.total_amount || 0;
        const adv = row.original.advance_payment || 0;
        const fin = row.original.final_payment || 0;
        return (
          <div className="text-right">
            <div className="font-black text-lg text-foreground italic tracking-tight">
              ₹{total.toLocaleString()}
            </div>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="text-[9px] font-black uppercase text-muted-foreground bg-muted/10 px-1.5 py-0.5 rounded">
                ADV: ₹{adv}
              </span>
              <span className="text-[9px] font-black uppercase text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded">
                FIN: ₹{fin}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-2 hover:text-muted-foreground transition-colors uppercase tracking-[0.2em] text-[10px] font-black ml-auto"
        >
          <Calendar size={12} className="text-muted-foreground" />
          Timestamp
          <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return (
          <div className="text-right text-[11px] font-bold text-foreground/40 uppercase tracking-widest font-mono">
            {date.toLocaleDateString("en-GB")}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-foreground/30 group-focus-within:text-accent transition-colors" />
          </div>
          <Input
            placeholder="Search Identity..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-accent font-bold uppercase tracking-widest text-[11px]"
          />
        </div>

        <div className="md:col-span-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="w-4 h-4 text-foreground/30 group-focus-within:text-accent transition-colors" />
          </div>
          <Input
            placeholder="Filter Email Node..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-accent font-bold uppercase tracking-widest text-[11px]"
          />
        </div>

        <div className="md:col-span-4 flex gap-4">
          <div className="flex-1">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 font-black uppercase tracking-widest text-[10px] text-foreground/60">
                <div className="flex items-center gap-3">
                  <Calendar size={14} className="text-muted-foreground" />
                  <SelectValue placeholder="Chronology" />
                </div>
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-2xl p-2">
                <SelectItem
                  value="all"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
                >
                  All Time
                </SelectItem>
                <SelectItem
                  value="today"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
                >
                  Today
                </SelectItem>
                <SelectItem
                  value="month"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
                >
                  This Month
                </SelectItem>
                <SelectItem
                  value="quarter"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
                >
                  This Quarter
                </SelectItem>
                <SelectItem
                  value="year"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] py-3"
                >
                  This Year
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-14 bg-white/5 hover:bg-white/10 border-white/10 text-foreground/60 font-black uppercase tracking-widest text-[10px] rounded-2xl px-6">
                <Layers size={14} className="mr-3 text-accent" /> Matrix
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="glass border-white/10 rounded-2xl p-2 min-w-50"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize rounded-xl font-black  tracking-widest text-[10px] py-3"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id.replace("_", " ")}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Modern High-End Table */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/60 to-transparent" />
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
                    <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent animate-pulse">
                      Synchronizing Ledger...
                    </p>
                  </div>
                </td>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "group border-white/5 transition-all duration-300",
                    row.getIsSelected()
                      ? "bg-muted-foreground/5"
                      : "hover:bg-gray-500/2"
                  )}
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
                    <Layers size={80} strokeWidth={1} />
                    <p className="text-2xl font-black uppercase tracking-[0.5em]">
                      Ledger Empty
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination Footnote */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-foreground/40">
          <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} Records Isolated
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10 text-foreground/60 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 disabled:opacity-20 translate-y-0 hover:-translate-y-0.5"
          >
            Previous Cycle
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-12 px-6 bg-white/5 border-white/10 hover:bg-white/10 text-foreground/60 font-black uppercase tracking-[0.2em] text-[10px] rounded-xl transition-all active:scale-95 disabled:opacity-20 translate-y-0 hover:-translate-y-0.5"
          >
            Next Cycle
          </Button>
        </div>
      </div>
    </div>
  );
}
