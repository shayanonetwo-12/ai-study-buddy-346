import { createFileRoute, Outlet } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    let user = data.user;
    if (!user) {
      const { data: signIn, error } = await supabase.auth.signInAnonymously();
      if (error || !signIn.user) throw new Error(error?.message ?? "Could not start session");
      user = signIn.user;
    }
    return { user };
  },
  component: () => <Outlet />,
});
