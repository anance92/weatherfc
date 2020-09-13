function initializePage(){
    var getCity = localStorage.getItem("city");
    console.log(getCity);

    if (getCity != null) {
        var history = JSON.parse(getCity);
        
        for (var i = 0; i < history.length; i++) {
            var searchedCity = history[i];
            addSearchHistoryItem(searchedCity);
        }
    }
}
initializePage();

function addSearchHistoryItem(city) {
    
    var lastCity = document.createElement("h5");
    var lastCityContainer = document.createElement("div");
    lastCity.innerHTML = city;
    lastCityContainer.classList.add("list-group-item");
    lastCityContainer.classList.add("list-group-item-action");
    
    lastCityContainer.appendChild(lastCity);
    var searchHistoryContainer = document.querySelector("#searchHistory");
    searchHistoryContainer.appendChild(lastCityContainer);
    lastCityContainer.addEventListener("click", function() {
        //console.log(this.textContent);
        //console.log("I was clicked");
        showWeather(this.textContent);
    });
}

function addSearchHistory(city) {
    var getCity = localStorage.getItem("city");
    var cityArray = [];
    
    // if getCity is empty, make new array of city
    if (getCity == null) {
        cityArray = [city];
    } else {
        cityArray = JSON.parse(getCity);
        cityArray.push(city);
    }
    
    // if it's not empty
    var citystring = JSON.stringify(cityArray);
    
    localStorage.setItem("city", citystring);

    addSearchHistoryItem(city);
}

function handleSearchEvent(){
    var city = document.querySelector("#searchTerm").value;
    addSearchHistory(city);
    
    showWeather(city);
}

function showWeather(city) {
    var FCcontainer = document.querySelector("#forecastContainer");
    FCcontainer.innerHTML = "";

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=` + city + `&units=imperial&appid=58aa8245b304cb67e8aaf0db4a500248
     `)
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        
        var cityName = document.createElement("h3");
        cityName.innerHTML = response.name;

        var currentDate = document.createElement("h5");
        currentDate.innerHTML = moment().format("dddd, MMMM Do YYYY");

        var temp = document.createElement("p");
        var tempF = response.main.temp;
        temp.innerHTML = "Temperature: " + tempF + " *F";

        var humidity = document.createElement("p");
        humidity.innerHTML = "Humidity: " + response.main.humidity + "%";

        var windsp = document.createElement("p");
        windsp.innerHTML = "Wind Speed: " + response.wind.speed + " m/s";
        
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
        var uvIndex = document.createElement("p");
        
        var lat = response.coord.lat;
        var lon = response.coord.lon;

        fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=` + lat + `&lon=` + lon 
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
        var icon = response.weather[0].icon;
        
        fetch(`https://openweathermap.org/img/wn/` + icon + `@2x.png`)
        .then(function(response) {
            return response;
        })
        .then(function(response) {
            var iconli = document.createElement("img");
            iconli.src = response.url;
            weather.appendChild(iconli);
            var container = document.querySelector("#weatherContainer");
            container.appendChild(weather);
        }); 
   
        // fetch to get forecast
        var cnt = 5;

        fetch(`https://api.openweathermap.org/data/2.5/forecast/?q=` + city  
        + `&cnt=` + cnt + `&units=imperial&appid=58aa8245b304cb67e8aaf0db4a500248`)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            for (var count=0; count<=4; count++) {

                console.log(response);
                var weatherDescriptionFC = document.createElement("li");
                var humidityFC = document.createElement("li");
                var humFC = response.list[count].main.humidity;

                humidityFC.innerHTML = "Humidity: " + humFC + "%";

                weatherDescriptionFC.innerHTML = "Expect " + response.list[count].weather[0].description;
                var tempFC = document.createElement("li");
                var temperatureFC = response.list[count].main.temp;
                
                tempFC.innerHTML = "Temp: " + temperatureFC + " *F";
                //console.log(temperatureFC);
                var FCweather = document.createElement("ul");
                
                FCweather.appendChild(weatherDescriptionFC);
                FCweather.appendChild(tempFC);
                FCweather.appendChild(humidityFC);
                
                var fcdesc = document.createElement("div");
                fcdesc.classList.add("fcdiv");
                var days = count +1;
                fcdesc.innerHTML = moment().add(days,'d').format("dddd, MMMM Do YYYY");
                fcdesc.appendChild(FCweather);
                
                /*fetch(`https://openweathermap.org/img/wn/` + icon + `@2x.png`)
                .then(function(response) {
                    return response;
                })
                .then(function(response) {
                    var iconli = document.createElement("img");
                    iconli.src = response.url;
                    FCweather.appendChild(iconli);
                    var container = document.querySelector("#weatherContainer");
                    fcdesc.appendChild(FCweather);
                }); */

                //FCcontainer.innerHTML = "";
                FCcontainer.appendChild(fcdesc);
            }
        }); 
    })
}