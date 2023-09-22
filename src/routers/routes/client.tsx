import { CategoryPage } from "../../pages/client/category";
import { RestaurantPage } from "../../pages/client/restaurant";
import { RestaurantsPage } from "../../pages/client/restaurants";
import { SearchPage } from "../../pages/client/search";

export const clientRoutes = [
  { path: "/", component: <RestaurantsPage /> },
  { path: "/search", component: <SearchPage /> },
  { path: "/category/:slug", component: <CategoryPage /> },
  { path: "/restaurants/:id", component: <RestaurantPage /> },
];
