function addSearchHistory(city) {
    localStorage.setItem(city, city);

    var lastCity = document.createElement("h5");
    var lastCityContainer = document.createElement("div");
    lastCityContainer.classList.add("city");
    lastCity.innerHTML = city;
    lastCityContainer.appendChild(lastCity);
    var searchHistoryContainer = document.querySelector("#searchHistory");
    searchHistoryContainer.appendChild(lastCityContainer);
}


function myFunction() {
    var city = document.querySelector("#searchTerm").value;
    addSearchHistory(city);
    

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=` + city + `&appid=58aa8245b304cb67e8aaf0db4a500248
     `)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        
        var currentDate = document.createElement("li");
        currentDate.innerHTML = "Today: " + moment().format("dddd, MMMM Do YYYY");

        var cityName = document.createElement("li");
        cityName.innerHTML = "City: " + response.name;

        var temp = document.createElement("li");
        var tempF = Math.floor((response.main.temp - 273.15)* (9/5) + 32);
        temp.innerHTML = "Temperature: " + tempF + " *F";

        var humidity = document.createElement("li");
        humidity.innerHTML = "Humidity: " + response.main.humidity + "%";

        var windsp = document.createElement("li");
        windsp.innerHTML = "Wind Speed: " + response.wind.speed + " m/s";
        
        var uvIndex = document.createElement("li");
        
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        
        var iconli = document.createElement("li");
        var icon = response.weather[0].icon;
        
        var weather = document.createElement("ul");
        weather.appendChild(currentDate)
        weather.appendChild(cityName);
        weather.appendChild(temp);
        weather.appendChild(humidity);
        weather.appendChild(windsp);
        weather.appendChild(uvIndex);
        
        var container = document.querySelector("#weatherContainer");
        container.innerHTML = "";
        container.appendChild(weather);
        
        // fetch to get uv index value
        fetch(`http://api.openweathermap.org/data/2.5/uvi?lat=` + lat + `&lon=` + lon 
        + `&appid=58aa8245b304cb67e8aaf0db4a500248`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            if(response.value <=2) {
                uvIndex.classList.add("low");
            } else if(response.value > 2 && response.value <=5) {
                uvIndex.classList.add("moderate");
            } else if(response.value > 5 && response.value <= 7) {
                uvIndex.classList.add("high");
            } else if(response.value > 7 && response.value <= 10) {
                uvIndex.classList.add("severe");
            } else {
                uvIndex.classList.add("extreme");
            }
            uvIndex.innerHTML = "UV Index: " + response.value;
            weather.appendChild(uvIndex);
            var container = document.querySelector("#weatherContainer");
            container.appendChild(weather);
        
        });

        // fetch to get weather icon 
        /*fetch(`http://openweathermap.org/img/wn/` + icon + `@2x.png`)
        .then(function(response) {
            console.log(response);
            return response.json();
        })
        .then(function(response) {
            
            iconli.innerHTML = "Weather Icon: " + response;
            weather.appendChild(iconli);
            var container = document.querySelector("#weatherContainer");
            container.appendChild(weather);

        }); */
   
        // fetch to get forecast
   
        fetch(`http://api.openweathermap.org/data/2.5/forecast/?q=` + city  
        + `&appid=58aa8245b304cb67e8aaf0db4a500248`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            var weatherDescriptionFC = document.createElement("li");
            
            weatherDescriptionFC.innerHTML = "Weather will be: " + response.list[0].weather[0].description;
            var tempFC = document.createElement("li");
            var temperatureFC = Math.floor((response.list[0].main.temp - 273.15)* (9/5) + 32);
            tempFC.innerHTML = "Temperature: " + temperatureFC + " *F";

            var FCweather = document.createElement("ul");
            FCweather.appendChild(weatherDescriptionFC);
            FCweather.appendChild(tempFC);
                
            var fcdesc = document.createElement("p");
            fcdesc.innerHTML = "Below is the forecast for the next day: ";
            var FCcontainer = document.querySelector("#forecastContainer");
            FCcontainer.innerHTML = "";
            FCcontainer.appendChild(fcdesc);
            FCcontainer.appendChild(FCweather);
        }); 

    })

    
}