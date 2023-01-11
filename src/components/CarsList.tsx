import CarItem from './CarItem';
import Car, { Winner } from '../model/Car';
import { Racer } from '../model/Car';
import * as api from '../api-fetch/requests';

interface TCarListProps {
  items: Car[];
  removeCarHandler: (id: number) => void;
  selectCarHandler: (item: Car) => void;
  isRaceStarted: boolean;
  signalRaceEnded: () => void;
  signalWinner: (racer: Racer) => void;
}

const CarsList: React.FC<TCarListProps> = (props) => {
  //console.log('CARLIST', props.isRaceStarted);
  //TODO state?
  const racers: Racer[] = [];
  let isFirst: boolean = true;

  const processRacer = (racer: Racer) => {
    // console.log('processRacer');

    if (isFirst && racer.success === true) {
      isFirst = false;
      const winner = new Winner(racer.id, 1, racer.time);
      // console.log('WINNER', winner);
      props.signalWinner(racer);

      api.getWinner(winner.id).then((res) => {
        if (res.ok) {
          // updateWinner
          res.json().then((oldRecord) => {
            const wins = oldRecord.wins + winner.wins;
            const time = oldRecord.time > winner.time ? winner.time : oldRecord.time;
            api.updateWinner(new Winner(winner.id, wins, time));
          });
        } else {
          // createWinner
          api.createWinner(winner);
        }
      });
    }
    racers.push(racer);

    if (racers.length === props.items.length) {
      // console.log('END');
      props.signalRaceEnded();
      // const successfulRacers = racers.filter((racer) => racer.success);
      // console.log(successfulRacers);
      // const bestRacer = successfulRacers.reduce((curr, acc) => (curr.time < acc.time ? curr : acc));
      // console.log(bestRacer);
      // const winner = new Winner(bestRacer.id, 1, bestRacer.time);
      // console.log('WINNER', winner);
      // check if such winner exists
      // YES: updateWinner
      // No: createWinner
      // api.getWinner(winner.id).then((res) => {
      //   if (res.ok) {
      //     // updateWinner
      //     res.json().then((oldRecord) => {
      //       const wins = oldRecord.wins + winner.wins;
      //       const time = oldRecord.time > winner.time ? winner.time : oldRecord.time;
      //       api.updateWinner(new Winner(winner.id, wins, time));
      //     });
      //   } else {
      //     // createWinner
      //     api.createWinner(winner);
      //   }
      // });
    }
  };

  return (
    <div>
      <ul>
        {props.items.map((item) => (
          <CarItem
            key={item.id}
            item={item}
            isRaceStarted={props.isRaceStarted}
            onRemove={props.removeCarHandler}
            onSelect={props.selectCarHandler}
            dispatchRacer={processRacer}
          />
        ))}
      </ul>
    </div>
  );
};
export default CarsList;
