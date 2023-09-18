import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CategoryInput, CategoryOutput } from "../../gql/graphql";
import { RestaurantList } from "../../components/RestaurantList";
import { Pagination } from "../../components/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { Helmet } from "react-helmet-async";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IParams {
  slug: string;
}

export const CategoryPage = () => {
  const { page, onClickNextPage, onClickPrevPage } = usePagination();
  const { slug } = useParams<IParams>();
  const { data, loading } = useQuery<
    { category: CategoryOutput },
    { input: CategoryInput }
  >(CATEGORY_QUERY, {
    variables: {
      input: {
        page: 1,
        slug,
      },
    },
  });

  return (
    <div>
      <Helmet>
        <title>Search | Uber Eats</title>
      </Helmet>
      <div className="bg-gray-800 w-full py-40 flex flex-col items-center justify-center">
        <div className="text-white text-xl mb-4">Category:</div>
        <input
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
          value={slug}
          readOnly
        />
      </div>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          <RestaurantList restaurants={data?.category.restaurants || []} />
          <Pagination
            page={page}
            totalPages={data?.category.totalPages || 1}
            onClickNextPage={onClickNextPage}
            onClickPrevPage={onClickPrevPage}
          />
        </div>
      )}
    </div>
  );
};
