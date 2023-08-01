interface IProps {
  errorMessage: string;
}

export const FormError = ({ errorMessage }: IProps) => {
  return <span className="font-medium text-red-500">{errorMessage}</span>;
};
