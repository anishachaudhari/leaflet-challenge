 

const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//let map = L.map('geoMap').setView([0, 0], 2);

d3.json(queryUrl).then(function (data) {
    createFeatures(data.features);
    console.log(data.features);
});


function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p`)
    }

    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function ( feature, latlng ) {
            let radius = feature.properties.mag * 5;
            if (feature.geometry.coordinates[2] > 90) {
                fillcolor = '#993404';
            }
            else if (feature.geometry.coordinates[2] >= 70) {
                fillcolor = '#d95f0e';
            }
            else if (feature.geometry.coordinates[2] >= 50) {
                fillcolor = '#fe9929';
            }
            else if (feature.geometry.coordinates[2] >= 30) {
                fillcolor = '#fec44f';
            }
            else if (feature.geometry.coordinates[2] >= 10) {
                fillcolor = '#fee391';
            }
            else fillcolor = '#ffffd4';
  
            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 1,
                weight: 1
            });
        }
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

      let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
      };

      let overlayMaps = {
        Earthquakes: earthquakes
      };

      let myMap = L.map("geoMap", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [street, earthquakes]
      });

      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

    let legend = L.control({
        position: 'bottomright'
    });

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
            "#ffffd4",
            "#fee391",
            "#fec44f",
            "#fe9929",
            "#d95f0e",
            "#993404"
         ];

         for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "</br>" : "+");
            console.log(div.innerHTML)
         }
         return div;
    };
    legend.addTo(myMap);

};