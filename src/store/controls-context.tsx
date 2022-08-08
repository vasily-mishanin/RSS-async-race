import React, { PropsWithChildren, useState } from 'react';

interface IControlsContext extends PropsWithChildren {
  areAllCarsStopped: boolean;
  carStopped: (n: number) => void;
}

export const ControlsContext = React.createContext<IControlsContext>({
  areAllCarsStopped: false,
  carStopped: () => {},
});

const ControlsContextProvider: React.FC<PropsWithChildren> = (props) => {
  const [allStopped, setAllStopped] = useState(false);
  let stoppedCars = 0;
  console.log('ControlsContextProvider');
  const handleCarStopped = (numberOfCarsOnPage: number) => {
    stoppedCars++;
    if (stoppedCars === numberOfCarsOnPage) {
      //unable Reset btn
      console.log('All done');
      setAllStopped(true);
    }
  };

  const contextValue = {
    areAllCarsStopped: allStopped,
    carStopped: handleCarStopped,
  };

  return <ControlsContext.Provider value={contextValue}> {props.children} </ControlsContext.Provider>;
};

export default ControlsContextProvider;
