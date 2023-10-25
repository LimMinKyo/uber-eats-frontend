import { gql, useApolloClient, useMutation } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/Button";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "../../gql/graphql";
import { FormError } from "../../components/FormError";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { REST_API_URL } from "../../env";

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IForm {
  name: string;
  address: string;
  categoryName: string;
  fileList: FileList;
}

export const AddRestaurantPage = () => {
  const [createRestaurantMutation, { data }] = useMutation<
    { createRestaurant: CreateRestaurantOutput },
    { input: CreateRestaurantInput }
  >(CREATE_RESTAURANT_MUTATION);
  const history = useHistory();
  const client = useApolloClient();
  const {
    register,
    getValues,
    formState: { isValid },
    handleSubmit,
  } = useForm<IForm>({
    mode: "onChange",
  });
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    try {
      setLoading(true);
      const { address, categoryName, fileList, name } = getValues();
      const file = fileList[0];
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${REST_API_URL}/uploads`, {
        method: "POST",
        body: formData,
      });
      const { url: coverImg } = await response.json();
      createRestaurantMutation({
        variables: {
          input: {
            address,
            categoryName,
            coverImg,
            name,
          },
        },
        onCompleted({ createRestaurant: { ok, restaurantId } }) {
          if (ok) {
            const { name, categoryName, address } = getValues();
            const queryResult = client.readQuery({
              query: MY_RESTAURANTS_QUERY,
            });
            client.writeQuery({
              query: MY_RESTAURANTS_QUERY,
              data: {
                myRestaurants: {
                  ...queryResult.myRestaurants,
                  restaurants: [
                    {
                      address,
                      category: {
                        name: categoryName,
                        __typename: "Category",
                      },
                      coverImg,
                      id: restaurantId,
                      isPromoted: false,
                      name,
                      __typename: "Restaurant",
                    },
                    ...queryResult.myRestaurants.restaurants,
                  ],
                },
              },
            });
            history.push("/");
          }
        },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Restaurant</h4>{" "}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      >
        <input
          {...register("name", { required: "Name is required." })}
          className="input"
          type="text"
          placeholder="Name"
        />
        <input
          {...register("address", { required: "Address is required." })}
          className="input"
          type="text"
          placeholder="Address"
        />
        <input
          {...register("categoryName", {
            required: "Category Name is required.",
          })}
          className="input"
          type="text"
          placeholder="Category Name"
        />
        <div>
          <input
            {...register("fileList", { required: true })}
            type="file"
            accept="image/*"
          />
        </div>
        <Button
          loading={loading}
          canClick={isValid}
          actionText="Create Restaurant"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </div>
  );
};
