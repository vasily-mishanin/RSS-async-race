type TCarsControlsProps = {
  onNext: () => void;
  onPrev: () => void;
  numberOfPages: number;
  currentPageNumber: number;
};

const CarsListControls: React.FC<TCarsControlsProps> = (props) => {
  const isLastPage = props.currentPageNumber === props.numberOfPages;
  const isFirstPage = props.currentPageNumber === 1;

  return (
    <div>
      <button disabled={isFirstPage ? true : false} onClick={props.onPrev}>
        Prev
      </button>
      <button disabled={isLastPage ? true : false} onClick={props.onNext}>
        Next
      </button>
    </div>
  );
};
export default CarsListControls;
