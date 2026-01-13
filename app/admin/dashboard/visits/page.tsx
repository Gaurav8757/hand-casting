"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CustomerVisitsTable from "@/components/admin/customer-visits-table"
import { Monitor } from "lucide-react"

export default function VisitsPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-amber-500/40 underline-offset-8">
            Digital Footprints
          </h1>
          <p className="text-foreground/60 mt-4 text-lg font-medium">Monitoring the pulse of your portal engagement.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white/5 border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
              <Monitor className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-foreground font-mono uppercase tracking-widest text-xs">Observatory Active</span>
           </div>
        </div>
      </div>

      <Card className="glass border-white/10 shadow-6xl rounded-[3rem] overflow-hidden">
        <CardHeader className="p-8 border-b border-white/5 bg-white/[0.01]">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter">Engagement Log</CardTitle>
          <CardDescription className="text-sm font-medium text-foreground/40 uppercase tracking-widest">
            Irreversible recording of every portal interaction and ingress point.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <CustomerVisitsTable />
        </CardContent>
      </Card>
    </div>
  )
}
