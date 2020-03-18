


/*--------------------------------------------------------------------------------------------------------------------------
--------------------------------------                   CLOCK                    ------------------------------------------
--------------------------------------------------------------------------------------------------------------------------*/

clock();

function clock() {
let time = new Date();

let h = time.getHours();
let m = time.getMinutes();
// let s = time.getSeconds();

if (h < 10) {
    h = "0" + h;
}

if (m < 10) {
    m = "0" + m;
}

// if (s < 10) {
//     s = "0" + s;
// }

document.querySelector('#clock').innerHTML = h + ":" + m /* + ":" + s; */

setInterval(clock, 1000);
}




/*--------------------------------------------------------------------------------------------------------------------------
-------------------------------                  API COLLECTING                  -------------------------------------------
--------------------------------------------------------------------------------------------------------------------------*/

// FUNCTION IS CALLED TO MAKE SURE SOMETHING IS SHOWN WHEN PAGE IS LOADED --------------------------------------------------
localCityWeather(6418538);

// FUNCTION FETCHES INFORMATION WITH API KEY AND SENDS IT OUT TO OTHER FUNCTIONS AS PERIMETERS -----------------------------
function localCityWeather(retrievedCityId) {
  let key = 'de97c3b7a479f34a41669ec88bc3d661';
  fetch('https://api.openweathermap.org/data/2.5/weather?id=' + retrievedCityId + '&units=metric&appid=' + key)  
    
    .then(function(resp) {
       return resp.json()
       // content stream is being converted to JSON
    })

    .then(function(data) {
        console.log(data);

        inputWeatherData(data);
        sunriseAndSunset(data);
        // newly converted JSON data is being sent to "inputWeaterData" and "sunriseAndSunset" as a parameter
    })
}




// FUNCTION DISPLAYS GATHERED INFORMATION ---------------------------------------------------------------------------------
function inputWeatherData(retrievedData) {

    // Some of the city and region names were weird so I chose to manually change them,
        // this is only relevant because of my chosen regions
    if (retrievedData.name == 'Capital Region') {
        document.querySelector('.location').innerHTML = 'Region hovedstaden';
    } else {
        if (retrievedData.name == 'Region Zealand') {
            document.querySelector('.location').innerHTML = 'Region Sjælland';
        } else {
            if (retrievedData.name == 'Region South Denmark') {
                document.querySelector('.location').innerHTML = 'Region Syddanmark';
            } else {
                if (retrievedData.name == 'Central Jutland') {
                    document.querySelector('.location').innerHTML = 'Region Midtjylland';
                } else {
                    if (retrievedData.name == 'North Denmark') {
                        document.querySelector('.location').innerHTML = 'Region Nordjylland';
                    } else {
                        // This is the only necessary line of code to display fetched city name
                        document.querySelector('.location').innerHTML = retrievedData.name;
                    }
                }
            }
        }
    }
    document.querySelector('.weather').innerHTML = retrievedData.weather['0'].description;
    document.querySelector('.temperature').innerHTML = 'Feels like<br> ' + retrievedData.main.feels_like.toFixed() + '°C';

    // EXTRA TEXT VARIATION ON TEMPERATURE, NOTHING IMPORTANT --------------------------------------------------------------
    if (retrievedData.main.feels_like <= 3) {
        document.querySelector('.temperature').innerHTML = "it's chilly!<br>" + retrievedData.main.feels_like.toFixed() + "°C";
    }

    if (retrievedData.main.feels_like <= 0) {
        document.querySelector('.temperature').innerHTML = "it's freezing!<br>" + retrievedData.main.feels_like.toFixed() + "°C";
    }

    if (retrievedData.main.feels_like > 23) {
        document.querySelector('.temperature').innerHTML = 'Get the suncreen!<br>' + retrievedData.main.feels_like.toFixed() + '°C';
    }
}



// FUNCTION DISPLAYS GATHERED INFORMATION DEPENDING ON TIME OF DAY --------------------------------------------------------
function sunriseAndSunset(retrievedData) {

    // SUNRISE ------------------------------------------------------------------------------------------------------------
    // Calculates sunrise in military time and displays it
    let sunriseUnix = retrievedData.sys.sunrise;
    let sunrise = new Date(sunriseUnix * 1000);
    let sunriseHour = sunrise.getHours();
    let sunriseMinute = sunrise.getMinutes();

    let sunriseComplete = sunriseHour + ':' + sunriseMinute;

    document.querySelector('.sunrise').innerHTML = 'The sun will rise ' + sunriseComplete;

    // SUNSET -------------------------------------------------------------------------------------------------------------
    // Calculates sunset in military time and displays it
    let sunsetUnix = retrievedData.sys.sunset;
    let sunset = new Date(sunsetUnix * 1000);
    let sunsetHour = sunset.getHours();
    let sunsetMinute = sunset.getMinutes();

    let sunsetComplete = sunsetHour + ':' + sunsetMinute;

    document.querySelector('.sunset').innerHTML = 'The sun will set ' + sunsetComplete;

    // MORNING ------------------------------------------------------------------------------------------------------------
    let morningHour = sunriseHour - 2;
    // EVENING ------------------------------------------------------------------------------------------------------------
    let eveningHour = sunsetHour - 2;

    // GETS CURRENT HOUR --------------------------------------------------------------------------------------------------
    let currentTime = new Date();
    let currentHour = currentTime.getHours();

    // FUNCTION DOES STUFF WHEN SUN IS DOWN -------------------------------------------------------------------------------
     if (currentHour >= eveningHour && currentHour < sunsetHour ) {
         document.querySelector('body').classList.add('backgroundEvening');
     } else {
        if (currentHour >= sunsetHour || currentHour >= 0 && currentHour < sunriseHour && currentHour <= morningHour) { 
        document.querySelector('body').classList.remove('backgroundEvening');
        document.querySelector('body').classList.remove('backgroundMorning'); 
        document.querySelector('body').classList.remove('backgroundDay');
        document.querySelector('body').classList.add('backgroundNight');

        document.querySelector('#cityDropdown').classList.add('fontColor');
        document.querySelector('.lower-div').style.background = 'none'
        // let tabletIcons = document.querySelectorAll('div.tablet-icon-style');
        // for (let i = 0; i < tabletIcons.length; i++) {
        //     tabletIcons[i].style.backgroundColor = 'rgba(255, 255, 255, 0.24)';
        
    // ELSE DO STUFF WHEN SUN IS UP ----------------------------------------------------------------------------------------
        } else {
            if (currentHour > 0 && currentHour >= morningHour && currentHour <= sunriseHour) {
                document.querySelector('body').classList.remove('backgroundEvening');
                document.querySelector('body').classList.remove('backgroundNight');
                document.querySelector('body').classList.remove('backgroundDay');
                document.querySelector('body').classList.add('backgroundMorning');
            } else {
                if (currentHour >= sunriseHour) {
                    document.querySelector('body').classList.remove('backgroundEvening');
                    document.querySelector('body').classList.remove('backgroundNight');
                    document.querySelector('body').classList.remove('backgroundMorning');
                    document.querySelector('body').classList.add('backgroundDay');

                    document.querySelector('#cityDropdown').classList.remove('fontColor');
                }
            }
        }
    }

    // DISPLAYS CORRECT LOGO DEPENDING ON THE CURRENT WEATHER AND TIME OF DAY ----------------------------------------------
    if (retrievedData.weather[0].main == 'Clear' && currentHour >= sunsetHour
        || retrievedData.weather[0].main == 'Clear' && currentHour >= 0 && currentHour < sunriseHour ) {
        document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/01n.png';
    } else {
        if (retrievedData.weather[0].main == 'Clear' && currentHour >= sunriseHour) {
            document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/01d.png';
        }
    }

    if (retrievedData.weather[0].main == 'Clouds' && currentHour >= sunsetHour 
        || retrievedData.weather[0].main == 'Clouds' && currentHour >= 0 && currentHour < sunriseHour ) {
        document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/02n.png';
    } else {
        if (retrievedData.weather[0].main == 'Clouds' && currentHour >= sunriseHour) {
            document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/02d.png';
        }
    }

    if (retrievedData.weather[0].main == 'Rain' && currentHour >= sunsetHour
        || retrievedData.weather[0].main == 'Drizzle' && currentHour >= sunsetHour
            || retrievedData.weather[0].main == 'Rain' && currentHour >= 0 && currentHour < sunriseHour
                || retrievedData.weather[0].main == 'Drizzle' && currentHour >= 0 && currentHour < sunriseHour ) {
        document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/09n.png';
    } else {
        if (retrievedData.weather[0].main == 'Rain' && currentHour >= sunriseHour
            || retrievedData.weather[0].main == 'Drizzle' && currentHour >= sunriseHour) {
            document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/09d.png';
        }
    }

    if (retrievedData.weather[0].main == 'Thunderstorm' && currentHour >= sunsetHour
        || retrievedData.weather[0].main == 'Thunderstorm' && currentHour >= 0 && currentHour < sunriseHour ) {
        document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/11n.png';
    } else {
        if (retrievedData.weather[0].main == 'Thunderstorm' && currentHour >= sunriseHour) {
            document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/11d.png';
        }
    }

    if (retrievedData.weather[0].main == 'Snow' && currentHour >= sunsetHour
        || retrievedData.weather[0].main == 'Snow' && currentHour >= 0 && currentHour < sunriseHour ) {
        document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/13n.png';
    } else {
        if (retrievedData.weather[0].main == 'Snow' && currentHour >= sunriseHour) {
            document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/13d.png';
        }
    }

    if (retrievedData.weather[0].main == 'Mist' && currentHour >= sunsetHour 
        || retrievedData.weather[0].main == 'Fog' && currentHour >= sunsetHour
            || retrievedData.weather[0].main == 'Haze' && currentHour >= sunsetHour
                || retrievedData.weather[0].main == 'Mist' && currentHour >= 0 && currentHour < sunriseHour 
                    || retrievedData.weather[0].main == 'Fog' && currentHour >= 0 && currentHour < sunriseHour 
                        || retrievedData.weather[0].main == 'Haze' && currentHour >= 0 && currentHour < sunriseHour ) {
        document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/50n.png';
    } else {
        if (retrievedData.weather[0].main == 'Mist' && currentHour >= sunriseHour
            || retrievedData.weather[0].main == 'Fog' && currentHour >= sunriseHour
               || retrievedData.weather[0].main == 'Haze' && currentHour >= sunriseHour) {
            document.querySelector('#logo').src = 'http://openweathermap.org/img/wn/50d.png';
        }
    }
}




/*-----------------------------------------------------------------------------------------------------------------------
---------------------------                   MAP FUNCTIONING                   -----------------------------------------
------------------------------------------------------------------------------------------------------------------------*/


// FUNCTION MAKES THE <SELECT> DROPDOWN MENU SEND UPDATED PERIMETER INFORMATION WHEN CHANGED ----------------------------
document.querySelector('#cityDropdown').addEventListener('change', function(){
    let cityId = document.querySelector('#cityDropdown').value;
    localCityWeather(cityId);
    // change in location is being sent to function "localCityWeater" as a parameter
})



// THESE FUNCTIONS UPDATE THE MAP TO SHOW THE CURRENTLY SELECTED MAP POINT WHEN DROPDOWN IS CHANGED ---------------------
document.querySelector('#option1').addEventListener('click', function(){
        document.querySelector('#point1').classList.add('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#option2').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.add('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#option3').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.add('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#option4').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.add('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#option5').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.add('currentPoint');
})



// THESE FUNCTIONS UPDATE THE MAP TO SHOW THE CURRENTLY SELECTED MAP POINT WHEN THEY ARE CLICKED ----------------------
document.querySelector('#point1').addEventListener('click', function(){
        document.querySelector('#point1').classList.add('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#point2').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.add('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#point3').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.add('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#point4').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.add('currentPoint');
        document.querySelector('#point5').classList.remove('currentPoint');
})

document.querySelector('#point5').addEventListener('click', function(){
        document.querySelector('#point1').classList.remove('currentPoint');
        document.querySelector('#point2').classList.remove('currentPoint');
        document.querySelector('#point3').classList.remove('currentPoint');
        document.querySelector('#point4').classList.remove('currentPoint');
        document.querySelector('#point5').classList.add('currentPoint');
})



// THESE FUNCTIONS UPDATE THE DROPDOWN MENU WHEN MAP POINTS ARE CLICKED --------------------------------------------
document.querySelector('#point1').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#point1').getAttribute('data-value');
    document.querySelector('#cityDropdown').selectedIndex = 0;
    localCityWeather(cityIdPoint);
})

document.querySelector('#point2').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#point2').getAttribute('data-value');
    document.querySelector('#cityDropdown').selectedIndex = 1;
    localCityWeather(cityIdPoint);
})

document.querySelector('#point3').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#point3').getAttribute('data-value');
    document.querySelector('#cityDropdown').selectedIndex = 2;
    localCityWeather(cityIdPoint);
})

document.querySelector('#point4').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#point4').getAttribute('data-value');
    document.querySelector('#cityDropdown').selectedIndex = 3;
    localCityWeather(cityIdPoint);
})

document.querySelector('#point5').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#point5').getAttribute('data-value');
    document.querySelector('#cityDropdown').selectedIndex = 4;
    localCityWeather(cityIdPoint);
})





// THESE FUNCTIONS UPDATE LOCATION WHEN TABLET ICONS ARE CLICKED --------------------------------------------------
document.querySelector('#hovedstaden').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#hovedstaden').getAttribute('data-value');
    localCityWeather(cityIdPoint);
})

document.querySelector('#sjaelland').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#sjaelland').getAttribute('data-value');
    localCityWeather(cityIdPoint);
})

document.querySelector('#syddanmark').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#syddanmark').getAttribute('data-value');
    localCityWeather(cityIdPoint);
})

document.querySelector('#midtjylland').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#midtjylland').getAttribute('data-value');
    localCityWeather(cityIdPoint);
})

document.querySelector('#nordjylland').addEventListener('click', function(){
    let cityIdPoint = document.querySelector('#nordjylland').getAttribute('data-value');
    localCityWeather(cityIdPoint);
})






