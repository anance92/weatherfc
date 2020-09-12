

function initializePage(){
    var getCity = localStorage.getItem("city");
    console.log(getCity);

    if (getCity != null) {
        var history = JSON.parse(getCity);
        
        for (var i = 0; i < history.length; i++) {

            var lastCity = document.createElement("h5");
            var lastCityContainer = document.createElement("div");
            
            lastCityContainer.classList.add("list-group-item");
            lastCityContainer.classList.add("list-group-item-action");
            lastCity.innerHTML = history[i];
            lastCityContainer.appendChild(lastCity);
            var searchHistoryContainer = document.querySelector("#searchHistory");
            searchHistoryContainer.appendChild(lastCityContainer);
        }
    }
    /*lastCityContainer.addEventListener("click", function() {
        console.log(city);
        console.log("I was clicked");
        showWeather(city);
    });*/
}
initializePage();

function addSearchHistory(city) {
    var getCity = localStorage.getItem("city");
    var cityArray = [];
    
    // is getCity empty, make new array of city
    if (getCity == null) {
        cityArray = [city];
    } else {
        cityArray = JSON.parse(getCity);
        cityArray.push(city);
    }
    
    // if it's not empty
    var citystring = JSON.stringify(cityArray);
    
    localStorage.setItem("city", citystring);

    var lastCity = document.createElement("h5");
    var lastCityContainer = document.createElement("div");
    lastCityContainer.classList.add("list-group-item");
    lastCityContainer.classList.add("list-group-item-action");
    lastCity.innerHTML = city;
    lastCityContainer.appendChild(lastCity);
    var searchHistoryContainer = document.querySelector("#searchHistory");
    searchHistoryContainer.appendChild(lastCityContainer);

    lastCityContainer.addEventListener("click", function() {
        console.log(city);
        console.log("I was clicked");
        showWeather(city);
    });
}

function handleSearchEvent(){
    var city = document.querySelector("#searchTerm").value;
    addSearchHistory(city);
    
    showWeather(city);
}

function showWeather(city) {
    var FCcontainer = document.querySelector("#forecastContainer");
    FCcontainer.innerHTML = "";

    fetch(`http://api.openweathermap.org/data/2.5/weather?q=` + city + `&units=imperial&appid=58aa8245b304cb67e8aaf0db4a500248
     `)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        
        var cityName = document.createElement("h3");
        cityName.innerHTML = response.name;

        var currentDate = document.createElement("li");
        currentDate.innerHTML = "Today: " + moment().format("dddd, MMMM Do YYYY");

        var temp = document.createElement("li");
        var tempF = response.main.temp;
        //var tempF = Math.floor((response.main.temp - 273.15)* (9/5) + 32);
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
        weather.appendChild(cityName);
        weather.appendChild(currentDate)
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
        var cnt = 5;
        fetch(`http://api.openweathermap.org/data/2.5/forecast/?q=` + city  
        + `&cnt=` + cnt + `&units=imperial&appid=58aa8245b304cb67e8aaf0db4a500248`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            for (var count=0; count<=4; count++) {
                var weatherDescriptionFC = document.createElement("li");
                //console.log(response.list[count].weather[0].description);
                weatherDescriptionFC.innerHTML = "Weather will be: " + response.list[count].weather[0].description;
                var tempFC = document.createElement("li");
                var temperatureFC = response.list[count].main.temp;
                //var temperatureFC = Math.floor((response.list[count].main.temp - 273.15)* (9/5) + 32);
                tempFC.innerHTML = "Temperature: " + temperatureFC + " *F";
                //console.log(temperatureFC);
                var FCweather = document.createElement("ul");
                FCweather.appendChild(weatherDescriptionFC);
                FCweather.appendChild(tempFC);
                
                var fcdesc = document.createElement("div");
                fcdesc.classList.add("fcdiv");
                //
                fcdesc.innerHTML = "Below is the forecast for the next day: ";
                fcdesc.appendChild(FCweather);
                
                //FCcontainer.innerHTML = "";
                FCcontainer.appendChild(fcdesc);
                
            }
        }); 
    })
}

