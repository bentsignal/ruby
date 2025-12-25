import type { ReactNode } from "react";

import type { PublicProfile } from "@acme/convex/types";
import { createContext } from "@acme/context";

const { Context, useContext } = createContext<{
  id: string;
  name: string;
  image: string | undefined;
  username: string;
}>({
  displayName: "ProfileContext",
});

const Provider = ({
  profile,
  children,
}: {
  profile: PublicProfile;
  children: ReactNode;
}) => {
  const { _id: id, name, image, username } = profile;
  const contextValue = { id, name, image, username };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
