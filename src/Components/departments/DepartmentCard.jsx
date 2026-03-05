import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function DepartmentCard({ department, stats, onSelect, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="w-full h-full"
    >
      <Card className="glass-card border-none hover:bg-white/10 transition-all duration-300 cursor-pointer group h-full flex flex-col relative overflow-hidden"
        onClick={() => onSelect(department)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <CardHeader className="p-8 relative z-10">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-purple-400 text-2xl font-black mb-6 group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-500 shadow-xl">
            {department.name[0]}
          </div>
          <CardTitle className="text-2xl font-black text-white tracking-tight leading-tight group-hover:text-purple-300 transition-colors uppercase">{department.name}</CardTitle>
          <p className="text-blue-100/40 text-xs font-bold leading-relaxed mt-2 uppercase tracking-widest">{department.description}</p>
        </CardHeader>

        <CardContent className="space-y-4 p-8 pt-0 mt-auto relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-purple-500/20 transition-colors">
              <Users className="w-5 h-5 text-purple-500 mb-2 opacity-50" />
              <span className="text-[10px] font-black text-blue-100/20 uppercase tracking-widest mb-1">Waiting</span>
              <span className="text-xl font-black text-white">{stats.waiting}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-blue-500/20 transition-colors">
              <Clock className="w-5 h-5 text-blue-500 mb-2 opacity-50" />
              <span className="text-[10px] font-black text-blue-100/20 uppercase tracking-widest mb-1">Latency</span>
              <span className="text-xl font-black text-white">{stats.estimatedWait}<span className="text-xs ml-0.5 text-blue-100/30">m</span></span>
            </div>
          </div>

          <Button className="w-full h-14 bg-white/5 hover:bg-purple-600 text-white border border-white/10 hover:border-none font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl transition-all active:scale-[0.98]">
            ENGAGE
            <ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-2 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}