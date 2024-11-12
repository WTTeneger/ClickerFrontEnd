import React, { useEffect } from 'react';
import { coin } from '../../assets/index.js'
import s from './InfoBox.module.scss';
import { MaterialSymbolsLightCloseRounded } from '../../assets/icons.jsx';
import { setFooter } from '../../store/user/interfaceSlice.js';
import { useDispatch } from 'react-redux';


const InfoBox = ({ actionBtn = null, isClose = null, children }) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const ref = React.useRef(null);
  const dispatch = useDispatch();
  const main = React.useRef(null);
  const speed = 0.2
  const close = () => {
    // останавливаем анимацию в конце
    ref.current.style.animation = `${s['slideDown']} ${speed}s ease-in-out forwards`;
    main.current.style.animation = `${s['hide']} ${speed}s ease-in-out forwards ${speed/2}s`;
    setTimeout(() => {
      setIsOpen(false);
      if (isClose) {
        isClose();
        dispatch(setFooter(true));
      }
    }, speed*1.5*1000);
  }

  useEffect(() => {
    if (isOpen) {
      ref.current.style.animation = `${s['slideUp']} ${speed}s ease-in-out forwards`;
    }

    return () => {
      dispatch(setFooter(true));
    }

  }, [isOpen]);



  useEffect(() => {
    dispatch(setFooter(false));
    if (actionBtn.current) {
      actionBtn.current.addEventListener('click', () => {
        close();
      });
    }
    return () => { 
      dispatch(setFooter(true));
    }
  }, [actionBtn]);
  // useEffect(() => {
  //   if (main.current) {
  //     main.current.addEventListener('click', () => {
  //       close();
  //     });
  //   }
  // }, [main.current]);





  if (!isOpen) return null;

  return (
    <div className={s['info-box']} ref={main}>
      <div className={s['bg']} onClick={() => { close() }} />
      <div className={s['box']} ref={ref}>
        <div className={s['content']}>{children}</div>
        <div className={s['close']} onClick={() => { close() }}><MaterialSymbolsLightCloseRounded /></div>
      </div>
    </div>
  )
};

export default InfoBox;
