import { httpRouter } from "convex/server";

import { authComponent, authCorsAllowedOrigins, createAuth } from "./auth";
import { upload } from "./files/http";
import { urls } from "./urls";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth, {
  cors: {
    allowedOrigins: [urls.web, ...authCorsAllowedOrigins],
  },
});

http.route({
  path: "/api/files/upload",
  method: "POST",
  handler: upload,
});

http.route({
  path: "/api/files/upload",
  method: "OPTIONS",
  handler: upload,
});

export default http;
