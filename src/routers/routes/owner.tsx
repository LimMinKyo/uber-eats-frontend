import { AddRestaurantPage } from "../../pages/owner/add-restaurant";
import { MyRestaurantsPage } from "../../pages/owner/my-restaurants";

export const ownerRoutes = [
  { path: "/", component: <MyRestaurantsPage /> },
  { path: "/add-restaurant", component: <AddRestaurantPage /> },
];
