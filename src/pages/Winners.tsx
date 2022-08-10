import React, { useEffect, useState } from 'react';
import Car, { Winner } from '../model/Car';
import WinnersTable from '../components/WinnersTable';
import PaginationControls from '../components/PaginationControls';
import * as api from '../api-fetch/requests';

type TSortConfig = {
  key: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
} | null;

const Winners: React.FC = (props) => {
  //console.log('Winners');
  const [isLoading, setIsLoading] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [totalWinners, setTotalWinners] = useState(0);
  const [sortConfig, setSortConfig] = useState<TSortConfig>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const LIMIT = 10;
  const numberOfPages = Math.ceil(totalWinners / LIMIT);

  useEffect(() => {
    setIsLoading(true);
    // winners --> setState -> cars -> setState
    //console.log('useEffect - Winners');
    api
      .getWinners(currentPageNumber, LIMIT, sortConfig?.key, sortConfig?.order)
      .then((res) => {
        setTotalWinners(Number(res.headers.get('X-Total-Count')));
        return res.json();
      })
      .then((winners) => {
        setWinners(winners);
        const ids: number[] = winners.map((w: Winner) => w.id);
        const getCarsForWinners = ids.map((id) => api.getCar(id));
        Promise.all(getCarsForWinners)
          .then((resArr) => resArr.map((res) => res.json()))
          .then((carsPromises) => {
            Promise.all<Promise<Car>[]>(carsPromises).then((cars) => {
              //console.log('CARS', cars);
              setCars(cars);
            });
          });

        //console.log(winners);
      })
      .then(() => {
        setIsLoading(false);
      });

    return () => {};
  }, [currentPageNumber, sortConfig]);

  const handleNext = () => {
    if (currentPageNumber < numberOfPages) {
      setCurrentPageNumber((currentPageNumber) => currentPageNumber + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageNumber > 0) {
      setCurrentPageNumber((currentPageNumber) => currentPageNumber - 1);
    }
  };

  const requestSort = (key: 'id' | 'wins' | 'time') => {
    let order: 'ASC' | 'DESC' = 'ASC';
    if (sortConfig?.key === key && sortConfig?.order === 'ASC') {
      order = 'DESC';
    }
    setSortConfig({ key, order });
    //props.requestSort
  };

  if (isLoading) {
    return (
      <section>
        <p>Loading ...</p>
      </section>
    );
  }

  // console.log(winners, cars);

  return (
    <section>
      <h2>Winners{` (${totalWinners})`}</h2>
      <h3>Page: {currentPageNumber}</h3>
      <WinnersTable winners={winners} cars={cars} sortConfig={sortConfig} requestSort={requestSort} />
      <PaginationControls
        numberOfPages={numberOfPages}
        currentPageNumber={currentPageNumber}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
};

export default Winners;
