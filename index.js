let btn = document.getElementById('searchBtn')
let cityName = document.getElementById('cityName')
const API_KEY = 'a020c8b4fab16c5ecce5b73dbb4681e8'
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5/weather'
const themeToggle = document.getElementById('themeToggle')

function setTheme(isLight) {
    document.body.classList.toggle('light', isLight)
    themeToggle.textContent = isLight ? 'Dark Mode' : 'Light Mode'
    localStorage.setItem('theme', isLight ? 'light' : 'dark')
}

const savedTheme = localStorage.getItem('theme')
setTheme(savedTheme === 'light')

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light')
    setTheme(!isLight)
})
async function fetchData(city) {
    try{
        cityName.value = ''
        console.log("city name", city)
        const url = new URL(WEATHER_API_BASE)
        url.search = new URLSearchParams({
            q: city,
            appid: API_KEY,
            units: 'metric',
        })

        const res = await fetch(url)
        const result = await res.json()

        if (!res.ok || result?.message) {
            document.getElementById("secondDiv").innerHTML = `<h1>${city || 'City'} ${result?.message || 'not found'}</h1>`
            return
        }

        displayWeather(result)
    }catch(err){
        console.log(err)
    }
}
async function fetchDataByCoordinated(lati,longi) {
    try{
        cityName.value = ''
        const url = new URL(WEATHER_API_BASE)
        url.search = new URLSearchParams({
            lat: String(lati),
            lon: String(longi),
            appid: API_KEY,
            units: 'metric',
        })

        const res = await fetch(url)
        const result = await res.json()
        console.log(result)

        if (!res.ok || result?.message) {
            document.getElementById("secondDiv").innerHTML = `<h1>${result?.message || 'Unable to fetch weather'}</h1>`
            return
        }

        displayWeather(result)
    }catch(err){
        console.log(err)
    }
}
btn.addEventListener('click', () => {
    fetchData(cityName.value)
})
function displayWeather({name,main,wind,weather}) {
    div = `<div id="weatherInfo">
                <p id="temp">${main.temp}°C</p>
                <p class="desc">${weather[0].description}</p>
                <img src='https://openweathermap.org/img/w/${weather[0].icon}.png'>
                <p id="city">${name}</p>
                <div class="otherInfo">
                    <div class="wind">
                        <p>Wind</p>
                        <p>${wind.speed}km/h</p>
                    </div>
                    <div class="wind">
                        <p>Pressure</p>
                        <p>${main.pressure}ma</p>
                    </div>
                    <div class="wind">
                        <p>Humidity</p>
                        <p>${main.humidity}%</p>
                    </div>
                </div>
            </div>`
    document.getElementById('secondDiv').innerHTML = div
}

document.getElementById("currLoc").addEventListener('click',()=>{
    navigator.geolocation.getCurrentPosition((position)=>{
        let lati =position.coords.latitude
        let longi =position.coords.longitude
        fetchDataByCoordinated(lati,longi)
    })
})