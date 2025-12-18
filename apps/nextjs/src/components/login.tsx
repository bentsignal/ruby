"use client";

import { useState } from "react";

import { Button } from "@acme/ui/button";

import { authClient } from "~/lib/auth-client";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (type === "login") {
      setLoading(true);
      await authClient.signIn.email({ email, password });
      setLoading(false);
    } else {
      setLoading(true);
      await authClient.signUp.email({ email, password, name: email });
      setLoading(false);
    }
  };
  return (
    <div className="bg-card flex h-full w-md flex-col items-center justify-center gap-2 p-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-input w-full rounded-md border border-gray-300 p-2"
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-input w-full rounded-md border border-gray-300 p-2"
        placeholder="Password"
      />
      <Button onClick={handleSubmit} className="w-full" disabled={loading}>
        {type === "login" ? "Login" : "Register"}
      </Button>
      <Button
        onClick={() =>
          setType((current) => (current === "login" ? "register" : "login"))
        }
        variant="link"
      >
        {type === "login"
          ? "Don't have an account? Register"
          : "Already have an account? Login"}
      </Button>
    </div>
  );
};
