import classes from './GarageControls.module.css';
import React, { useEffect, useRef, useState } from 'react';
import Car from '../model/Car';

interface IGarageControlsProps {
  updatingCar: Car;
  createCarHandler: (name: string, color: string) => void;
  updateCarHandler: (car: Car) => void;
  onGenerateCars: () => void;
  onUpdatingControlsChange: (car: Car) => void;
  onStartRace: () => void;
  onResetRace: () => void;
  isRaceEnded: boolean;
  resetRaceEnded: () => void;
}

const GarageControls: React.FC<IGarageControlsProps> = (props) => {
  //console.log('GarageControls', props.isRaceEnded);
  const [updatingCar, setUpdatingCar] = useState<Car>(props.updatingCar);
  const [isRaceStarted, setIsRaceStarted] = useState(false);

  useEffect(() => {
    setUpdatingCar(() => props.updatingCar);
  }, [props.updatingCar]);

  const createCarInputNameRef = useRef<HTMLInputElement>(null);
  const createCarInputColorRef = useRef<HTMLInputElement>(null);
  const createCarFormRef = useRef<HTMLFormElement>(null);

  const updateCarInputNameRef = useRef<HTMLInputElement>(null);
  const updateCarInputColorRef = useRef<HTMLInputElement>(null);

  const handleCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.createCarHandler(createCarInputNameRef.current!.value, createCarInputColorRef.current!.value);
    createCarFormRef.current?.reset();
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCar = {
      id: props.updatingCar!.id,
      name: updateCarInputNameRef.current!.value,
      color: updateCarInputColorRef.current!.value,
    };
    props.updateCarHandler(updatedCar);
    //clear inputs
    props.onUpdatingControlsChange({ id: -1, name: '', color: '#000000' });
    setUpdatingCar({ id: -1, name: '', color: '#000000' });
  };

  const handleNameChange = (e: React.FormEvent<HTMLInputElement>) => {
    props.onUpdatingControlsChange({ ...updatingCar, name: updateCarInputNameRef.current!.value });
    setUpdatingCar((prevCar) => ({ ...prevCar, name: updateCarInputNameRef.current!.value }));
  };

  const handleColorChange = (e: React.FormEvent<HTMLInputElement>) => {
    props.onUpdatingControlsChange({ ...updatingCar, color: updateCarInputColorRef.current!.value });
    setUpdatingCar((prevCar) => ({ ...prevCar, color: updateCarInputColorRef.current!.value }));
  };

  const handleStart = () => {
    setIsRaceStarted(true);
    props.onStartRace();
  };

  const handleReset = () => {
    setIsRaceStarted(false);
    props.resetRaceEnded();
    props.onResetRace();
  };

  return (
    <section className={classes.garageControls}>
      <form name='create-car-form' onSubmit={handleCreateSubmit} ref={createCarFormRef}>
        <input type='text' ref={createCarInputNameRef} />
        <input type='color' ref={createCarInputColorRef} />
        <button>Create</button>
      </form>

      <form name='update-car-form' onSubmit={handleUpdateSubmit}>
        <input
          disabled={props.updatingCar.id < 0 ? true : false}
          type='text'
          ref={updateCarInputNameRef}
          value={updatingCar.name}
          onChange={handleNameChange}
        />
        <input
          disabled={props.updatingCar.id < 0 ? true : false}
          type='color'
          ref={updateCarInputColorRef}
          value={updatingCar.color}
          onChange={handleColorChange}
        />
        <button disabled={props.updatingCar.id < 0 ? true : false}>Update</button>
      </form>

      <div>
        <button onClick={handleStart} disabled={isRaceStarted}>
          Race
        </button>
        <button onClick={handleReset} disabled={!props.isRaceEnded}>
          Reset
        </button>
        <button onClick={props.onGenerateCars}>Generate Cars</button>
      </div>
    </section>
  );
};

export default GarageControls;
