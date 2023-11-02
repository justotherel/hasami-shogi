interface Props {
  x: number;
  y: number;
  highlight?: boolean;
  pieceColor?: string;
}

const Tile = (props: Props) => {
  const { x, y, pieceColor, highlight } = props;
  const className = `border-black border

  ${(y === 1 || y === 5) && 'md:border-t-4'}
  ${x === 0 && 'border-l-0 '} 
  ${x === 7 && 'border-r-0 '} 
  ${highlight && "bg-emerald-500"} 
  aspect-square flex items-center justify-center`;
  return (
    <div className={className}>
      {!!pieceColor && (
        <div
          className={`piece rounded-full border ${pieceColor} border-black md:border-2 aspect-square h-3/4 hover:cursor-grab active:cursor-grabbing`}
        ></div>
      )}
    </div>
  );
};

export default Tile;
