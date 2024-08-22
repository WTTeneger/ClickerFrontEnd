// Male
import man1 from './male/1_lv.png';
import man2 from './male/2_lv.png';
import man3 from './male/3_lv.png';
import man4 from './male/4_lv.png';
import man5 from './male/5_lv.png';
import man6 from './male/6_lv.png';
import man7 from './male/7_lv.png';
import man8 from './male/8_lv.png';
import man9 from './male/9_lv.png';
import man10 from './male/10_lv.png';

// Female
import woman1 from './female/1_lv.png';
import woman2 from './female/2_lv.png';
import woman3 from './female/3_lv.png';
import woman4 from './female/4_lv.png';
import woman5 from './female/5_lv.png';
import woman6 from './female/6_lv.png';
import woman7 from './female/7_lv.png';
import woman8 from './female/8_lv.png';
import woman9 from './female/9_lv.png';
import woman10 from './female/10_lv.png';


// Background
import bg1 from './background/1_lv.png';
import bg2 from './background/2_lv.png';
import bg3 from './background/3_lv.png';
import bg4 from './background/4_lv.png';
import bg5 from './background/5_lv.png';
import bg6 from './background/6_lv.png';
import bg7 from './background/7_lv.png';
import bg8 from './background/8_lv.png';
import bg9 from './background/9_lv.png';
import bg10 from './background/10_lv.png';


// import gentleman from './gentleman.png';
// import co_founder_casino from './co_founder_casino.png';
// import casino_owner from './casino_owner.png';




export const skins = {
    'male': {
        'newcomer': man1,
        'tramp': man2,
        'tidy': man3,
        'cheerful': man4,
        'crypto shark': man5,
        'investor': man6,
        'business man': man7,
        'gentleman': man8,
        'co-founder casino': man9,
        'casino owner': man10,
        'default': man1
    },
    'female': {
        'newcomer': woman1,
        'tramp': woman2,
        'tidy': woman3,
        'cheerful': woman4,
        'crypto shark': woman5,
        'investor': woman6,
        'business man': woman7,
        'gentleman': woman8,
        'co-founder casino': woman9,
        'casino owner': woman10,
        'default': woman1
    },
    background: {
        'newcomer': bg1,
        'tramp': bg2,
        'tidy': bg3,
        'cheerful': bg4,
        'crypto shark': bg5,
        'investor': bg6,
        'business man': bg7,
        'gentleman': bg8,
        'co-founder casino': bg9,
        'casino owner': bg10,
        'default': bg1
    }
}




export const getSkin = (skinName, gender = 'male') => {
    gender = gender == 'male' || gender == 'female' ? gender : 'male'

    let dt = {
        skin: skins[gender][skinName] || skins[gender]['default'],
        active: skins[gender][skinName] ? true : false,

        background: skins['background'][skinName] || skins['background']['default'],
    }
    return (dt)
}

export { bg1, bg2 };