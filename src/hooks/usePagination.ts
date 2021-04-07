import { useState } from "react";



export default function usePagination({ docCountDefault = 0, offsetDefault = 0, perPageDefault = 5 } = {}) {
  const [perPage, setPerPage] = useState(perPageDefault)
  const [offset, setOffset] = useState(offsetDefault)
  const [docCount, setDocCount] = useState(docCountDefault)


  return {
    offset,
    perPage,
    currentPage: Math.floor(offset / perPage) + 1,
    nextPage() {
      setOffset(Math.min(offset + perPage, docCount));
    },
    prevPage() {
      setOffset(Math.max(offset - perPage, 0));
    },
    nextPageEnable: offset + perPage < docCount,
    prevPageEnable: offset > 0,
    jumpTo(page: number) {
      setOffset(Math.max(0, Math.min(docCount, (page - 1) * perPage)));
    },
    setPerPage(newPerPage: number) {
      setPerPage(newPerPage)
      setOffset(Math.floor(offset / newPerPage) * newPerPage);
    },
    setDocCount(newDocCount: number) {
      setDocCount(newDocCount)
      if (offset >= newDocCount) {
        setOffset(Math.floor(newDocCount / perPage) * perPage);
      }
    },
  }
}