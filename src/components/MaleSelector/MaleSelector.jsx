import React, { useEffect } from 'react';
import { coin, coinSvg } from '../../assets/index.js'
import s from './MaleSelector.module.scss';
import { Female, Male, MaterialSymbolsLightCloseRounded } from '../../assets/icons.jsx';
import InfoBox from '../InfoBox/InfoBox.jsx';
import { normilezeBalance } from '../../utils/normileze.js';
import { useDispatch, useSelector } from 'react-redux';
import { setGender } from '../../store/user/userSlice.js';
import { setFooter } from '../../store/user/interfaceSlice.js';
import { useSetGenderMutation } from '../../store/user/user.api.js';


const MaleSelector = ({ gender }) => {
  const ref = React.useRef(null);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [_setGender] = useSetGenderMutation();

  const onclick = (gender = 'male') => {
    console.log(gender)
    gender = gender == 'male' || gender == 'female' ? gender : 'male'
    _setGender({ access_token: user.access_token, gender: gender }).then((res) => {
      if (res.data) {
        dispatch(setGender(gender));
      } else {
      }
    })
  }
  useEffect(() => {
    dispatch(setFooter(true));
  }, [])

  return (
    <InfoBox actionBtn={ref}>
      <div className={s['content']}>
        <div className={s['content__title']}>Select you gender</div>
        <div className={s['content__description']}>Select your gender, later we will be able to change it in your personal cabinet</div>
        <div className={s['content']} ref={ref}>
          <div className={s['content__btn']} onClick={() => { onclick('male') }}><Male />Male</div>
          <div className={`${s['content__btn']} ${s['female']}`} onClick={() => { onclick('female') }}><Female />Female</div>
        </div>
      </div>
    </InfoBox>
  )
};

export default MaleSelector;
