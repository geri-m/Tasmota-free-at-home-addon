import { FreeAtHome } from '@busch-jaeger/free-at-home';
import fetch from 'cross-fetch';

const freeAtHome = new FreeAtHome();
freeAtHome.activateSignalHandling();

var url: string = "";

// Definition of the Bearer Token we get for OAuth
interface TasmotaResponseRegular { data1: string, data2: string }
interface TasmotaResponseHeatPump { data1: string, data2: string }


// Basic Guard Function
const isTasmotaResponseRegular = (data: any): data is TasmotaResponseRegular => {
  return typeof data.data1 == 'string' && typeof data.data2 == 'string'
}

const isTasmotaResponseHeatPump = (data: any): data is TasmotaResponseHeatPump => {
  return typeof data.data1 == 'string' && typeof data.data2 == 'string'
}

async function main() {

  const energyMeter = await freeAtHome.createEnergyMeterDevice("TasmotaEnergyMeter", "meteomatics Wetter")
  energyMeter.setAutoKeepAlive(true);
  energyMeter.setAutoConfirm(true);
  energyMeter.isAutoConfirm = true;


  // we have 500 queries per day, so running ever 3 minutes
  var minutes = 3, the_interval = minutes * 60 * 1000;
  setInterval(async function () {

    if (url == '') {
      console.warn('URL is not set. Please enter your URL in the settings');
      return;
    }

    console.log("Update Data.")
    await fetchAccessToken().then(function (tasmotaData) {
      // do something with the data.
    }).catch(function (err) {
      console.log('Error on updating values of weather station', err);
    });
  }, the_interval);
}

/**
 * fetchAccessToken fetches the OAuth2 token from meteomatics for getting the weather data in a 2nd step
 * The Token is value for 2 h, we we pull one for every call. 
 * @returns OAuth2 Token as a String
 */
async function fetchAccessToken() {
  const resp = await fetch(url, {
    method: 'GET'
  });
  const jsonResponse = await resp.json();
  // Use Type Guard.
  if (isTasmotaResponseRegular(jsonResponse)) {
    return jsonResponse;
  } else if (isTasmotaResponseHeatPump(jsonResponse)) {
    return jsonResponse;
  } else {
    throw Error('Parsed string is not an Tasmota Reponse.');
  }
}

main();

// Get notified about changes in the configuration of the add on
//#################################################################################

import { AddOn } from '@busch-jaeger/free-at-home';

const metaData = AddOn.readMetaData();

const addOn = new AddOn.AddOn(metaData.id);

addOn.on("configurationChanged", (configuration: AddOn.Configuration) => {
  // TODO: Remove, as this would also log out the password.
  console.log(configuration);
  url = configuration.default?.items?.["URL"] ?? "";
})
addOn.connectToConfiguration();