import { Router } from "express";
import { AuthRoutes } from "../src/modules/auth/auth.routes";
import { CategoryRoutes } from "../src/modules/category/category.route";
import { UserRoutes } from "../src/modules/admin/user/user.route";
import { GearRoutes } from "../src/modules/provider/gear/gear.route";
import { PublicGearRoutes } from "../src/modules/gear/gear.route";
import { RentalRoutes } from "../src/modules/rental/rental.route";

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
  {
    path: "/admin/users",
    route: UserRoutes,
  },
  {
    path: "/provider/gear",
    route: GearRoutes,
  },
  {
    path: "/gear",
    route: PublicGearRoutes,
  },
  {
  path: "/rentals",
  route: RentalRoutes,
},
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
