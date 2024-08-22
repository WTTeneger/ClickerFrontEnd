/*
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
*/

const aboutLevels = [
    {
        level: 1,
        type: 'newcomer',
        title: "Монетная пещера",
        desc: "Дональд начинает своё приключение в подземной пещере, наполненной старыми монетами и сокровищами, которые спрятали древние пираты. <br/><br/>Пещера покрыта влажной плесенью, а монеты разбросаны по всему полу.Дональду нужно собирать монеты, прыгая по скользким камням и избегая древних ловушек, чтобы получить свои первые деньги для дальнейших приключений."
    },
    // <br/><br/>
    {
        level: 2,
        type: 'tramp',
        title: "Свалка драгоценных металлов",
        desc: "Дональд попадает на огромную свалку, где на первый взгляд валяется лишь старый хлам.Однако среди мусора скрываются обломки старых золотых и серебряных украшений, а также металлические изделия, которые можно переплавить.<br/><br/>Дональд должен искать эти ценные кусочки металлов среди груды мусора, избегая агрессивных роботов- утилизаторов, которые защищают свалку."
    },
    {
        level: 3,
        type: 'tidy',
        title: "Подпольный клуб азартных игр",
        desc: "Дональд оказывается в скрытом подземном клубе, где тайно собираются любители азартных игр.Заведение полное дымки, таинственного света и шепотов.<br/><br/>Дональду предстоит пройти несколько игр на удачу — от покера до рулетки, чтобы выиграть деньги.Он должен быть осторожен, ведь здесь его могут обмануть или подставить, если он будет слишком удачлив."
    },
    {
        level: 4,
        type: 'cheerful',
        title: "Офис брокеров",
        desc: "Персонаж попадает в оживленный офис брокеров, расположенный на высоком этаже небоскреба.Повсюду слышен шум биржевых терминалов и звонки телефонов.<br/><br/>Дональду предстоит скупать акции и продавать их с выгодой, лавируя между коллегами и избегая проблем с начальством.Он должен следить за рынком и вовремя принимать решения, чтобы не потерять деньги."
    },
    {
        level: 5,
        type: 'crypto shark',
        title: "Лаборатория по созданию золота",
        desc: "Дональд находит секретную лабораторию, где ученые- алхимики пытаются создать золото.Здесь все сияет странными жидкостями, реактивы бурлят в колбах, а механизмы пыхтят и искрятся.<br/><br/>Дональду нужно собрать ингредиенты и правильно настроить оборудование, чтобы создать золото из обычных металлов.  Но стоит быть осторожным — одна ошибка  может привести к катастрофе."
    },
    {
        level: 6,
        type: 'investor',
        title: "Фабрика по производству банкнот",
        desc: "Дональд оказывается на секретной фабрике, где печатают деньги.Огромные машины работают круглосуточно, выбрасывая на конвейеры новенькие банкноты.<br/><br/>Дональду предстоит прокрасться внутрь фабрики, избегая охраны и камер слежения, чтобы собрать как можно больше банкнот и не попасться."
    },

    {
        level: 7,
        type: 'business man',
        title: "Роскошный аукционный дом",
        desc: "Дональд посещает элитный аукционный дом, где продаются редкие и дорогие предметы искусства.В зале царит изысканная атмосфера, звучат тихие голоса, обсуждающие миллионы.Дональд должен участвовать в торгах, стараясь не переплачивать, но и не упустить ценные лоты.<br/><br/>Ему нужно использовать хитрость и знание предметов, чтобы выйти из зала с ценными приобретениями, которые можно будет  продать с большой выгодой."
    },
    {
        level: 8,
        type: 'gentleman',
        title: "Банк времени",
        desc: "Дональд оказывается в странном учреждении, где вместо денег можно обменивать и зарабатывать время.Залы банка заполнены часами, циферблатами и песочными часами, а сотрудники — загадочные фигуры в черных костюмах. <br/><br/>Дональду предстоит правильно распределять свое время, зарабатывать его, выполняя разные задания, и тратить на важные цели, чтобы накопить «временные» средства и не остаться ни с чем."
    },
    {
        level: 9,
        type: 'co-founder casino',
        title: "Корпорация по добыче нефти",
        desc: "Дональд приезжает на огромное нефтяное месторождение, где добыча черного золота ведется в промышленных масштабах.Вокруг него высокие буровые вышки, цистерны и трубопроводы, протянувшиеся на километры. <br/> <br/>Дональду нужно управлять процессами добычи, следить за оборудованием и избегать опасных аварий, чтобы продать добытую нефть и получить значительную прибыль."
    },
    {
        level: 10,
        type: 'casino owner',
        title: "Золотой дворец магната",
        desc: "Финальная локация — роскошный дворец, принадлежащий одному из богатейших магнатов мира.<br/><br/>Здесь все — от стен до мебели — украшено золотом и драгоценными камнями. Вокруг дворца расположены сады с фонтанами,  а внутри — залы, где хранятся несметные сокровища."
    },

]


export { aboutLevels } 