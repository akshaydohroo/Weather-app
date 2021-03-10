window.onload = () => {
  let API_KEY = "6564f991bc2b472f86df38bd7e1e3038";
  let base_url = "https://api.weatherbit.io/v2.0/current";
  let longitude;
  let latitude;
  const search_city = document.querySelector(".search_city");
  if (window.navigator) {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        getCurrentWeather({ lat: latitude, long: longitude });
      },
      (error) => {
        throw error;
      }
    );
  }
  search_city.addEventListener("keydown", (evt) => {
    if (evt.keyCode == 13) {
      search_city.value = search_city.value.trim();
      var arr = search_city.value.split(" ");
      if(arr[1])
        getCurrentWeather({ city: arr[0].trim(),country:arr[1].trim()});
    else{
        getCurrentWeather({ city: arr[0].trim()});
    }
      search_city.value = "";
    }
  });

  function displayCurrentWeatherResults(current_weather) {
    current_weather = current_weather.data[0];
    let location = document.querySelector(".location");
    let date = document.querySelector(".date");
    let temperature_value = document.querySelector(".temperature_value");
    let weather_name = document.querySelector(".weather_name");
    let range = document.querySelector(".range");
    let a = getCountryName(current_weather.country_code);
    getCountryName(current_weather.country_code).then((country) => {
      location.textContent = `${current_weather.city_name}, ${country}`;
    });

    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let dateOfMonth = current_weather.datetime.substring(8, 10);
    if (dateOfMonth.charAt(0) == "0") {
      dateOfMonth = dateOfMonth.substring(1);
    }
    let month = months[current_weather.datetime.substring(5, 7) - 1];
    let year = current_weather.datetime.substring(0, 4);
    date.textContent = `${dateOfMonth} ${month} ${year}`;
    temperature_value.textContent = current_weather.temp + "°C";
    weather_name.textContent = current_weather.weather.description;
    if (current_weather.pod == "n") {
      document.body.style.background =
        ' url("../images/night.webp") no-repeat center center fixed';
      document.body.style.backgroundSize = "cover";
      document.body.style.color = "black";
    } else {
      document.body.style.background =
        ' url("../images/after_noon.webp") no-repeat center center fixed';
      document.body.style.backgroundSize = "cover";
      document.body.style.color = "white";
    }
  }

  function fetchCurrentWeather(url) {
    fetch(url, {
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
    })
      .then((response) => {
        return response.json();
      })
      .then(displayCurrentWeatherResults);
  }

  function getCurrentWeather(options) {
    if (options.lat && options.long) {
      fetchCurrentWeather(
        `${base_url}?lat=${options.lat}&lon=${options.long}&key=${API_KEY}`
      );
    } else if (options.city&&options.country) {
      fetchCurrentWeather(`${base_url}?city=${options.city}&country=${options.country}&key=${API_KEY}`);
    }
    else if(options.city){
        fetchCurrentWeather(`${base_url}?city=${options.city}&key=${API_KEY}`);
    }
  }

  async function getCountryName(countryCode) {
    let res = await fetch("./countryCode.json");

    let isoCountries = await res.json();

    if (isoCountries[countryCode]) {
      return isoCountries[countryCode];
    } else {
      return countryCode;
    }
  }
};
