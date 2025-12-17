import Generate from "@/components/generatePage/Generate";
import TitleNav from "@/components/bars/title-nav";
import { Suspense } from "react";
import LumaSpin from "@/components/21st/LumaSpin";

const Page = () => {
  return (
    <div className="h-screen flex flex-col">
      <TitleNav text="Generate PDF" />
      <div className="flex-1 overflow-auto">
        <Suspense
          fallback={
            <div className="h-full w-full items-center justify-center">
              <LumaSpin />
            </div>
          }
        >
          <Generate />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
