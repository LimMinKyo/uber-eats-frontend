import { DishOptionInputType } from "../gql/graphql";

interface IProps {
  children?: React.ReactNode;
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: DishOptionInputType[] | null;
  orderStarted?: boolean;
  isSelected?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, option: any) => void;
}

export const Dish = ({
  children: dishOptions,
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  options,
  orderStarted = false,
  isSelected,
  addItemToOrder,
  removeFromOrder,
  addOptionToItem,
}: IProps) => {
  const onClick = () => {
    if (!orderStarted) {
      return;
    }

    if (!isSelected && addItemToOrder) {
      addItemToOrder(id);
    }
    if (isSelected && removeFromOrder) {
      removeFromOrder(id);
    }
  };

  return (
    <div
      className={`px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium flex items-center">
          {name}{" "}
          {orderStarted && (
            <button
              className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                isSelected ? "bg-red-500" : " bg-lime-600"
              }`}
              onClick={onClick}
            >
              {isSelected ? "Remove" : "Add"}
            </button>
          )}
        </h3>
        <p className="font-medium">{description}</p>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          <div className="grid gap-2 justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};
