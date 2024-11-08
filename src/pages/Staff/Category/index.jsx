import React, { useState } from "react";
import { ChartColumnBig } from "lucide-react";
import Progress from "./Progress";
import GetAll from "./GetAll";
import AddNew from "./AddNew";
import UpdateCategory from "./UpdateCategory";
function CategoryManagement() {
  const [currentProgress, setCurrentProgress] = useState("Get All");
  const [currCategory, setCurrCategory] = useState({});
  const handleChangeProgress = (newProgress) => {
    setCurrentProgress(newProgress);
  };
  const handleSetCurrentCategory = (category) => {
    setCurrCategory(category);
  };
  return (
    <div className="flex flex-col justify-start items-start gap-8 p-8 w-full">
      <div className="flex flex-row justify-start items-center gap-3 ">
        <ChartColumnBig />
        <span className="text-2xl font-semibold">Category Mangement</span>
      </div>
      <div className="w-full">
        <Progress
          currentProgress={currentProgress}
          handleChangeProgress={handleChangeProgress}
        />
      </div>
      <div className="bg-white flex flex-col justify-start items-start w-full border-[1px] rounded-sm">
        {currentProgress === "Get All" ? (
          <GetAll
            handleSetCurrentCategory={handleSetCurrentCategory}
            handleChangeProgress={handleChangeProgress}
          />
        ) : currentProgress === "Add New Category" ? (
          <AddNew handleChangeProgress={handleChangeProgress} />
        ) : (
          <UpdateCategory
            currCategory={currCategory}
            handleChangeProgress={handleChangeProgress}
          />
        )}
      </div>
    </div>
  );
}

export default CategoryManagement;
