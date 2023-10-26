import { Maybe } from "graphql/jsutils/Maybe";

interface IProps {
  page: number;
  totalPages?: Maybe<number>;
  onClickPrevPage: () => void;
  onClickNextPage: () => void;
}

export const Pagination = ({
  page,
  totalPages,
  onClickNextPage,
  onClickPrevPage,
}: IProps) => {
  return (
    totalPages && (
      <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
        {page > 1 ? (
          <button
            onClick={onClickPrevPage}
            className="focus:outline-none font-medium text-2xl"
          >
            &larr;
          </button>
        ) : (
          <div></div>
        )}
        <span>
          Page {page} of {totalPages}
        </span>
        {page !== totalPages ? (
          <button
            onClick={onClickNextPage}
            className="focus:outline-none font-medium text-2xl"
          >
            &rarr;
          </button>
        ) : (
          <div></div>
        )}
      </div>
    )
  );
};
