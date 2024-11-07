import React, { useEffect } from 'react';
import { coin } from '../../assets/index.js'
import s from './SliderBox.module.scss';
import { MaterialSymbolsLightCloseRounded } from '../../assets/icons.jsx';
import { setFooter } from '../../store/user/interfaceSlice.js';
import { useDispatch } from 'react-redux';

const SliderBox = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const ref = React.useRef(null);
  const dispatch = useDispatch();
  const main = React.useRef(null);
  const speed = 0.2
  if (!isOpen) return null;
  const [slide, setSlide] = React.useState(0);

  return (
    <div className={s['slider-box']} ref={main}>
      <div className={s['box']} ref={ref}>
        <div className={s['content']}>
          {children}
        </div>
      </div>
    </div>
  )
};

export { SliderBox }

