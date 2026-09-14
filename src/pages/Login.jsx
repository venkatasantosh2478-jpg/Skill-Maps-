import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Shield } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

export default function Login() {
  const { loginGoogle, loginWithEmail, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const fbUser = await loginGoogle();
      if (fbUser?.email === "venkatasantosh2478@gmail.com") {
        navigate("/admin/overview");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Google sign-in was canceled or failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Welcome to SkillsMap"
      subtitle="Log in with your verified Firebase account"
      footer={
        <>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <Button
        variant="outline"
        className="w-full h-12 text-sm font-medium mb-6 hover:bg-indigo-50/50 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700"
        onClick={handleGoogle}
        disabled={loading}
      >
        <GoogleIcon className="w-5 h-5 mr-2" />
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400">or sign in with email</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
            Email Address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-11 text-xs"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Password
            </Label>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-11 text-xs"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-11 font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Authenticating...
            </>
          ) : (
            "Log in"
          )}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[11px] text-slate-400 text-center mb-3 font-medium">Quick Demo Profiles</p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-9 font-semibold hover:bg-indigo-50"
            onClick={() => {
              loginAsDemo("student");
              navigate("/dashboard");
            }}
          >
            Student Account
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="text-xs h-9 font-semibold text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-50"
            onClick={() => {
              loginAsDemo("admin");
              navigate("/admin/overview");
            }}
          >
            <Shield className="h-3.5 w-3.5 mr-1" />
            Admin (Santosh)
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
