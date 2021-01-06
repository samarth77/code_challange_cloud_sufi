var fs = require("fs");
// lambda-like handler function
module.exports.handler = async (event) => {
  // do stuff...
};
module.exports.getZips = async (event, callback) => {
  var filterData = (unfilteredData, params) => {
    var filtered_data = unfilteredData.length > 0 ? unfilteredData.slice() : [];

    var radians_to_degrees = function(radians) {
      var pi = Math.PI;
      return radians * (180 / pi);
    };
    // filter by closest location
    var distance = function(position1, position2) {
      var lat1 = position1.latitude;
      var lat2 = position2.latitude;
      var lon1 = position1.longitude;
      var lon2 = position2.longitude;
      var R = 6371000; // metres
      var φ1 = radians_to_degrees(lat1);
      var φ2 = radians_to_degrees(lat2);
      var Δφ = radians_to_degrees(lat2 - lat1);
      var Δλ = radians_to_degrees(lon2 - lon1);

      var a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      var d = R * c;
      return d;
    };

    // filter by closest location
    if (
      params.hasOwnProperty("position_x") &&
      params.position_x !== "" &&
      params.hasOwnProperty("position_y") &&
      params.position_y !== ""
    ) {
      var position = {
        coords: {
          latitude: params.position_x,
          longitude: params.position_y,
        },
      };
      var closest = filtered_data[0];
      var closest_distance = distance(closest, position.coords);
      for (var i = 1; i < filtered_data.length; i++) {
        if (distance(filtered_data[i], position.coords) < closest_distance) {
          closest_distance = distance(filtered_data[i], position.coords);
          closest = filtered_data[i];
        }
      }
      return closest;
    } else {
      // other filters
      if (params.hasOwnProperty("zip") && params.zip !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.zip.search(params.zip) !== -1;
        });
      }
      if (params.hasOwnProperty("type") && params.type !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.type.search(params.type) !== -1;
        });
      }
      if (params.hasOwnProperty("primary_city") && params.primary_city !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.primary_city.search(params.primary_city) !== -1;
        });
      }
      if (
        params.hasOwnProperty("acceptable_cities") &&
        params.acceptable_cities !== ""
      ) {
        filtered_data = filtered_data.filter((item) => {
          return item.acceptable_cities.search(params.acceptable_cities) !== -1;
        });
      }
      if (params.hasOwnProperty("state") && params.state !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.state.search(params.state) !== -1;
        });
      }
      if (params.hasOwnProperty("county") && params.county !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.county.search(params.county) !== -1;
        });
      }
      if (params.hasOwnProperty("timezone") && params.timezone !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.timezone.search(params.timezone) !== -1;
        });
      }
      if (params.hasOwnProperty("area_codes") && params.area_codes !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.area_codes.search(params.area_codes) !== -1;
        });
      }
      if (params.hasOwnProperty("country") && params.country !== "") {
        filtered_data = filtered_data.filter((item) => {
          return item.country.search(params.country) !== -1;
        });
      }
      if (
        params.hasOwnProperty("estimated_population") &&
        params.estimated_population !== ""
      ) {
        filtered_data = filtered_data.filter((item) => {
          return (
            item.estimated_population.search(params.estimated_population) !== -1
          );
        });
      }
    }

    return filtered_data;
  };

  try {
    var filteredData = [];
    var rawdata = await fs.readFileSync("src/data.json", "utf8");
    var jsonData = await JSON.parse(rawdata);

    if (
      event.hasOwnProperty("params") &&
      Object.keys(event.params).length > 0
    ) {
      filteredData = filterData(jsonData, event.params);
    } else {
      filteredData = jsonData.slice(0, 9);
    }
  } catch (e) {
    callback(e.message, []);
  }
  callback(null, filteredData);
};
