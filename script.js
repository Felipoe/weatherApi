const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
let map; 
let marker;

function initializeMap() {
    map = L.map('map').setView([20, 0], 2); 

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20,
    }).addTo(map);
}

const customIcon = L.icon({
    iconUrl: 'img/custom-marker.svg', 
    iconSize: [30, 30], 
    iconAnchor: [15, 30], 
    popupAnchor: [0, -30] 
});

search.addEventListener('click', () => {
    const APIKey = '8a8c82e05e9e9595b4056d861eaffcb7';
    const city = document.querySelector('.search-box input').value;

    if (city === '') return;

    weatherBox.classList.remove('active');
    weatherDetails.classList.remove('active');

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'img/clear.png';
                    break;
                case 'Rain':
                    image.src = 'img/rain.png';
                    break;
                case 'Snow':
                    image.src = 'img/snow.png';
                    break;
                case 'Clouds':
                    image.src = 'img/cloud.png';
                    break;
                case 'Mist':
                case 'Haze':
                    image.src = 'img/mist.png';
                    break;
                default:
                    image.src = 'img/cloud.png';
                    break;
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)} Km/h`;

            setTimeout(() => {
                weatherBox.classList.add('active');
                weatherDetails.classList.add('active');
            }, 100);

            const lat = json.coord.lat;
            const lon = json.coord.lon;

            map.flyTo([lat, lon], 10); 
        
            if (marker) {
                map.removeLayer(marker);
            }
            marker = L.marker([lat, lon], { icon: customIcon }).addTo(map).openPopup();
        })
        .catch(err => console.error('Erro ao buscar os dados: ', err));
});
initializeMap();
