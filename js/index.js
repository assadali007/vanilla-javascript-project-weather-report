"use strict";
(function () {

    const url = "http://api.openweathermap.org/data/2.5/weather?q=";
    const apiKey = "ff0e11b34d4a4f634a449783b5f50ca2";
    const activities = {
        teamIn: ['basketball','hockey','volleyball'],
        teamOutWarm: ['softball/baseball','football/soccer','American football','rowing','tennis','volleyball','ultimate frisbee','rugby'],
        teamOutCold: ['hockey'],
        soloIn: ['rock climbing','swimming','ice skating'],
        soloOutWarm: ['rowing','running','hiking','cycling','rock climbing'],
        soloOutCold: ['snowshoeing','downhill skiing','cross-country skiing','ice skating']
    }
    let state = {}
    let category = 'all'

    document.querySelector('.forecast-button').addEventListener('click',(e)=> {
        e.preventDefault()

        const location = document.querySelector('#location').value;

        document.querySelector('#location').value = " "


        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => updateUISuccess(data))


    },false)

    const updateUISuccess = (data) => {

        const degC = data.main.temp - 273.15;
        const degCInt = Math.floor(degC);
        const degF = degC * 1.8 + 32;
        const degFInt = Math.floor(degF);

        state = {
            condition : data.weather[0].main,
             icon : "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
             degCInt: Math.floor(degCInt),
             degFInt: Math.floor(degFInt),
             city: data.name
        };

        let intro = document.querySelector('.conditions')


        let container = document.createElement('div')

        let cityPara = document.createElement('p')
        cityPara.setAttribute('class','city')
        cityPara.textContent = state.city

        let conditionPara = document.createElement('p')
        conditionPara.setAttribute('class','temp')
        conditionPara.textContent = `${state.degCInt}\u00B0 C /  ${state.degFInt}\u00B0 F`;

        let iconImage = document.createElement('img')
        iconImage.setAttribute('src',state.icon)

        iconImage.setAttribute('alt',state.condition)

        conditionPara.appendChild(iconImage)

        container.appendChild(cityPara)
        container.appendChild(conditionPara)
        intro.appendChild(container);

         if (document.querySelector('.conditions div')) {
             intro.replaceChild(container,document.querySelector('.conditions div'))
         } else
         {
             intro.appendChild(container);
         }
        updateActivityList();

    }

    document.querySelectorAll('.options div').forEach((el) => {
      el.addEventListener('click',updateActivityList,false)
    })

   function updateActivityList(event)  {
        if (event !== undefined && event.target.classList.contains('.selected')) {
            return true
        }
        else if(event !== undefined && !event.target.classList.contains('selected'))
        {
            category = event.target.id

            document.querySelectorAll('.options div').forEach((el) => {
                el.classList.remove('selected')
            })

            event.target.classList.add('selected')


        }


        state.activities = []

       if(state.condition === 'Rain') {
           updateState('In');
       } else if (state.condition === 'snow' || state.degFInt < 50) {
           updateState('outCold')
       } else
       {
           updateState('outWarm')
       }



       function  updateState(type) {
           if (category === 'solo') {
               state.activities.push(...activities['soloOutWarm'])
           }
           else if(category === 'team') {
               state.activities.push(...activities['teamOutWarm'])
           }
           else {
               state.activities.push(...activities['soloOutWarm'])
               state.activities.push(...activities['teamOutWarm'])
           }

       }

       const into = document.querySelector('.activities');
       let activitiesContainer = document.createElement('div');
       let list = document.createElement('ul');

       state.activities.map((activity,index) => {
           let listItem = document.createElement('li');
           listItem.setAttribute('key',index);
           listItem.textContent= activity;
           list.appendChild(listItem)
       });

       activitiesContainer.appendChild(list);
       if (document.querySelector('.activities div')) {
           into.replaceChild(activitiesContainer,document.querySelector('.activities div'))
       }
       else {
           into.appendChild(activitiesContainer);
       }
       document.querySelector('.results').classList.add('open')


   }


})();