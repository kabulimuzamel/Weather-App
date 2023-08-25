$(document).ready(function(){
    const SeLoCoObj = {
			searchedStorage: {},
			$locationTextDisplayer(res, tempUnit, isCelOrFah = 'F') {
				let idName = res.location.name
				idName = idName.replace(/\s/g, '-')
				return $(
					`<div style='width: 372px' class='weatherText${idName} card mt-2'>
                        <div style='position: relative' class="card-header">
                            <h3 class='card-title'>
                                ${res.location.name}
                            </h3>
                            <span class='card-subtitle'>
                                The weather in <strong>${res.location.name}</strong> is <span class="${idName}TempUnitText fw-bold">${tempUnit} <span class="tempUnit">${isCelOrFah}</span>° degree.</span>  <br>
                            </span>
                            <button style='position: absolute; top: 10px; right: 10px' type="button" class='btn-close closeButton${idName}' aria-label="Close">
                            </button>
                        </div>
                        <div class = 'card-body'>
                            <p class='card-text'>
                                <strong>Name:</strong> ${res.location.name} <br>
                                <strong>Region:</strong>  ${res.location.region} <br>
                                <strong>Country:</strong> ${res.location.country} <br>
                                <strong>Time Zone:</strong> ${res.location.tz_id} <br>
                                <strong>Local Time:</strong> ${res.location.localtime} <br>
                                <strong>Condition:</strong> ${res.current.condition.text}
                            </p>
                        </div>
                    </div>`
				)
			},
		}
    const $submitButton = $('#submit');
    const $locationInput = $('#location-search');
    const $weatherInfo = $('#weather-info');
    const $clearButton = $('#clear-button');
    let isCelOrFah;
    
    $clearButton.hide();
    temperatureIdentifier();
    

    function closeCardButton() {
        Object.keys(SeLoCoObj.searchedStorage).forEach(name => {
            $(`.closeButton${name}`).on('click', () => {
                $(`.weatherText${name}`).remove();
            })
        })
    }

    function temperatureIdentifier() {
        $('#celsius').on('click', () => {
            $('#fahrenheit').removeClass('btn-warning')
            $('#celsius').addClass('btn-danger text-dark')
            isCelOrFah = 'C';
            Object.keys(SeLoCoObj.searchedStorage).forEach(name => {
                $(`.${name}TempUnitText`).text(`${SeLoCoObj.searchedStorage[name].tempC} C° degree.`)
            })
        });
        $('#fahrenheit').on('click', () => {
            $('#celsius').removeClass('btn-danger')
            $('#fahrenheit').addClass('btn-warning text-dark')
            isCelOrFah = 'F';
            Object.keys(SeLoCoObj.searchedStorage).forEach(name => {
                $(`.${name}TempUnitText`).text(`${SeLoCoObj.searchedStorage[name].tempF} F° degree.`)
            })
        })
    }


    function clearWeatherInfoElement() {
        $clearButton.show()
        $clearButton.on('click', () => {
            $locationInput.val('')
            $weatherInfo.text('');
            $clearButton.hide();
            SeLoCoObj.searchedStorage = {};
        })
    }

    function fetchData() {
        const temperatureUnit = isCelOrFah === 'C' ? 'temp_c' : 'temp_f';
        const weatherURL = `https://api.weatherapi.com/v1/current.json?key=cfc5f51acad248029ec185640232106&q=${$locationInput.val()}&aqi=yes`;
            fetch(weatherURL)
                .then((res) => res.json())
                .then((res) => {
                    let idName = res.location.name
                    idName = idName.replace(/\s/g, '-')
                    $('.weatherTextAlert').remove()
                    if($weatherInfo.has(`.weatherText${idName}`).length) {
                        alert('You have already searched for this')
                    } else {
                        SeLoCoObj.searchedStorage[idName] = {
                            tempC: res.current.temp_c,
                            tempF: res.current.temp_f,
                        }
                        const temperature = res.current[temperatureUnit];
                        $weatherInfo.append(SeLoCoObj.$locationTextDisplayer(res, temperature, isCelOrFah))
                        const imgUrl = `https://api.unsplash.com/photos/random?query=${idName}&per_page=1&client_id=AiG33FsEn1tb1bcGUvDmXm7cQrIC6RsKaKh623pQ8Dc`
    
                            fetch(imgUrl)
                                .then((format) => format.json())
                                .then((img) => {
                                    $(`.weatherText${idName}`).append(
                                        `<img style='height: 270px; width: 370px' src=${img.urls.regular} class="card-img"/>`
                                    )
                                })

                        closeCardButton();
                    }   
                })
                .catch((err) => {
                    if(!$weatherInfo.has('.weatherTextAlert').length) {
                        $weatherInfo.prepend(`<div class='weatherTextAlert alert alert-danger alert dismissible fade show' role='alert'>
                        Please type something in the box or the location you typed in doesn't match our data, please try in a different way.
                        <button class='btn-close' aria-label='close' data-bs-dismiss='alert'></button>
                        </div>`) 
                    }
                })
    }

    $submitButton.on('click', (e) => {
            e.preventDefault();
            fetchData();
            clearWeatherInfoElement();
    });
})
