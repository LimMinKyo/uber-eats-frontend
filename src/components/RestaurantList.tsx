import { Restaurant } from "../gql/graphql";
import { Restaurant as RestaurantComponent } from "./Restaurant";

interface IProps {
  restaurants: Restaurant[];
}

export const RestaurantList = ({ restaurants }: IProps) => {
  return (
    <div className="mt-16">
      {restaurants.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
          {restaurants.map((restaurant) => (
            <RestaurantComponent
              key={restaurant.id}
              id={restaurant.id}
              coverImg={restaurant.coverImg}
              name={restaurant.name}
              categoryName={restaurant.category?.name}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          No Restaurants.
        </div>
      )}
    </div>
  );
};
