import { gql, useMutation } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";
import { Button } from "../../components/Button";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";
import {
  Control,
  UseFormRegister,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { CreateDishInput, CreateDishOutput } from "../../gql/graphql";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  options: {
    name: string;
    extra: string;
    choices: {
      name: string;
      extra: string;
    }[];
  }[];
}

export const AddDishPage = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();
  const [createDishMutation, { loading }] = useMutation<
    { createDish: CreateDishOutput },
    { input: CreateDishInput }
  >(CREATE_DISH_MUTATION, {
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            restaurantId: +restaurantId,
          },
        },
      },
    ],
  });
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    control,
  } = useForm<IForm>({
    mode: "onChange",
  });
  const { fields, append, remove } = useFieldArray({
    name: "options",
    control,
  });
  const onSubmit = () => {
    const { name, price, description, options } = getValues();
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: options.map((value) => ({
            ...value,
            extra: +value.extra,
            choices: value.choices.map((choice) => ({
              ...choice,
              extra: +choice.extra,
            })),
          })),
        },
      },
    });
    history.goBack();
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Nuber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Add Dish</h4>
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
          {...register("price", { required: "Price is required." })}
          className="input"
          type="number"
          min={0}
          placeholder="Price"
        />
        <input
          {...register("description", { required: "Description is required." })}
          className="input"
          type="text"
          placeholder="Description"
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={() => append({ name: "", extra: "", choices: [] })}
            className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
          >
            Add Dish Option
          </span>
          {fields.length !== 0 &&
            fields.map((field, index) => (
              <div key={field.id}>
                <div className="mt-5 flex gap-3">
                  <input
                    {...register(`options.${index}.name`)}
                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                    type="text"
                    placeholder="Option Name"
                  />
                  <input
                    {...register(`options.${index}.extra`)}
                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                    type="number"
                    min={0}
                    placeholder="Option Extra"
                  />
                  <button
                    type="button"
                    className="cursor-pointer text-white bg-red-500 py-3 px-4"
                    onClick={() => remove(index)}
                  >
                    Delete Option
                  </button>
                </div>
                <Choices
                  optionIndex={index}
                  register={register}
                  control={control}
                />
              </div>
            ))}
        </div>
        <Button loading={loading} canClick={isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};

const Choices = ({
  optionIndex,
  control,
  register,
}: {
  optionIndex: number;
  control: Control<IForm>;
  register: UseFormRegister<IForm>;
}) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `options.${optionIndex}.choices`,
  });

  return (
    <div className="ml-5">
      {fields.length !== 0 &&
        fields.map((field, index) => (
          <div key={field.id} className="mt-5 flex gap-3">
            <input
              {...register(`options.${optionIndex}.choices.${index}.name`)}
              className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
              type="text"
              placeholder="Choice Name"
            />
            <input
              {...register(`options.${optionIndex}.choices.${index}.extra`)}
              className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
              type="number"
              min={0}
              placeholder="Choice Extra"
            />
            <button
              type="button"
              className="cursor-pointer text-white bg-red-500 py-3 px-4"
              onClick={() => remove(index)}
            >
              Delete Choice
            </button>
          </div>
        ))}
      <button
        type="button"
        className="cursor-pointer text-white bg-lime-500 py-3 px-4 mt-5 bg-"
        onClick={() => append({ name: "", extra: "" })}
      >
        Add Choice
      </button>
    </div>
  );
};
