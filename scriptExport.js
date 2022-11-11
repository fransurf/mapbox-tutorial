

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

    const nicerName = `Vessel No.${vessel.properties.name.match(/\d+/)[0]}`
    link.innerHTML = `${nicerName}`

    // * Function to get date info
    const longDate = vessel.properties.timestamp
    const date = new Date(longDate)
    const useableDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`

    // * ADD ADDITIONAL DETAILS
    const details = listing.appendChild(document.createElement('div'))
    details.innerHTML = `Last recorded at coordinates (${vessel.properties.lat.toFixed(2)}, ${vessel.properties.long.toFixed(2)}) on ${useableDate}`;
    if (vessel.properties.speed >= 0.1) {
      details.innerHTML += ` | Travelling at ${vessel.properties.speed} knots, heading ${vessel.properties.heading} deg north`
    } else {
      details.innerHTML += ' | This vessel was stationary'
    }

    // Handle click on link
    link.addEventListener('click', function () {
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
  // Remove existing popups
  const popUps = document.getElementsByClassName('mapboxgl-popup')
  if (popUps[0]) popUps[0].remove()
})

// Display popup & remove existing popup
const displayPopUp = (currentFeature) => {
  const popUps = document.getElementsByClassName('mapboxgl-popup')
  if (popUps[0]) popUps[0].remove()

  const popup = new mapboxgl.Popup({ closeOnClick: false })
    .setLngLat(currentFeature.geometry.coordinates)
    .setHTML(`<h3>Vessel No.${currentFeature.properties.name.match(/\d+/)[0]}</h3><h4>Coordinates (${currentFeature.properties.lat.toFixed(2)}, ${currentFeature.properties.long.toFixed(2)})</h4>`)
    .addTo(map)

}