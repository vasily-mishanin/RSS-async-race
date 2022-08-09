import React, { useEffect, useState } from 'react';
import Car, { Winner } from '../model/Car';
import classes from '../components/WinnersTable.module.css';

type TSortConfig = {
  key: 'id' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
} | null;

type TWinnerView = {
  name?: string | undefined;
  color?: string | undefined;
  id: number;
  wins: number;
  time: number;
};

type TWinnersTableProps = {
  winners: Winner[];
  cars: Car[];
  sortConfig: TSortConfig;
  requestSort: (key: 'id' | 'wins' | 'time') => void;
};

const WinnersTable: React.FC<TWinnersTableProps> = (props) => {
  const [winners, setWinners] = useState<TWinnerView[]>([]);

  //console.log('WinnersTable', props.sortConfig?.key, props.sortConfig?.order);

  useEffect(() => {
    setWinners(joinCarsAndWinners(props.winners, props.cars));
  }, [props]);

  const joinCarsAndWinners = (winners: Winner[], cars: Car[]) => {
    const assembledWinners = winners.map((winner) => ({
      ...winner,
      ...cars.find((car) => car.id === winner.id),
    }));
    return assembledWinners;
  };

  const sortBadge = (key: string) => {
    if (props.sortConfig?.key === key) {
      return props.sortConfig?.order === 'ASC' ? '↑' : '↓';
    } else {
      return '';
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th className={classes.number}>Number</th>
          <th>Car</th>
          <th className={classes.name}>Name</th>
          <th className={classes.wins} onClick={() => props.requestSort('wins')}>
            Wins <span className={classes.sortBadge}>{`${sortBadge('wins')}`}</span>
          </th>
          <th className={classes.time} onClick={() => props.requestSort('time')}>
            Best time (sec) <span className={classes.sortBadge}>{`${sortBadge('time')}`}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {winners.map((winner, ind) => (
          <tr key={ind}>
            <td>{ind + 1}</td>
            <td>
              <div className={classes.carImage} style={{ fill: winner.color }}>
                <svg x='0px' y='0px' viewBox='0 0 47.032 47.032'>
                  <g transform='rotate(90 22 25) translate(-15)'>
                    <path
                      d='M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759
		c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z
		 M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713
		v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336
		h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z'
                    />
                  </g>
                </svg>
              </div>
            </td>
            <td>{winner.name}</td>
            <td>{winner.wins}</td>
            <td>{(winner.time / 1000).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WinnersTable;
