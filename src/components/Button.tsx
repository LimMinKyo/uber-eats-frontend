interface IProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button = ({ canClick, loading, actionText }: IProps) => (
  <button
    className={`text-lg font-medium focus:outline-none text-white py-4  transition-colors ${
      canClick
        ? "bg-lime-600 hover:bg-lime-700"
        : "bg-gray-300 pointer-events-none "
    }`}
  >
    {loading ? "Loading..." : actionText}
  </button>
);
