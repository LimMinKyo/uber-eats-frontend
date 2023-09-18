import { useState } from "react";

export const usePagination = () => {
  const [page, setPage] = useState(1);

  const onClickNextPage = () => setPage((current) => current + 1);
  const onClickPrevPage = () => setPage((current) => current - 1);

  return { page, onClickNextPage, onClickPrevPage };
};
