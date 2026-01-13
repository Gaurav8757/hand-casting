"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomerSubmissionsTable from "@/components/admin/customer-submissions-table";
import { Users } from "lucide-react";

export default function SubmissionsPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-primary/50 underline-offset-8">
            Client Registry
          </h1>
          <p className="text-foreground/60 mt-4 text-lg font-medium">
            Detailed tracking of every hand-casting inquiry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground font-mono uppercase tracking-widest text-xs">
              Ledger Active
            </span>
          </div>
        </div>
      </div>

      <Card className="glass border-white/10 shadow-2xl rounded-[3rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 bg-white/1">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">
            Submission Chronicles
          </CardTitle>
          <CardDescription className="text-sm font-medium text-foreground/40 uppercase tracking-widest">
            Cross-reference records, analyze status, and manage financial
            touchpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <CustomerSubmissionsTable />
        </CardContent>
      </Card>
    </div>
  );
}
