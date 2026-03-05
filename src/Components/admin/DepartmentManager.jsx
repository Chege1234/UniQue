import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Switch } from "@/Components/ui/switch";
import { Badge } from "@/Components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog";

export default function DepartmentManager({ departments }) {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    average_service_time: 15,
    color: 'blue',
    is_active: true
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Department.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      setIsDialogOpen(false);
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Department.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
      setEditingDept(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Department.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['departments']);
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      average_service_time: 15,
      color: 'blue',
      is_active: true
    });
    setEditingDept(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDept) {
      updateMutation.mutate({ id: editingDept.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData(dept);
  };

  return (
    <Card className="glass-card border-none overflow-hidden group">
      <CardHeader className="p-8 border-b border-white/5 bg-white/5">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-black text-white uppercase tracking-widest">Node Infrastructure</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl px-6 h-12 shadow-2xl shadow-blue-500/20 transition-all">
                <Plus className="w-4 h-4 mr-2" />
                NEW NODE
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-white/10 text-white max-w-xl">
              <DialogHeader className="pb-6 border-b border-white/5">
                <DialogTitle className="text-2xl font-black uppercase tracking-tight">Initialize New Node</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-8 pt-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] ml-1">NODE DESIGNATION</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. CORE ADMISSIONS"
                    className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] ml-1">OPERATIONAL DESCRIPTION</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief architectural overview..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-base font-medium p-4"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] ml-1">PROCESS LATENCY (MINUTES)</Label>
                  <Input
                    type="number"
                    value={formData.average_service_time}
                    onChange={(e) => setFormData({ ...formData, average_service_time: parseInt(e.target.value) })}
                    className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      className="data-[state=checked]:bg-blue-500"
                    />
                    <Label className="text-[10px] font-black text-white uppercase tracking-widest">ACTIVE STATUS</Label>
                  </div>
                  <Badge className={formData.is_active ? "bg-green-500/20 text-green-400 border-none uppercase tracking-tighter" : "bg-red-500/20 text-red-400 border-none uppercase tracking-tighter"}>
                    {formData.is_active ? "OPERATIONAL" : "DEACTIVATED"}
                  </Badge>
                </div>
                <Button type="submit" className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl transition-all">INITIALIZE NODE</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {departments.map((dept) => (
            <div key={dept.id} className="flex items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-8">
                <div className={`w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500`}>
                  {dept.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-blue-400 transition-colors">{dept.name}</h3>
                    <Badge className={dept.is_active ? "bg-green-500/10 text-green-400 border-green-500/20 font-black uppercase text-[9px] tracking-[0.2em]" : "bg-red-500/10 text-red-400 border-red-500/20 font-black uppercase text-[9px] tracking-[0.2em]"}>
                      {dept.is_active ? "ENGAGED" : "OFFLINE"}
                    </Badge>
                  </div>
                  <p className="text-blue-100/40 font-medium text-sm mt-1">{dept.description}</p>
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                      <p className="text-[9px] font-black text-blue-100/20 uppercase tracking-[0.2em]">AVG LATENCY: <span className="text-blue-400">{dept.average_service_time}M</span></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-12 h-12 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl transition-all"
                  onClick={() => updateMutation.mutate({
                    id: dept.id,
                    data: { ...dept, is_active: !dept.is_active }
                  })}
                >
                  {dept.is_active ? <X className="w-4 h-4 text-red-400" /> : <Save className="w-4 h-4 text-green-400" />}
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="w-12 h-12 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl transition-all"
                  onClick={() => deleteMutation.mutate(dept.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}