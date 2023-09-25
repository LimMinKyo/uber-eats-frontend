import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { MyRestaurantsOutput } from "../../gql/graphql";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { RestaurantList } from "../../components/RestaurantList";

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurantsPage = () => {
  const { data } = useQuery<{ myRestaurants: MyRestaurantsOutput }>(
    MY_RESTAURANTS_QUERY
  );

  return (
    <div>
      <Helmet>
        <title>My Restaurants | Uber Eats</title>
      </Helmet>
      <div className="max-w-screen-2xl mx-auto mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {data?.myRestaurants.ok &&
        data.myRestaurants.restaurants.length === 0 ? (
          <>
            <h4 className="text-xl mb-5">You have no restaurants.</h4>
            <Link
              className="text-lime-600 hover:underline"
              to="/add-restaurant"
            >
              Create one &rarr;
            </Link>
          </>
        ) : (
          <RestaurantList restaurants={data?.myRestaurants.restaurants || []} />
        )}
      </div>
    </div>
  );
};
