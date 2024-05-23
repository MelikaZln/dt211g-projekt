// Funktion för att söka efter en stad på kartan
function searchCity() {
    // Hämta värdet från sökfältet för staden
    var city = document.getElementById('cityInput').value;
    
    // Skapa en ny Google Maps-karta med standardcentrum och zoomnivå
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 0, lng: 0}, 
        zoom: 10 
    });
    
    // Skapa en förfrågan för att söka efter staden med namn och geometri
    var request = {
        query: city,
        fields: ['name', 'geometry']
    };
    
    // Skapa en tjänst för platser på kartan
    var service = new google.maps.places.PlacesService(map);
    
    // Utför sökningen baserat på förfrågan
    service.findPlaceFromQuery(request, function(results, status) {
        // Om sökningen är lyckad (status OK)
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            // Centrera kartan till den första resultatets plats
            map.setCenter(results[0].geometry.location);
            // Skapa en markör på kartan för den hittade platsen
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        }
    });
}

// Funktion för att hämta tidszon för en stad
function getTimezone() {
    // Hämta värdet från sökfältet för staden
    var city = document.getElementById("cityInput").value;

    // Hämta geografiska koordinater för staden från Google Maps Geocoding API
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=AIzaSyCyzJpyMvzQrkMx2Nhb39itNxmBMfRbw64`)
        .then(response => response.json())
        .then(data => {
            // Om inga resultat hittades för staden
            if (data.status === "ZERO_RESULTS") {
                document.getElementById("timezone-info").innerText = `Staden, ${city}, hittades inte!`;
                return;
            }

            // Extrahera latitud och longitud från de geografiska koordinaterna
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;

            // Hämta tidszoninformation för de geografiska koordinaterna från Google Maps Time Zone API
            fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Date.now() / 1000}&key=AIzaSyCyzJpyMvzQrkMx2Nhb39itNxmBMfRbw64`)
                .then(response => response.json())
                .then(data => {
                    // Extrahera tidszonens ID och namn
                    var timeZoneId = data.timeZoneId;
                    var timeZoneName = data.timeZoneName;
                    // Visa tidszoninformationen för staden på webbsidan
                    document.getElementById("timezone-info").innerText = `Tidszon för ${city}: ${timeZoneName} (${timeZoneId})`;
                })
                .catch(error => {
                    // Hantera fel vid hämtning av tidszon
                    console.error('Fel vid hämtning av tidszon:', error);
                });
        })
        .catch(error => {
            // Hantera fel vid hämtning av geografiska koordinater för staden
            console.error('Fel vid hämtning av stadskoordinater:', error);
            document.getElementById("timezone-info").innerText = `Staden ${city} hittades inte!`;
        });
}

// Funktion för att hämta väderinformation för en stad
function getWeather() {
    // Hämta värdet från sökfältet för staden
    var city = document.getElementById("cityInput").value;
    // Ange API-nyckel för OpenWeatherMap
    var apiKey = "cd57e09d6d65c8196f784c17892e4f50";
    // Konstruera URL för att hämta väderdata för den angivna staden
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    // Använd fetch för att hämta väderdata från OpenWeatherMap API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Hämta referens till elementet för väderinformation på webbsidan
            var weatherInfo = document.getElementById("weather-info");
            // Om väderdatan hämtades framgångsrikt (HTTP-statuskod 200)
            if (data.cod === 200) {
                // Extrahera temperatur från väderdatan och konvertera från Kelvin till Celsius
                var temperature = Math.round(data.main.temp - 273.15);
                // Extrahera väderbeskrivning från väderdatan
                var weatherDescription = data.weather[0].description;
                // Extrahera vindhastighet från väderdatan
                var windSpeed = data.wind.speed;
                // Extrahera luftfuktighet från väderdatan
                var humidity = data.main.humidity;
                // Uppdatera väderinformationselementet på webbsidan med hämtad väderinformation
                weatherInfo.innerHTML = "<p><strong>Väder:</strong> " + weatherDescription + "</p>" +
                                        "<p><strong>Temperatur:</strong> " + temperature + "°C</p>" +
                                        "<p><strong>Vindhastighet:</strong> " + windSpeed + " m/s</p>" +
                                        "<p><strong>Fuktighet:</strong> " + humidity + "%</p>";
            } else {
                // Om ingen väderdata hittades för den angivna staden
                weatherInfo.innerHTML = "Ingen väderinformation hittades för den sökta staden";
            }
        })
        .catch(error => {
            // Hantera eventuella fel vid hämtning av väderdata
            console.error('Error:', error);
        });
}
