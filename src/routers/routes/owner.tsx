import { AddDishPage } from "../../pages/owner/add-dish";
import { AddRestaurantPage } from "../../pages/owner/add-restaurant";
import { MyRestaurantPage } from "../../pages/owner/my-restaurant";
import { MyRestaurantsPage } from "../../pages/owner/my-restaurants";

export const ownerRoutes = [
  { path: "/", component: <MyRestaurantsPage /> },
  { path: "/add-restaurant", component: <AddRestaurantPage /> },
  { path: "/restaurants/:id", component: <MyRestaurantPage /> },
  { path: "/restaurants/:restaurantId/add-dish", component: <AddDishPage /> },
];
