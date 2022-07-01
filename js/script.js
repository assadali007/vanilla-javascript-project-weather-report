"use strict";

(function() {
	const  url = "http://api.openweathermap.org/data/2.5/weather?q=";
	const apiKey = "ff0e11b34d4a4f634a449783b5f50ca2";
	const activities = {
		teamIn: ['basketball','hockey','volleyball'],
		teamOutWarm: ['play cards','tennis','chees','ultimate frisbee','rugby'],
		teamOutCold: ['hockey'],
		soloIn: ['rock climbing','swimming','ice skating'],
		soloOutWarm: ['Kabaddi','cricket','hockey','hiking','cycling','rock climbing'],
		soloOutCold: ['snowshoeing','downhill skiing','cross-country skiing','ice skating']
	}

	let state = {};
	let category = 'all';



	document.querySelector('.forecast-button').addEventListener('click',  (event) => {
		event.preventDefault();

		const location = document.querySelector('#location').value;

		document.querySelector('#location').value = " ";


		fetch (url + location + '&appid=' + apiKey)
			.then(response => response.json())
			.then(data => updateUISuccess(data))
			.catch(() => updateUIFailure())

	},false)




	  const updateUISuccess = (data) => {
		  const degC = data.main.temp - 273.15;
		  const degCInt = Math.floor(degC);
		  const degF = degC * 1.8 + 32;
		  const degFInt = Math.floor(degF);

		  state = {
			  condition: data.weather[0].main,
			  icon: "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png",
			  degCInt: Math.floor(degCInt),
			  degFInt: Math.floor(degFInt),
			  city: data.name
		  };

		  const into = document.querySelector('.conditions')


                 // container is the parent element
                 let container = document.createElement('div');

                 let cityPara = document.createElement('p');
                 cityPara.setAttribute('class','city');
                 cityPara.textContent = state.city

                 let conditionPara = document.createElement('p');
                 conditionPara.setAttribute('class','temp')
                 conditionPara.textContent = `${state.degCInt}\u00B0 C /  ${state.degFInt}\u00B0 F `;

                 let iconImage = document.createElement('img');
                 iconImage.setAttribute('src',state.icon);
                 iconImage.setAttribute('alt', state.condition)

                 //  Now the image element with the icon image variable name needs to be nested within the paragraph
                 // in the conditionsPara variable. So I can create a new statement referencing the parent element
                 // which is conditionsPara and its appendChild method, and then just pass in a reference to iconImage.

                 // And this results in the image being appended as a child to the paragraph.

                 conditionPara.appendChild(iconImage);

                 container.appendChild(cityPara);

                 container.appendChild(conditionPara)

                 if (document.querySelector('.conditions div')) {
                     // only work if the existing content on here to replace the content
                     into.replaceChild(container,document.querySelector('.conditions div'));

                 } else {
                     into.appendChild(container);
                 }

		  updateActivityList();

	  }


	// update list of sports when user selects a different category (solo/team/all)
    document.querySelectorAll('.options div').forEach((el) => {
		el.addEventListener('click', updateActivityList, false)
	})

	// handle selection of a new category (team/solo/all)
	 function updateActivityList(event)   {
		if (event !== undefined && event.target.classList.contains('selected')) {
			// event is defined and event has class selected
			// if the 'event' parameter is defined, then a tab has been clicked; if not, then this is the
			//   default case and the view simply needs to be updated
			// if the clicked tab has the class 'selected', then no need to change location of 'selected' class
			//   or change the DOM
			return true;
		} else if (event !== undefined && !event.target.classList.contains('selected')) {
			// if the 'event' parameter is defined, then a tab has been clicked
			// if the clicked tab does not have the class 'selected', then location of 'selected' class must be added
			//   to the clicked element and removed from its siblings
			category = event.target.id;
			console.log(category)


			document.querySelectorAll('.options div').forEach(function(el) {
				el.classList.remove('selected');
			});

			event.target.classList.add('selected');
		}

		state.activities = [];
		if (state.condition === "Rain") {
			updateState('In');
		} else if (state.condition === "Snow" || state.degFInt < 50) {
			updateState('OutCold');
		} else {
			updateState('OutWarm');
		}

		function updateState(type) {

			if (category === "solo") {
				state.activities.push(...activities['solo' + type]);

			} else if (category === "team") {
				state.activities.push(...activities['team' + type]);
			} else {
				state.activities.push(...activities['team' + type]);
				state.activities.push(...activities['solo' + type]);
			}
		}

		const into = document.querySelector('.activities');

		let activitiesContainer = document.createElement('div');

		let list = document.createElement('ul');

		state.activities.map((activity,index) => {

			let listItem = document.createElement('li');
			listItem.setAttribute('key',index);
			listItem.textContent = activity;
			list.appendChild(listItem);
		});


		activitiesContainer.appendChild(list);
		if (document.querySelector('.activities div')) {
			into.replaceChild(activitiesContainer,document.querySelector('.activities div'));
		} else {
			into.appendChild(activitiesContainer);
		}


		 document.querySelector('.results').classList.add('open')

	 }

	// handle ajax failure
	function updateUIFailure() {
		document.querySelector('.conditions').textContent = "please enter the  correct city name";
	}

})();

