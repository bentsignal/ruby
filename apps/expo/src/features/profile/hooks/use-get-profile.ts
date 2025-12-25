import { useQuery } from "@tanstack/react-query";
import { useConvex } from "convex/react";

import type { Id } from "@acme/convex/model";
import { api } from "@acme/convex/api";

const useGetProfile = ({ profileId }: { profileId?: Id<"profiles"> }) => {
  const convex = useConvex();
  const { data: profile } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: async () => {
      if (!profileId) return null;
      return await convex.query(api.profile.getProfile, { profileId });
    },
  });
  return profile;
};

export { useGetProfile };
