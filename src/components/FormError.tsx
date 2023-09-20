interface IProps {
  errorMessage: string;
}

export const FormError = ({ errorMessage }: IProps) => {
  return (
    <span role="alert" className="font-medium text-red-500">
      {errorMessage}
    </span>
  );
};
