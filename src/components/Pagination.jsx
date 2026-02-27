import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import paginationSlice from "../redux/paginationSlice";
import fetchMiddleware from "../redux/fetchMovieMiddleware";

const actions = paginationSlice.actions;

const Pagination = () => {
  const { pageNo } = useSelector((store) => store.paginationState);
  const dispatch = useDispatch();

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
      <div
        className={`w-12 h-12 flex items-center justify-center text-white text-xl rounded-full cursor-pointer
        ${pageNo === 1 ? "bg-transparent" : "bg-black"}`}
        onClick={handlePrevious}
      >
        <i className={`fa-solid fa-arrow-left ${pageNo === 1 ? "invisible" : ""}`}></i>
      </div>

      {/* Page Number */}
      <div className="w-12 h-12 flex items-center justify-center bg-black text-white text-lg font-semibold rounded-full">
        {pageNo}
      </div>

      {/* Right Arrow */}
      <div
        className="w-12 h-12 flex items-center justify-center bg-black text-white text-xl rounded-full cursor-pointer"
        onClick={handleNext}
      >
        <i className="fa-solid fa-arrow-right"></i>
      </div>

    </div>
  );
};

export default Pagination;