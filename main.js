import "./style.css"

var map = L.map("map").setView([51.505, -0.09], 3)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution:
		'&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

var ap = L.icon({
	iconUrl: "./ap.svg",
	iconSize: [30, 30],
	iconAnchor: [15, 15],
	popupAnchor: [0, -15],
})

var data = localStorage.getItem("airports")
const api =
	"https://raw.githubusercontent.com/andrebellu/AirportJSON/main/airports.json"
const search = document.getElementById("search")
const btn = document.getElementById("btn")

const callApi = () => {
	fetch(api)
		.then((res) => res.json())
		.then((body) => {
			localStorage.setItem("airports", JSON.stringify(body))
		})
}

const updateMap = (data) => {
	map.eachLayer((layer) => {
		if (layer instanceof L.Marker) {
			map.removeLayer(layer)
		}
	})

	for (let k in data) {
		const airport = data[k]
		const marker = L.marker([airport.latitude, airport.longitude], {
			icon: ap,
		}).addTo(map)
		marker.bindPopup(airport.name)
	}
}

btn.onclick = () => {
	var value = search.value.toUpperCase()
	var filtered = {}

	fetch(api)
		.then((r) => r.json())
		.then((data) => {
			filtered = data.filter(
				(airport) =>
					airport.name.toUpperCase().includes(value) ||
					airport.country.toUpperCase().includes(value) ||
					airport.city.toUpperCase().includes(value)
			)
			updateMap(filtered)
		})
}

search.oninput = () => {
	if (search.value.length > 2) {
		btn.disabled = false
	} else {
		btn.disabled = true
	}
}

if (data == null) {
	callApi()
} else {
	data = JSON.parse(data)
}
