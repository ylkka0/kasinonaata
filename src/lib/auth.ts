import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySession = async (currentUser: User | null) => {
      if (!mounted) return;
      setLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id)
        .eq("role", "admin")
        .maybeSingle();

      if (mounted) {
        setIsAdmin(!error && !!data);
        setLoading(false);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const currentUser = session?.user ?? null;
      setTimeout(() => void applySession(currentUser), 0);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      await applySession(currentUser);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, loading };
}
