"use client";

import { useEffect } from "react";
import paginationSlice from "../redux/paginationSlice";
import fetchMiddleware from "../redux/fetchMovieMiddleware";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

const actions = paginationSlice.actions;

const Pagination = () => {
  const { pageNo } = useAppSelector((store) => store.paginationState);
  const dispatch = useAppDispatch();

  const handlePrevious = () => {
    if (pageNo > 1) dispatch(actions.handlePrevious());
  };

  const handleNext = () => {
    dispatch(actions.handleNext());
  };

  useEffect(() => {
    dispatch(fetchMiddleware(pageNo));
  }, [pageNo, dispatch]);

  return (
    <div className="flex justify-center items-center gap-4 p-4 w-full mt-8">
      
      {/* Left Arrow */}
      <button
        type="button"
        aria-label="Previous page"
        disabled={pageNo === 1}
        className={`w-12 h-12 flex items-center justify-center text-white text-xl rounded-full cursor-pointer
        ${pageNo === 1 ? "bg-transparent" : "bg-black"}`}
        onClick={handlePrevious}
      >
        <i className={`fa-solid fa-arrow-left ${pageNo === 1 ? "invisible" : ""}`}></i>
      </button>

      {/* Page Number */}
      <div aria-live="polite" className="w-12 h-12 flex items-center justify-center bg-black text-white text-lg font-semibold rounded-full">
        {pageNo}
      </div>

      {/* Right Arrow */}
      <button
        type="button"
        aria-label="Next page"
        disabled={pageNo >= 500}
        className="w-12 h-12 flex items-center justify-center bg-black text-white text-xl rounded-full cursor-pointer"
        onClick={handleNext}
      >
        <i className="fa-solid fa-arrow-right"></i>
      </button>

    </div>
  );
};

export default Pagination;