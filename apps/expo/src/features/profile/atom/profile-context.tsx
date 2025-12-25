import type { ReactNode } from "react";

import type { Doc } from "@acme/convex/model";
import { createContext } from "@acme/context";

const { Context, useContext } = createContext<{
  id: string;
  name: string;
  image: string | undefined;
}>({
  displayName: "ProfileContext",
});

const Provider = ({
  profile,
  children,
}: {
  profile: Doc<"profiles">;
  children: ReactNode;
}) => {
  const id = profile._id;
  const name = profile.name;
  const image = profile.image;
  const contextValue = { id, name, image };
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export { Provider, Context, useContext };
