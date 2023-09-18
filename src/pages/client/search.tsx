import { gql, useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from "../../gql/graphql";
import { RestaurantList } from "../../components/RestaurantList";
import { Pagination } from "../../components/Pagination";
import { usePagination } from "../../hooks/usePagination";

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
  const { page, onClickNextPage, onClickPrevPage } = usePagination();
  const query = decodeURIComponent(location.search.split("?term=")[1]);

  useEffect(() => {
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
  }, [history, location, searchRestaurant, query]);
  console.log(loading, data, called);

  return (
    <div>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-40 flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">Searched:</div>
        <input
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
          value={query}
          readOnly
        />
      </div>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <RestaurantList
            restaurants={data?.searchRestaurant.restaurants || []}
          />
          <Pagination
            page={page}
            totalPages={data?.searchRestaurant.totalPages || 1}
            onClickNextPage={onClickNextPage}
            onClickPrevPage={onClickPrevPage}
          />
        </div>
      )}
    </div>
  );
};
