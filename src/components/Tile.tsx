interface Props {
  x: number;
  y: number;
  highlight?: boolean;
  pieceColor?: string;
}

const Tile = (props: Props) => {
  const { x, y, pieceColor, highlight } = props;
  const className = `box-content border-black border-2 ${
    (y === 1 || y === 5) && "border-t-8"
  } ${highlight && 'bg-emerald-500'} aspect-square flex items-center justify-center`;
  return (
    <div className={className} data-x={`${x}`} data-y={`${y}`}>
      {!!pieceColor && (
        <div
          className={`piece rounded-full border-2 ${pieceColor} border-black aspect-square h-3/4 hover:cursor-grab active:cursor-grabbing`}
        ></div>
      )}
    </div>
  );
};

export default Tile;
