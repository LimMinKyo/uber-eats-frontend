import { gql, useMutation, useQuery } from "@apollo/client";
import {
  CreateOrderInput,
  CreateOrderItemInput,
  CreateOrderOutput,
  RestaurantInput,
  RestaurantOutput,
} from "../../gql/graphql";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Dish } from "../../components/Dish";
import { useState } from "react";
import { DishOption } from "../../components/DishOption";
import { DishOptionChoice } from "../../components/DishOptionChoice";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
      orderId
    }
  }
`;

export const RestaurantPage = () => {
  const params = useParams<{ id: string }>();
  const history = useHistory();
  const { data } = useQuery<
    {
      restaurant: RestaurantOutput;
    },
    { input: RestaurantInput }
  >(RESTAURANT_QUERY, { variables: { input: { restaurantId: +params.id } } });

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };

  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };

  const getIsSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  const addItemToOrder = (dishId: number) => {
    if (getIsSelected(dishId)) {
      return;
    }

    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };

  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };

  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!getIsSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const isHasOption = Boolean(
        oldItem.options?.find((aOption) => aOption.name === optionName)
      );

      if (!isHasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          ...current,
          {
            dishId,
            options: [...(oldItem.options || []), { name: optionName }],
          },
        ]);
      }
    }
  };

  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!getIsSelected(dishId)) {
      return;
    }

    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems((current) => [
        ...current,
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
      ]);
      return;
    }
  };

  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };

  const getIsOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };

  const [createOrderMutation, { loading: createOrderMutationLoading }] =
    useMutation<
      { createOrder: CreateOrderOutput },
      { input: CreateOrderInput }
    >(CREATE_ORDER_MUTATION, {
      onCompleted: (data) => {
        const {
          createOrder: { ok, orderId },
        } = data;
        if (ok) {
          history.push(`/orders/${orderId}`);
        }
      },
    });

  const triggerConfirmOrder = () => {
    if (createOrderMutationLoading) {
      return;
    }

    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }

    const ok = window.confirm("You are about to place an order");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };

  return (
    <div>
      <Helmet>
        <title>{data?.restaurant.restaurant?.name || ""} | Uber Eats</title>
      </Helmet>
      <div
        className="bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-4/12 py-8 pl-48">
          <h4 className="text-4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>
      <div className="container pb-32 flex flex-col items-end mt-20">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 !bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}

        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              id={dish.id}
              orderStarted={orderStarted}
              key={index}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              isSelected={getIsSelected(dish.id)}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  dishId={dish.id}
                  isSelected={getIsOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  choices={option.choices || []}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                >
                  {option.choices?.map((choice, index) => (
                    <DishOptionChoice
                      key={index}
                      isSelected={Boolean(
                        getItem(dish.id)?.options.find(
                          (aOption) => aOption.name === option.name
                        )?.choice === choice.name
                      )}
                      name={choice.name}
                      extra={choice.extra}
                      addChoiceToOption={() => {
                        if (!getIsSelected(dish.id)) {
                          return;
                        }

                        const oldItem = getItem(dish.id);
                        if (oldItem) {
                          removeFromOrder(dish.id);
                          setOrderItems((current) => [
                            ...current,
                            {
                              dishId: dish.id,
                              options:
                                oldItem.options?.map((oldOption) => {
                                  if (oldOption.name === option.name) {
                                    return {
                                      name: oldOption.name,
                                      choice: choice.name,
                                    };
                                  }
                                  return {
                                    name: oldOption.name,
                                  };
                                }) || [],
                            },
                          ]);
                        }
                      }}
                      removeChoiceToOption={() => {
                        if (!getIsSelected(dish.id)) {
                          return;
                        }
                        const oldItem = getItem(dish.id);
                        if (oldItem) {
                          removeFromOrder(dish.id);
                          setOrderItems((current) => [
                            ...current,
                            {
                              dishId: dish.id,
                              options: oldItem.options?.map((oldOption) => {
                                if (oldOption.name === option.name) {
                                  return { name: oldOption.name };
                                }
                                return oldOption;
                              }),
                            },
                          ]);
                        }
                      }}
                    />
                  ))}
                </DishOption>
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
