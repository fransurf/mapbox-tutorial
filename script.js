mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbnN1cmYiLCJhIjoiY2wzOGxjZjNhMDB6bjNsbzE2NTN0MWhlMCJ9.fe6K99Y7XfdIZ2sd1xpAJA'

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  // Change centre to over sea??
  center: [-3.0370, 53.8167],
  zoom: 5,
  scrollZoom: true,
})

map.addControl(new mapboxgl.NavigationControl())

// * Vessels data
const vessels = [
  {
    "mmsi": 229998000,
    "timestamp": "2022-07-31 13:00:00+00:00",
    "lat": 51.1178166667,
    "long": 1.8051383333,
    "heading": 44.0,
    "speed": 13.1,
    "course": 46.3,
    "name": "vessel_5",
    "imo": 1234572
  },
  {
    "mmsi": 235104277,
    "timestamp": "2022-08-04 16:00:00+00:00",
    "lat": 50.8946266667,
    "long": -1.4047433333,
    "heading": 360.0,
    "speed": 0.0,
    "course": 360.0,
    "name": "vessel_0",
    "imo": 1234567
  },
  {
    "mmsi": 244180842,
    "timestamp": "2022-08-04 06:00:00+00:00",
    "lat": 50.9904066667,
    "long": 1.759585,
    "heading": 60.3,
    "speed": 8.3,
    "course": 60.3,
    "name": "vessel_7",
    "imo": 1234574
  },
  {
    "mmsi": 257315000,
    "timestamp": "2022-08-02 20:00:00+00:00",
    "lat": 59.5041483333,
    "long": -4.4489066667,
    "heading": 329.0,
    "speed": 14.1,
    "course": 333.1,
    "name": "vessel_4",
    "imo": 1234571
  },
  {
    "mmsi": 311000610,
    "timestamp": "2022-08-05 13:00:00+00:00",
    "lat": 59.4679633333,
    "long": 1.3914133333,
    "heading": 46.0,
    "speed": 12.2,
    "course": 47.0,
    "name": "vessel_1",
    "imo": 1234568
  },
  {
    "mmsi": 353557000,
    "timestamp": "2022-08-05 13:00:00+00:00",
    "lat": 51.0617433333,
    "long": -6.0092583333,
    "heading": 179.0,
    "speed": 10.7,
    "course": 180.0,
    "name": "vessel_2",
    "imo": 1234569
  },
  {
    "mmsi": 416070000,
    "timestamp": "2022-08-03 23:00:00+00:00",
    "lat": 51.1878466667,
    "long": 1.7653466667,
    "heading": 39.0,
    "speed": 13.8,
    "course": 38.0,
    "name": "vessel_8",
    "imo": 1234575
  },
  {
    "mmsi": 477232800,
    "timestamp": "2022-07-30 02:00:00+00:00",
    "lat": 49.02314,
    "long": -5.5407066667,
    "heading": 235.0,
    "speed": 17.4,
    "course": 237.0,
    "name": "vessel_3",
    "imo": 1234570
  },
  {
    "mmsi": 538005403,
    "timestamp": "2022-08-01 02:00:00+00:00",
    "lat": 51.1421483333,
    "long": 1.8069316667,
    "heading": 65.0,
    "speed": 13.0,
    "course": 61.0,
    "name": "vessel_6",
    "imo": 1234573
  },
  {
    "mmsi": 636020560,
    "timestamp": "2022-08-05 13:00:00+00:00",
    "lat": 49.7192166667,
    "long": -6.1741966667,
    "heading": 271.0,
    "speed": 13.6,
    "course": 270.0,
    "name": "vessel_9",
    "imo": 1234576
  }
]


// * Function to create GeoJSON with 'coordinates' KVP
const vesselsGeoJSON = vessels.map(ship => {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [ship.long, ship.lat],
    },
    properties: { ...ship },
  }
})

// * Function to create mapbox data structure
const vesselsObj = {
  "type": "FeatureCollection",
  "features": [...vesselsGeoJSON]
}

console.log('vesselsGeoJSON --->', vesselsGeoJSON)
console.log('vesselsObj --->', vesselsObj)

// * Adds data layer to map with geojson source
map.on('load', () => {
  map.addSource('places', {
    type: 'geojson', 
    data: vesselsObj
  })
  vesselsList(vesselsObj)
  addMarker()
})

// * Function to add custom markers to map at vessel locations
const addMarker = () => {
  for (const marker of vesselsObj.features) {
    // Create a div with marker-mmsi id and marker class
    const el = document.createElement('div')
    el.id = `marker-${marker.properties.mmsi}`
    el.className = 'marker'

    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map)

    // Click event => Fly to vessel, open display/remove existing & highlight in sidebar
    el.addEventListener('click', (e) => {
      flyToVessel(marker)
      displayPopUp(marker)

      const activeItem = document.getElementsByClassName('active')
      e.stopPropagation()
      if (activeItem[0]) activeItem[0].classList.remove('active')
      
      const listing = document.getElementById(`listing-${marker.properties.mmsi}`)
      listing.classList.add('active')
    })
  }
}

// * Adds vessel info to listings list & handles click
const vesselsList = (vesselsObj) => {
  for (const vessel of vesselsObj.features) {
    // * Add new listing div for each vessel
    const listings = document.getElementById('listings')
    const listing = listings.appendChild(document.createElement('div'))

    // * Assign mmsi id & item class to listing
    listing.id = `listing-${vessel.properties.mmsi}`
    listing.className = 'item'

    // * Add a link to the vessel??
    const link = listing.appendChild(document.createElement('a'))
    link.href = '#'
    link.className = 'title'
    link.id = `link-${vessel.properties.mmsi}`
    link.innerHTML = `${vessel.properties.name}`

    // * ADD ADDITIONAL DETAILS
    const details = listing.appendChild(document.createElement('div'))
    details.innerHTML = `Last recorded at coordinates ${vessel.geometry.coordinates} on ${vessel.properties.timestamp}`;
    if (vessel.properties.speed >= 0.1) {
      details.innerHTML += ` | Travelling at ${vessel.properties.speed} knots, heading ${vessel.properties.heading} deg north`
    } else {
      details.innerHTML += ' | This vessel was stationary'
    }

    // Handle click on link
    link.addEventListener('click', function() {
      for (const vessel of vesselsObj.features) {
        if (this.id === `link-${vessel.properties.mmsi}`) {
          flyToVessel(vessel)
          displayPopUp(vessel)
        }
      }
      const activeItem = document.getElementsByClassName('active')
      if (activeItem[0]) {
        activeItem[0].classList.remove('active')
      }
      this.parentNode.classList.add('active')
    })
  }
}

// * INTERACTIVE FUNCTIONS
// Centre on clicked feature
const flyToVessel = (currentFeature) => {
  map.flyTo({
    center: currentFeature.geometry.coordinates,
    zoom: 7
  })
}

// Recentre screen on Title click
const vesselsTitle = document.getElementById('map-centre')
vesselsTitle.addEventListener('click', () => {
  map.flyTo({
    center: [-3.0370, 53.8167],
    zoom: 5,
  })
})

// Display popup & remove existing popup
const displayPopUp = (currentFeature) => {
  const popUps = document.getElementsByClassName('mapboxgl-popup')
  if (popUps[0]) popUps[0].remove()

  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(`<h3>${currentFeature.properties.name}</h3> | <h4>${currentFeature.geometry.coordinates}`)
    .addTo(map)

}