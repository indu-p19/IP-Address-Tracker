'use strict'
import API_KEY from './config.js'

const ipAddressField = document.querySelector('.ipAddressField')
const timezoneInput = document.querySelector('.timezoneInput')
const countryLocationInput = document.querySelector('.locationInput')
const ispInput = document.querySelector('.ispInput')
const submitBtn = document.querySelector('.submit-btn')
const inputField = document.querySelector('.input-field')

// Map initialization
let map = L.map('map').setView([51.505, -0.09], 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)

// Fetch initial IP data
let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=`
fetch(url)
  .then((response) => response.json())
  .then((response) => {
    updateUI(response)
  })
  .catch(error => {
    console.error('Error fetching IP data:', error)
    alert('Failed to load initial location data. Please try again later.')
  })

const updateUI = (response) => {
  const { ip, time_zone, country_name, city, zipcode, isp, latitude, longitude } = response
  
  ipAddressField.innerHTML = ip
  timezoneInput.innerHTML = `UTC ${time_zone.offset}`
  countryLocationInput.innerHTML = `${country_name}, ${city} ${zipcode}`
  ispInput.innerHTML = isp
  mapLocation(latitude, longitude)
}

const mapLocation = (lat, lng) => {
  var markerIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
    iconSize: [46, 56],
    iconAnchor: [23, 55],
  })
  
  map.setView([lat, lng], 17)
  L.marker([lat, lng], { icon: markerIcon }).addTo(map)
}

// Search by IP
submitBtn.addEventListener('click', (event) => {
  event.preventDefault()
  const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  if (ipRegex.test(inputField.value)) {
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${inputField.value}`
    fetch(url)
      .then((response) => response.json())
      .then(updateUI)
      .catch(error => {
        console.error('Error fetching IP data:', error)
        alert('Failed to fetch location data for this IP. Please try again.')
      })
  } else {
    alert('You have entered an invalid IP address!')
  }
})