"use client";

const LumaSpin = () => {
  return (
    <div className="relative aspect-square w-[65px]">
      <span className="animate-luma-spin absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-primary" />
      <span className="animate-luma-spin absolute rounded-[50px] shadow-[inset_0_0_0_3px] shadow-primary [animation-delay:-1.25s]" />
    </div>
  );
};

export default LumaSpin;

