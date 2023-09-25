interface IProps {
  description: string;
  name: string;
  price: number;
}

export const Dish = ({ description, name, price }: IProps) => {
  return (
    <div className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all">
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <p className="font-medium">{description}</p>
      </div>
      <span>${price}</span>
    </div>
  );
};
