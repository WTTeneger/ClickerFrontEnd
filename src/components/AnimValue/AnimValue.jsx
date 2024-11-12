import React, { useEffect } from 'react';

import AnimatedNumbers from "react-animated-numbers";
import { normilezeBalance } from '../../utils/normileze';


const AnimValue = ({ value, speed = 0.01, delay }) => {
  let [_speed, setSpeed] = React.useState(0);
  let [isViewValue, setIsViewValue] = React.useState(false);

  useEffect(() => {

    if (delay && value != 0) {
      console.log(delay)
      setSpeed(0)
      setTimeout(() => {
        setSpeed(speed)
        setIsViewValue(true)
      }, delay)
    } else {
      setSpeed(speed)
      setIsViewValue(true)
    }
  }, [, delay]);

  return (
    <AnimatedNumbers
      includeComma
      // className={styles.container}
      transitions={(index, val) => {
        let s = (index / 5) + _speed;
        return {
          type: "spring",
          duration: value == 0 ? 0 : s,
        }
      }}
      animateToNumber={isViewValue ? parseInt(value || 0) : 0}
    />
  )
};

export default AnimValue;
