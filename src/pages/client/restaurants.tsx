import { gql, useQuery } from "@apollo/client";
import {
  AllCategoriesOutput,
  RestaurantsInput,
  RestaurantsOutput,
} from "../../gql/graphql";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { Pagination } from "../../components/Pagination";
import { RestaurantList } from "../../components/RestaurantList";
import { usePagination } from "../../hooks/usePagination";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
    allRestaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IForm {
  searchTerm: string;
}

export const RestaurantsPage = () => {
  const { page, onClickNextPage, onClickPrevPage } = usePagination();
  const { data, loading } = useQuery<
    { allCategories: AllCategoriesOutput; allRestaurants: RestaurantsOutput },
    { input: RestaurantsInput }
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const { register, handleSubmit, getValues } = useForm<IForm>();
  const history = useHistory();

  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };

  return (
    <div>
      <Helmet>
        <title>Home | Uber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-sm mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <Link key={category.id} to={`/category/${category.slug}`}>
                <div className="flex flex-col group items-center cursor-pointer">
                  <div
                    className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                    style={{ backgroundImage: `url(${category.coverImg})` }}
                  />
                  <span className="mt-1 text-sm text-center font-medium">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <RestaurantList restaurants={data?.allRestaurants.results || []} />
          <Pagination
            page={page}
            totalPages={data?.allRestaurants.totalPages || 1}
            onClickNextPage={onClickNextPage}
            onClickPrevPage={onClickPrevPage}
          />
        </div>
      )}
    </div>
  );
};
