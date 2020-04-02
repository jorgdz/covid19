const covid19 = {
	API: 'https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest',

	async getCovidData ()
	{
		const data = await fetch(covid19.API);
		const json = await data.json();
		return json;
	},

	async drawCovidData (map)
	{
		const data = await covid19.getCovidData();

		const infoWindow = new window.google.maps.InfoWindow();

		var countDeaths = 0;
		var countConfirmed = 0;
		var countRecovered = 0;
		var timeEC = '';

		data.map(elem => {
			if (elem.confirmed > 0) 
			{
				const marker = new window.google.maps.Marker({
					position: {
						lat: elem.location.lat,
						lng: elem.location.lng,
					},
					map,
					icon: 'images/icon.png'
				});

				// ADD INFORMATION CARD IN ALL COUNTRIES
				marker.addListener('click', () => {
					infoWindow.setContent(`
						<div>
							<p><strong>${(elem.provincestate != '') ? elem.provincestate + ' - ' : ''} ${elem.countryregion}</strong></p>
							<p>Confirmados: ${elem.confirmed} </p>
							<p>Muertes: ${elem.deaths}</p>
							${(elem.recovered) ? `<p>Recuperados: ${elem.recovered}</p>` : ''} 
						</div>
					`);

					infoWindow.open(map, marker);
				});

				if (elem.countryregion == 'Ecuador') 
				{
					timeEC = elem.lastupdate;
				}

				countDeaths += elem.deaths;
				countConfirmed += elem.confirmed;
				countRecovered += (elem.recovered) ? parseInt(elem.recovered) : 0;
			}
		});

		console.log(`Confirmados: ${countConfirmed}`);
		console.log(`Muertes: ${countDeaths}`);
		console.log(`Recuperados: ${countRecovered}`);

		const confirmed = document.querySelector('#confirmed');
		const deaths = document.querySelector('#deaths');
		const recovered = document.querySelector('#recovered');
		const lastCase = document.querySelector('#case');

		confirmed.textContent = `Confirmados: ${countConfirmed}`;
		deaths.textContent = `Muertes: ${countDeaths}`;
		recovered.textContent = `Recuperados: ${countRecovered}`;
		lastCase.textContent = `Casos registrados hasta las: ${timeEC} (Hora de Wuhan)`;
	}
};


// DRAW MAP IN MY DIV
const map = document.getElementById('map');

const googleMap = new window.google.maps.Map(map, {
	center: {
		lat: 0,
		lng: 0,
	},
	zoom: 3,
	styles: stylesMap  // ESTILOS snazzy maps
});

covid19.drawCovidData(googleMap);