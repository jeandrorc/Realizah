import { defineMiddlewares } from '@medusajs/framework/http';

/**
 * Global API middleware configuration.
 * Route-specific middleware utilities live in ./middleware-utils/
 */
export default defineMiddlewares({
  routes: [],
});
