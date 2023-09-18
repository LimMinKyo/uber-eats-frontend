import { Restaurant } from "../gql/graphql";
import { Restaurant as RestaurantComponent } from "./Restaurant";

interface IProps {
  restaurants: Restaurant[];
}

export const RestaurantList = ({ restaurants }: IProps) => {
  return (
    <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
      {restaurants.map((restaurant) => (
        <RestaurantComponent
          key={restaurant.id}
          coverImg={restaurant.coverImg}
          name={restaurant.name}
          categoryName={restaurant.category?.name}
        />
      ))}
    </div>
  );
};
