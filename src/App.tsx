import Layout from './layout/Layout';
import { Route, Routes } from 'react-router-dom';
import Garage from './pages/Garage';
import Winners from './pages/Winners';
import { useState } from 'react';
import Car from './model/Car';

function App() {
  const [lastPage, setLastPage] = useState(1);
  const [updatingCar, setUpdatingCar] = useState<Car>({ id: -1, name: '', color: '#000000' });

  const handleLastPage = (pageNumber: number) => {
    setLastPage(pageNumber);
  };

  const handleUpdatingCarChange = (car: Car) => {
    setUpdatingCar(car);
  };

  return (
    <Layout>
      <Routes>
        <Route
          path='/garage'
          element={
            <Garage page={lastPage} handleLastPage={handleLastPage} updatingCar={updatingCar} handleUpdatingCarChange={handleUpdatingCarChange} />
          }
        ></Route>
        <Route path='/winners' element={<Winners />}></Route>
      </Routes>
    </Layout>
  );
}

export default App;
