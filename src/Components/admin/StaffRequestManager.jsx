import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, XCircle, Mail, Phone, Clock, User } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/Components/ui/dialog";

export default function StaffRequestManager({ requests }) {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = React.useState(null);
  const [actionType, setActionType] = React.useState(null);

  const updateRequestMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.StaffRequest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['staffRequests']);
      setSelectedRequest(null);
      setActionType(null);
    }
  });

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType('approve');
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType('reject');
  };

  const confirmAction = () => {
    if (selectedRequest && actionType) {
      updateRequestMutation.mutate({
        id: selectedRequest.id,
        status: actionType === 'approve' ? 'approved' : 'rejected'
      });
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  return (
    <>
      <Card className="glass-card border-none overflow-hidden group">
        <CardHeader className="p-8 border-b border-white/5 bg-white/5">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-black text-white uppercase tracking-widest">Clearance Queue</CardTitle>
            <Badge className="bg-purple-500/20 text-purple-400 border-none font-black text-[10px] tracking-widest px-4 py-1.5 rounded-full uppercase">
              {pendingRequests.length} Pending requests
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-20 text-blue-100/20">
              <User className="w-16 h-16 mx-auto mb-6 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">No pending clearance requests</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex flex-col xl:flex-row xl:items-center justify-between p-8 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-purple-500/20 group-hover:rotate-6 transition-transform">
                        {request.full_name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-purple-400 transition-colors">{request.full_name}</h3>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-black uppercase text-[9px] tracking-[0.2em] mt-1">{request.department}</Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-blue-100/30">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-purple-500" />
                        <span className="text-blue-100/60 lowercase font-medium text-xs">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-blue-500" />
                        {request.phone}
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-purple-500" />
                        {format(new Date(request.created_date), 'MMM dd, h:mm a')}
                      </div>
                    </div>
                    {request.notes && (
                      <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-2xl">
                        <p className="text-[9px] font-black text-blue-100/20 uppercase tracking-widest mb-1">SUPPLEMENTAL INTEL:</p>
                        <p className="text-xs text-blue-100/60 font-medium leading-relaxed italic">"{request.notes}"</p>
                      </div>
                    )}
                  </div>
                  <div className="flex xl:flex-col gap-3 mt-8 xl:mt-0 xl:ml-8">
                    <Button
                      onClick={() => handleApprove(request)}
                      className="flex-1 xl:w-40 h-14 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-3" />
                      AUTHORIZE
                    </Button>
                    <Button
                      onClick={() => handleReject(request)}
                      variant="ghost"
                      className="flex-1 xl:w-40 h-14 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
                    >
                      <XCircle className="w-4 h-4 mr-3" />
                      REJECT
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {processedRequests.length > 0 && (
            <div className="p-8 border-t border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] font-black text-blue-100/20 uppercase tracking-[0.4em] mb-6">Historical Record</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {processedRequests.slice(0, 6).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group/item">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-blue-100 font-bold group-hover/item:border-purple-500/30 transition-colors">
                        {request.full_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">{request.full_name}</p>
                        <p className="text-[8px] font-black text-blue-100/30 uppercase tracking-widest mt-0.5">{request.department}</p>
                      </div>
                    </div>
                    <Badge className={request.status === 'approved' ? 'bg-green-500/20 text-green-400 border-none uppercase text-[8px] tracking-widest' : 'bg-red-500/20 text-red-400 border-none uppercase text-[8px] tracking-widest'}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Staff Request
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Are you sure you want to approve this staff access request? You will need to manually invite the user via Dashboard → Users → Invite User.'
                : 'Are you sure you want to reject this staff access request?'}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedRequest.full_name}</p>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Department:</strong> {selectedRequest.department}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' : ''}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              disabled={updateRequestMutation.isPending}
            >
              {updateRequestMutation.isPending ? 'Processing...' : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}