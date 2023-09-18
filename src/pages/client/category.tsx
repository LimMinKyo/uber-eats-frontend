import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CategoryInput, CategoryOutput } from "../../gql/graphql";

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
  const { slug } = useParams<IParams>();
  const { data } = useQuery<
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
  console.log(data);

  return <h1>Category</h1>;
};
