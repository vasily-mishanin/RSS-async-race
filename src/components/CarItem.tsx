import { useEffect, useState, useRef, useCallback } from 'react';
import Car from '../model/Car';
import classes from './CarItem.module.css';
import * as api from '../api-fetch/requests';
import { Racer } from '../model/Car';

interface TCarItemProps {
  item: Car;
  onRemove: (id: number) => void;
  onSelect: (item: Car) => void;
  isRaceStarted: boolean;
  dispatchRacer: (racer: Racer) => void;
}

const CarItem: React.FC<TCarItemProps> = (props) => {
  //console.log('ITEM', props.isRaceStarted);
  const [isDriving, setIsDriving] = useState(false);
  const [drivingTime, setDrivingTime] = useState(0);
  const [isCarBroken, setIsCarBroken] = useState(false);
  const [isCarFinished, setIsCarFinished] = useState(false);
  const isMounted = useRef(false);

  const { id: carId } = props.item;

  const onGo = useCallback(() => {
    let time: number = 0;
    api
      .startCarEngine(`${carId}`)
      .then((res) => res.json())
      .then((res) => {
        time = res.distance / res.velocity;
        //console.log(time);
        //console.log('Animation...');
        setIsDriving(true);
        setDrivingTime(time);
        api
          .startDrive(`${carId}`)
          .then((res) => {
            if (res.status === 500) {
              //console.log('broken');
              // console.log(res.json());
              setIsCarBroken(true);
            } else {
              //console.log('Drive');
              return res.json();
            }
          })
          .catch((error) => {
            // setIsCarBroken(true);
            //console.log(error);
            return;
          })
          .then((res) => {
            api.stopCarEngine(`${carId}`).then(() => {
              const success = res ? res.success : false;
              const { id, name, color } = props.item;
              const racer = new Racer(id, name, color, time, success);
              //console.log('onGo', props.isRaceStarted);

              if (props.isRaceStarted) {
                props.dispatchRacer(racer);
              }
              setIsCarFinished(true);
            });
          });
      });
  }, [carId, props.isRaceStarted]);

  useEffect(() => {
    if (isMounted.current) {
      if (props.isRaceStarted === true) {
        // console.log('EFFECT RACE');
        onGo();
      } else {
        onBack();
      }
    } else {
      isMounted.current = true;
    }
  }, [props.isRaceStarted, onGo]);

  const onBack = () => {
    setIsDriving(false);
    setIsCarBroken(false);
    setIsCarFinished(false);
    setDrivingTime(0);
  };

  const carTrackInnerClasses = [classes.trackInner, isDriving ? classes.drive : ''].join(' ');
  const carImageClasses = [classes.carImage, isDriving ? classes.backShift : ''].join(' ');
  const carTrackDynamicStyle = {
    animationDuration: drivingTime.toString() + 'ms',
    animationPlayState: isCarBroken ? 'paused' : 'running',
  };
  const carImageDynamicStyle = {
    fill: props.item.color,
    animationDuration: drivingTime.toString() + 'ms',
    animationPlayState: isCarBroken ? 'paused' : 'running',
  };

  return (
    <li className={classes.carItem}>
      <div className={classes.carControlsSelect}>
        <div>
          <button onClick={() => props.onSelect(props.item)} disabled={isDriving ? true : false}>
            Select
          </button>
          <button onClick={() => props.onRemove(props.item.id)} disabled={isDriving ? true : false}>
            Remove
          </button>
        </div>
        <p className={classes.carName}>{props.item.name}</p>
      </div>
      <div className={classes.carControlsGo}>
        <div>
          <button onClick={onGo} disabled={isDriving ? true : false}>
            Go
          </button>
          <button onClick={onBack} disabled={!(isCarBroken || isCarFinished)}>
            Back
          </button>
        </div>
        <div className={classes.track}>
          <div className={carTrackInnerClasses} style={carTrackDynamicStyle}>
            <div className={carImageClasses} style={carImageDynamicStyle}>
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
          </div>
          <div className={classes.finish}></div>
        </div>
      </div>
    </li>
  );
};
export default CarItem;
