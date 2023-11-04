import { DishChoice } from "../gql/graphql";

interface IProps {
  children: React.ReactNode;
  dishId: number;
  isSelected: boolean;
  name: string;
  extra?: number | null;
  choices: DishChoice[];
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption = ({
  children,
  dishId,
  isSelected,
  name,
  extra,
  choices,
  addOptionToItem,
  removeOptionFromItem,
}: IProps) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className={`w-fit border px-2 py-1 ${
          isSelected ? "border-gray-800" : "hover:border-gray-800"
        }`}
      >
        <span className="mr-2">{name}</span>
        {extra ? <span className="text-sm opacity-75">(${extra})</span> : <></>}
      </div>
      {isSelected && choices?.length !== 0 && (
        <div className="ml-5 mt-3">
          <h5 className="mb-3 font-medium">Choice Options:</h5>
          <div className="flex flex-col gap-2 w-fit">{children}</div>
        </div>
      )}
    </>
  );
};
