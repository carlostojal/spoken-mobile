
export default (time) => {
  const difference = ((Date.now() - new Date(time)) / 1000).toFixed(0);
  let result = {
    value: null,
    unit: null
  };
  if(difference > (60*60*24)) { // days
    result.value = (difference / (60*60*24)).toFixed(0);
    result.unit = "d";
  } else if(difference > (60*60)) { // hours
    result.value = (difference / (60*60)).toFixed(0);
    result.unit = "h"
  } else if(difference > 60) { // in minutes
    result.value = (difference / 60).toFixed(0);
    result.unit = "m";
  } else { // in seconds
    result.value = difference;
    result.unit = "s";
  }
  return result;
}