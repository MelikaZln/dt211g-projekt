"use strict";

function searchCity() {
  var e = document.getElementById("cityInput").value,
    t = new google.maps.Map(document.getElementById("map"), {
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 10
    }),
    n = {
      query: e,
      fields: ["name", "geometry"]
    };
  new google.maps.places.PlacesService(t).findPlaceFromQuery(n, function (e, n) {
    if (n === google.maps.places.PlacesServiceStatus.OK) {
      t.setCenter(e[0].geometry.location);
      new google.maps.Marker({
        map: t,
        position: e[0].geometry.location
      });
    }
  });
}
function getTimezone() {
  var e = document.getElementById("cityInput").value;
  fetch("https://maps.googleapis.com/maps/api/geocode/json?address=".concat(e, "&key=AIzaSyCyzJpyMvzQrkMx2Nhb39itNxmBMfRbw64")).then(function (e) {
    return e.json();
  }).then(function (t) {
    if ("ZERO_RESULTS" !== t.status) {
      var n = t.results[0].geometry.location.lat,
        o = t.results[0].geometry.location.lng;
      fetch("https://maps.googleapis.com/maps/api/timezone/json?location=".concat(n, ",").concat(o, "&timestamp=").concat(Date.now() / 1e3, "&key=AIzaSyCyzJpyMvzQrkMx2Nhb39itNxmBMfRbw64")).then(function (e) {
        return e.json();
      }).then(function (t) {
        var n = t.timeZoneId,
          o = t.timeZoneName;
        document.getElementById("timezone-info").innerText = "Tidszon f\xF6r ".concat(e, ": ").concat(o, " (").concat(n, ")");
      })["catch"](function (e) {
        console.error("Fel vid hämtning av tidszon:", e);
      });
    } else document.getElementById("timezone-info").innerText = "Staden, ".concat(e, ", hittades inte!");
  })["catch"](function (t) {
    console.error("Fel vid hämtning av stadskoordinater:", t), document.getElementById("timezone-info").innerText = "Staden ".concat(e, " hittades inte!");
  });
}
function getWeather() {
  var e = document.getElementById("cityInput").value;
  fetch("https://api.openweathermap.org/data/2.5/weather?q=".concat(e, "&appid=cd57e09d6d65c8196f784c17892e4f50")).then(function (e) {
    return e.json();
  }).then(function (e) {
    var t = document.getElementById("weather-info");
    if (200 === e.cod) {
      var n = Math.round(e.main.temp - 273.15),
        o = e.weather[0].description,
        a = e.wind.speed,
        i = e.main.humidity;
      t.innerHTML = "<p><strong>Väder:</strong> " + o + "</p><p><strong>Temperatur:</strong> " + n + "°C</p><p><strong>Vindhastighet:</strong> " + a + " m/s</p><p><strong>Fuktighet:</strong> " + i + "%</p>";
    } else t.innerHTML = "Ingen väderinformation hittades för den sökta staden";
  })["catch"](function (e) {
    console.error("Error:", e);
  });
}