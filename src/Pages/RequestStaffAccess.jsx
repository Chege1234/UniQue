import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { CheckCircle2, UserPlus, ArrowLeft, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function RequestStaffAccess() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    notes: '',
    password: '',
    confirm_password: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const createRequestMutation = useMutation({
    mutationFn: async (data) => {
      const { password, confirm_password, ...rest } = data;
      return base44.entities.StaffRequest.create({
        ...rest,
        password_hash: password,
        status: 'pending'
      });
    },
    onSuccess: () => {
      setShowSuccess(true);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setPasswordError('Passwords do not match.');
      return;
    }
    createRequestMutation.mutate(formData);
  };

  if (showSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="glass-card border-none p-16">
            <CardContent className="p-0">
              <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/20">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-6 uppercase">
               Request <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Submitted!</span>
              </h2>
              <p className="text-blue-100/40 font-medium text-lg leading-relaxed mb-10">
                Your request has been sent. An admin will review it and get back to you by email.
              </p>
              <div className="space-y-8">
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 text-left">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">What happens next:</p>
                  <ol className="text-[10px] text-blue-100/30 font-bold uppercase tracking-[0.15em] space-y-4">
                    <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">1</span> An admin reviews your request</li>
                    <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">2</span> You'll receive an approval email</li>
                    <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">3</span> Sign in with your approved email</li>
                    <li className="flex items-center gap-4"><span className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">4</span> Go to the Staff Login page</li>
                  </ol>
                </div>
                <Button
                  onClick={() => navigate(createPageUrl("StaffLogin"))}
                  className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-black uppercase tracking-[0.3em] text-sm rounded-2xl shadow-2xl transition-all active:scale-[0.98]"
                >
                  RETURN TO LOGIN
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-start mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("StaffLogin"))}
            className="text-blue-100/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl px-6 h-12 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-2 transition-transform" />
            Go Back
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-none overflow-hidden group">
            <CardHeader className="text-center pb-12 border-b border-white/5">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                <UserPlus className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-4xl font-black text-white tracking-tight uppercase">Staff Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Request</span></CardTitle>
              <CardDescription className="text-blue-100/30 font-medium text-lg mt-3">
                Fill in your details and an admin will review your request.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="full_name" className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] ml-1">FULL NAME</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                      placeholder="John Doe"
                      className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] ml-1">EMAIL ADDRESS</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="john@university.edu"
                      className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] ml-1">PHONE NUMBER</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="+1234567890"
                      className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="department" className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] ml-1">DEPARTMENT</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                      required
                    >
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold">
                        <SelectValue placeholder="Select department..." />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 text-white">
                        <SelectItem value="Admissions" className="hover:bg-white/5">Admissions</SelectItem>
                        <SelectItem value="Financial Aid" className="hover:bg-white/5">Financial Aid</SelectItem>
                        <SelectItem value="Registrar" className="hover:bg-white/5">Registrar</SelectItem>
                        <SelectItem value="Student Affairs" className="hover:bg-white/5">Student Affairs</SelectItem>
                        <SelectItem value="IT Support" className="hover:bg-white/5">IT Support</SelectItem>
                        <SelectItem value="Library" className="hover:bg-white/5">Library</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] ml-1">ADDITIONAL NOTES (OPTIONAL)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional information..."
                    rows={3}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-base font-medium p-6"
                  />
                </div>

                {/* Password section */}
                <div className="border-t border-white/5 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.25em]">Set Your Login Password</p>
                      <p className="text-[10px] text-blue-100/30 font-medium mt-0.5">You'll use this to sign in once approved. Min. 8 characters.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] ml-1">PASSWORD</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          placeholder="Min. 8 characters"
                          className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold pr-14"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-100/30 hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="confirm_password" className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] ml-1">CONFIRM PASSWORD</Label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirm_password}
                          onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                          required
                          placeholder="Repeat password"
                          className="h-14 bg-white/5 border-white/10 text-white placeholder:text-white/10 rounded-2xl focus:ring-blue-500/50 focus:border-blue-500/50 text-lg font-bold pr-14"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-100/30 hover:text-white transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {passwordError && (
                    <Alert className="mt-4 border-red-500/20 bg-red-500/5">
                      <AlertDescription className="text-red-400 text-xs font-bold uppercase tracking-widest">
                        {passwordError}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-20 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-black uppercase tracking-[0.4em] text-sm rounded-3xl shadow-2xl shadow-blue-500/20 transition-all active:scale-[0.98]"
                  disabled={createRequestMutation.isPending}
                >
                  {createRequestMutation.isPending ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-4 animate-spin" />
                      SUBMITTING CLEARANCE REQUEST...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-6 h-6 mr-4" />
                      SUBMIT REQUEST
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
