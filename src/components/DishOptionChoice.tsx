interface IProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  addChoiceToOption: () => void;
  removeChoiceToOption: () => void;
}

export const DishOptionChoice = ({
  isSelected,
  name,
  extra,
  addChoiceToOption,
  removeChoiceToOption,
}: IProps) => {
  const onClick = () => {
    if (isSelected) {
      removeChoiceToOption();
    } else {
      addChoiceToOption();
    }
  };

  return (
    <span
      onClick={onClick}
      className={`border px-2 py-1 ${
        isSelected ? "border-gray-800" : "hover:border-gray-800"
      }`}
    >
      <span className="mr-2">{name}</span>
      {extra ? <span className="text-sm opacity-75">(${extra})</span> : <></>}
    </span>
  );
};
