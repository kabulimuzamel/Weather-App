$(document).ready(function(){
    const $submitButton = $('#submit');
    const $locationInput = $('#location-search');
    const $weatherInfo = $('#weather-info');

    function removeWeatherInfoElement() {
        $('.weatherText').remove();
    }

    function fetchData() {
        const weatherURL = `https://api.weatherapi.com/v1/current.json?key=cfc5f51acad248029ec185640232106&q=${$locationInput.val()}&aqi=yes`;
            fetch(weatherURL)
                .then((res) => res.json())
                .then((res) =>
                    $weatherInfo.append(
                        `<p class='weatherText'>The weather in <strong>${res.location.name}</strong> is <strong>${res.current.temp_c}</strong> <i>celsius</i>.</p>`
                    )
                )
                .catch((err) =>
                    $weatherInfo.append(`<p class='weatherText'>The location doesn't match our data, please try again.</p>`)
                )
    }

    $submitButton.on('click', (e) => {
            e.preventDefault();
            removeWeatherInfoElement();
            fetchData();
    });
})
