import { gql, useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import {
  GetOrderInput,
  GetOrderOutput,
  Order,
  OrderStatus,
  UpdateOrderInput,
  UpdateOrderOutput,
  UserRole,
} from "../gql/graphql";
import { Helmet } from "react-helmet-async";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useEffect } from "react";
import { useMe } from "../hooks/useMe";

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const UPDATE_ORDER_MUTATION = gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  id: string;
}

export const OrderPage = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();
  const { data, subscribeToMore } = useQuery<
    { getOrder: GetOrderOutput },
    { input: GetOrderInput }
  >(GET_ORDER_QUERY, {
    variables: {
      input: {
        orderId: +params.id,
      },
    },
  });
  const [updateOrderMutation] = useMutation<
    { updateOrder: UpdateOrderOutput },
    { input: UpdateOrderInput }
  >(UPDATE_ORDER_MUTATION);

  const onClickButton = (newStatus: OrderStatus) => {
    updateOrderMutation({
      variables: {
        input: {
          orderId: +params.id,
          status: newStatus,
        },
      },
    });
  };

  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore<{ orderUpdates: Order }, { input: GetOrderInput }>({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            orderId: +params.id,
          },
        },
        updateQuery(prev, { subscriptionData: { data } }) {
          if (!data) {
            return prev;
          }
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data?.getOrder.ok, params.id, subscribeToMore]);

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          {userData?.me.role === UserRole.Client && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.getOrder.order?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onClickButton(OrderStatus.Cooking)}
                  className="btn"
                >
                  Accept Order
                </button>
              )}
              {data?.getOrder.order?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onClickButton(OrderStatus.Cooked)}
                  className="btn"
                >
                  Order Cooked
                </button>
              )}
              {data?.getOrder.order?.status !== OrderStatus.Cooking &&
                data?.getOrder.order?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                    Status: {data?.getOrder.order?.status}
                  </span>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
