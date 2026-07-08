import { Router } from "express";
import { AuthRoutes } from "../src/modules/auth/auth.routes";
import { CategoryRoutes } from "../src/modules/category/category.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
    
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
