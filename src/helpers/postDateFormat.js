
export default (time) => {
  const difference = ((Date.now() - new Date(time)) / 1000);
  let result = {
    value: null,
    unit: null
  };
  if(difference >= (60*60*24*366)) { // years
    result.value = (difference / (60*60*24*366));
    result.unit = "y";
  } else if(difference >= (60*60*24*31)) { // months
    result.value = (difference / (60*60*24*31));
    result.unit = "mo";
  } else if(difference >= (60*60*24*7)) { // weeks
    result.value = (difference / (60*60*24*7));
    result.unit = "w";
  } else if(difference >= (60*60*24)) { // days
    result.value = (difference / (60*60*24));
    result.unit = "d";
  } else if(difference >= (60*60)) { // hours
    result.value = (difference / (60*60));
    result.unit = "h";
  } else if(difference >= 60) { // in minutes
    result.value = (difference / 60);
    result.unit = "m";
  } else { // in seconds
    result.value = difference;
    result.unit = "s";
  }
  result.value = result.value.toFixed(0);
  return result;
}