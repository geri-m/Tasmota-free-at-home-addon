import { FreeAtHome } from '@busch-jaeger/free-at-home';
import fetch from 'cross-fetch';

const freeAtHome = new FreeAtHome();
freeAtHome.activateSignalHandling();

var url: string = "http://192.168.0.10/cm?cmnd=status%208";

// Regular Meter
// {"StatusSNS":{"Time":"2023-09-10T14:43:28","Regular":{"Total_in":2869.4216,"Power_curr":262}}}
// Definition of the Weather Object we get from the API
interface TasmotaResponseRegularResponse { StatusSNS: TasmotaResponseRegularEntry }
interface TasmotaResponseRegularEntry { Time: Date, Regular: TasmotaResponseRegularConsumption }
interface TasmotaResponseRegularConsumption { Total_in: number, Power_curr: number }

// Heat Pump
// {"StatusSNS":{"Time":"2023-09-10T14:46:06","Heating":{"Verbrauch_T1":935.0000000,"Verbrauch_T2":1846.0000000}}}
interface TasmotaResponseHeatPumpResponse { StatusSNS: TasmotaResponseRegularEntry }
interface TasmotaResponseHeatPumpEntry { Time: Date, Heating: TasmotaResponseRegularConsumption }
interface TasmotaResponseHeatPumpConsumption { Verbrauch_T1: number, Verbrauch_T2: number }

// Basic Guard Function
const isTasmotaResponseRegular = (data: any): data is TasmotaResponseRegularResponse => {
  return data.StatusSNS.Time == 'date' && data.StatusSNS.Regular.Total_in == 'number' && data.StatusSNS.Regular.Power_curr == 'number'
}

const isTasmotaResponseHeatPump = (data: any): data is TasmotaResponseHeatPumpResponse => {
  return data.StatusSNS.Time == 'date' && data.StatusSNS.Heating.Verbrauch_T1 == 'number' && data.StatusSNS.Heating.Verbrauch_T2 == 'number'
}

async function main() {

  console.log("Main triggered");

  const energyMeter = await freeAtHome.createEnergyMeterDevice("TasmotaEnergyMeter", "Tasmota Regular Meter")
  energyMeter.setAutoKeepAlive(true);
  energyMeter.setAutoConfirm(true);
  energyMeter.isAutoConfirm = true;


  // we have 500 queries per day, so running ever 3 minutes
  var minutes = 3, the_interval = minutes * 1000;
  setInterval(async function () {

    if (url == '') {
      console.warn('URL is not set. Please enter your URL in the settings');
      return;
    }

    console.log("Update Data.")
    await fetchRegularConsumption().then(function (tasmotaData) {
      // do something with the data.
      let total = tasmotaData.StatusSNS.Regular.Total_in;
      let current = tasmotaData.StatusSNS.Regular.Power_curr;

      energyMeter.setHomePowerConsumption(current + '');
      energyMeter.setSelfConsumption(total + '');

    }).catch(function (err) {
      console.log('Error on updating values of Tasmoate readers station', err);
    });
  }, the_interval);
}

/**
 * fetchAccessToken fetches the OAuth2 token from meteomatics for getting the weather data in a 2nd step
 * The Token is value for 2 h, we we pull one for every call. 
 * @returns OAuth2 Token as a String
 */
async function fetchRegularConsumption() {
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