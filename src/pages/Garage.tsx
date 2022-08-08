import { useEffect, useState } from 'react';
import CarsList from '../components/CarsList';
import PaginationControls from '../components/PaginationControls';
import GarageControls from '../components/GarageControls';
import Car from '../model/Car';
import { carBrand, carModel } from '../model/carsData';
import { paginate } from '../utilites/helpers';
import * as api from '../api-fetch/requests';

type TGarageProps = {
  page: number;
  updatingCar: Car;
  handleLastPage: (pageNumber: number) => void;
  handleUpdatingCarChange: (car: Car) => void;
};

const Garage: React.FC<TGarageProps> = (props) => {
  console.log('GARAGE');
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingCar, setUpdatingCar] = useState<Car>(props.updatingCar);
  const [pageNumber, setPageNumber] = useState<number>(props.page);
  const [isRaceStarted, setIsRaceStarted] = useState(false);
  const [isRaceEnded, setIsRaceEnded] = useState(false);

  const CARS_PER_PAGE = 7;
  const book = paginate<Car>(cars, CARS_PER_PAGE);
  console.log(book);
  const numberOfPages = book.length;
  const currentPage = book[pageNumber - 1];
  //let stoppedCars = 0;

  useEffect(() => {
    console.log('USE EFFECT');
    setIsLoading(true);
    // getCars
    fetch('http://127.0.0.1:3000/garage')
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setCars(() => res);
        setIsLoading(false);
      });
  }, []);

  const createCarHandler = (name: string, color: string) => {
    api
      .createCar(name, color)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setCars((prevCars) => [...prevCars, res]);
      });
  };

  const removeCarHandler = (id: number) => {
    api
      .deleteCar(id)
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          setCars((prevCars) => prevCars.filter((car) => car.id !== id));
          api.deleteWinner(id);
        }
        return res.json();
      })
      .then((res) => {
        console.log('DELETE', id, res.statusCode);
      });
  };

  const selectCarHandler = (car: Car) => {
    console.log('SELECT', car);
    console.log(car);
    props.handleUpdatingCarChange(car);
    setUpdatingCar(car);
  };

  const updateCarHandler = (car: Car) => {
    api
      .updateCar(car)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        let carIndex = cars.findIndex((car) => car.id === res.id);
        let updatingCar = cars[carIndex];
        updatingCar = { ...res };
        const newCars = [...cars];
        newCars[carIndex] = updatingCar;
        setCars(newCars);
        setUpdatingCar({ id: -1, name: '', color: '#000000' });
      });
  };

  const generateCarsHandler = () => {
    const getRandomInRange = (from: number, to: number) => Math.floor(from + Math.random() * (to - from + 1));
    const NUMBERS_OF_CARS = 100;
    const NUMBER_OF_COLOR_COMBINATIONS = 16777215;
    const generatedCars: { name: string; color: string }[] = [];
    for (let i = 0; i < NUMBERS_OF_CARS; i++) {
      const name = `${carBrand[getRandomInRange(0, carBrand.length)]} ${carModel[getRandomInRange(0, carModel.length)]}`;
      const color = '#' + Math.floor(Math.random() * NUMBER_OF_COLOR_COMBINATIONS).toString(16);
      generatedCars.push({ name, color });
    }
    Promise.all(generatedCars.map((car) => api.createCar(car.name, car.color).then((res) => res.json()))).then(
      (responses: Car[]) => {
        console.log(responses);
        setCars((prevCars) => [...prevCars, ...responses]);
      }
    );
  };

  const handleNext = () => {
    if (pageNumber < book.length) {
      props.handleLastPage(pageNumber + 1);
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      props.handleLastPage(pageNumber - 1);
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  const startRaceHandler = () => {
    setIsRaceStarted(true);
  };

  const resetRaceHandler = () => {
    setIsRaceStarted(false);
    setIsRaceEnded(false);
  };

  const raceEndHandler = () => {
    setIsRaceEnded(true);
  };

  if (isLoading) {
    return (
      <section>
        <p>Loading ...</p>
      </section>
    );
  }

  return (
    <section>
      <GarageControls
        updatingCar={updatingCar}
        createCarHandler={createCarHandler}
        updateCarHandler={updateCarHandler}
        onGenerateCars={generateCarsHandler}
        onUpdatingControlsChange={props.handleUpdatingCarChange}
        onStartRace={startRaceHandler}
        onResetRace={resetRaceHandler}
        isRaceEnded={isRaceEnded}
      />
      <h2>Garage: {cars.length}</h2>
      <h3>Page: {pageNumber}</h3>
      <CarsList
        items={currentPage}
        isRaceStarted={isRaceStarted}
        removeCarHandler={removeCarHandler}
        selectCarHandler={selectCarHandler}
        signalRaceEnded={raceEndHandler}
      />
      <PaginationControls numberOfPages={numberOfPages} currentPageNumber={pageNumber} onNext={handleNext} onPrev={handlePrev} />
    </section>
  );
};

export default Garage;
