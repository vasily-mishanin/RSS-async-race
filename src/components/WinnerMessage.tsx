import { Racer } from '../model/Car';
import classes from './WinnerMessage.module.css';

const WinnerMessage: React.FC<{ racer: Racer | null }> = (props) => {
  if (props.racer) {
    return (
      <div className={classes.message} style={{ display: 'block' }}>
        <h1>{`${props.racer.name} wins with time ${(props.racer.time / 1000).toFixed(2)} sec !`}</h1>
      </div>
    );
  }
  return (
    <div className={classes.message}>
      <h1>No winners yet</h1>
    </div>
  );
};

export default WinnerMessage;
