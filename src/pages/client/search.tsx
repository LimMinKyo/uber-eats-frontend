import { gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from "../../gql/graphql";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const SearchPage = () => {
  const location = useLocation();
  const history = useHistory();
  const [searchRestaurant, { loading, data, called }] = useLazyQuery<
    { searchRestaurant: SearchRestaurantOutput },
    { input: SearchRestaurantInput }
  >(SEARCH_RESTAURANT);
  useEffect(() => {
    const query = location.search.split("?term=")[1];
    if (!query) {
      return history.replace("/");
    }
    searchRestaurant({
      variables: {
        input: {
          page: 1,
          query,
        },
      },
    });
  }, [history, location, searchRestaurant]);
  console.log(loading, data, called);

  return (
    <div>
      <Helmet>
        <title>Search | Nuber Eats</title>
      </Helmet>
      <h1>Search page</h1>
    </div>
  );
};
