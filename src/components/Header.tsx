import React from "react";

const Header = (props: {
  width: number;
  height: number;

  parentRef: React.MutableRefObject<HTMLElement | null>;
  top?: boolean;
}) => {
  let { height, width } = props;
  const { parentRef } = props;

  const element = parentRef.current;
  if (element && height === 0 && width === 0) {
    const size = element?.getBoundingClientRect();
    height = size.height;
    width = size.width;
  }

  const minDim = Math.min(height - 252, width);

  return (
    <header
      className="border-2 w-full border-black bg-red-300 rounded-t-lg font-mono text-2xl shadow-custom pt-3 pb-3 box-content md:pl-6 md:pr-6"
      style={{ width: minDim }}
    >
      <h1 className="pl-3 md:pl-0">HASAMI SHOGI</h1>
    </header>
  );
};

export default Header;
