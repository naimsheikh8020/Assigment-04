import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { CategoryRoutes } from "../modules/category/category.route.js";
import { UserRoutes } from "../modules/admin/user/user.route.js";
import { GearRoutes } from "../modules/provider/gear/gear.route.js";
import { PublicGearRoutes } from "../modules/gear/gear.route.js";
import { RentalRoutes } from "../modules/rental/rental.route.js";
import { PaymentRoutes } from "../modules/payment/payment.route.js";
import { OrderRoutes } from "../modules/provider/order/order.route.js";
import { ReviewRoutes } from "../modules/review/review.route.js";
import { ProfileRoutes } from "../modules/profile/profile.route.js";
import { AdminGearRoutes } from "../modules/admin/gear/gear.route.js";
import { AdminRentalRoutes } from "../modules/admin/rental/rental.route.js";

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
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/provider/orders",
    route: OrderRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/profile",
    route: ProfileRoutes,
  },
  {
    path: "/admin/gears",
    route: AdminGearRoutes,
  },
  {
    path: "/admin/rentals",
    route: AdminRentalRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
