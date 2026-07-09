import { Router } from "express";
import { AuthRoutes } from "../src/modules/auth/auth.routes";
import { CategoryRoutes } from "../src/modules/category/category.route";
import { UserRoutes } from "../src/modules/admin/user/user.route";
import { GearRoutes } from "../src/modules/provider/gear/gear.route";
import { PublicGearRoutes } from "../src/modules/gear/gear.route";
import { RentalRoutes } from "../src/modules/rental/rental.route";
import { PaymentRoutes } from "../src/modules/payment/payment.route";
import { OrderRoutes } from "../src/modules/provider/order/order.route";
import { ReviewRoutes } from "../src/modules/review/review.route";
import { ProfileRoutes } from "../src/modules/profile/profile.route";
import { AdminGearRoutes } from "../src/modules/admin/gear/gear.route";
import { AdminRentalRoutes } from "../src/modules/admin/rental/rental.route";

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
