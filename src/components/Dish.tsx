import { DishOptionInputType } from "../gql/graphql";

interface IProps {
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: DishOptionInputType[] | null;
}

export const Dish = ({
  description,
  name,
  price,
  isCustomer = false,
  options,
}: IProps) => {
  return (
    <div className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all">
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <p className="font-medium">{description}</p>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          {options?.map((option, index) => (
            <span className="flex items-center" key={index}>
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
