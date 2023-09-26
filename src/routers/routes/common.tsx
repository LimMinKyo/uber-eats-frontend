import { OrderPage } from "../../pages/order";
import { ConfirmEmailPage } from "../../pages/user/confirm-email";
import { UpdateProfilePage } from "../../pages/user/update-profile";

export const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmailPage />,
  },
  {
    path: "/update-profile",
    component: <UpdateProfilePage />,
  },
  { path: "/orders/:id", component: <OrderPage /> },
];
