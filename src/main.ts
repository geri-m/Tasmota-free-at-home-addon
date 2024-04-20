import { FreeAtHome } from '@busch-jaeger/free-at-home';


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
  return  true // data.StatusSNS.Time == 'date' && data.StatusSNS.Regular.Total_in == 'number' && data.StatusSNS.Regular.Power_curr == 'long'
}



const isTasmotaResponseHeatPump = (data: any): data is TasmotaResponseHeatPumpResponse => {
  return data.StatusSNS.Time == 'date' && data.StatusSNS.Heating.Verbrauch_T1 == 'long' && data.StatusSNS.Heating.Verbrauch_T2 == 'long'
}

main();

async function main() {

  console.log("Main triggered");

  // triggering every 5 seconds
  var minutes = 5, the_interval = minutes * 1000 // * 60 ;

  /*
  if (url == '') {
    console.warn('URL is not set. Please enter your URL in the settings');
    return;
  }
  */

  // open connection to a tcp line
/*
  try {
    client.connectTCP("192.168.70.37", { port: 502 });
    client.setID(1);
  } catch (error) {
    console.error(error);
  }
*/


  /*
  // Wasser Zähler
  const waterMeter = await freeAtHome.createWaterMeterDevice("DemoWaterMeter", "Demo Water Meter")
  await new Promise(f => setTimeout(f, 1000));
  waterMeter.setAutoKeepAlive(true);
  waterMeter.setAutoConfirm(true);
  waterMeter.isAutoConfirm = true;

  console.log("waterMeter Created");
  setInterval(async function () {
  await fetchRegularConsumption().then(function (tasmotaData) {  
    waterMeter.setWaterConsumed("1111");
    waterMeter.setWaterConsumed("2222");
    console.log("Update Data.")

  }).catch(function (err) {
    console.log('Error on updating values of Tasmota reader', err);
  });

  }, the_interval);
  */

/*
  
  // this on is creating a time out. 
  const energyMeter = await freeAtHome.createEnergyMeterDevice("TasmotaEnergyMeter", "Tasmota Regular Meter");
  console.log("EnergyMeterDevice Created");
  energyMeter.setMaxListeners(10)
  await new Promise(f => setTimeout(f, 1000));
  energyMeter.setAutoKeepAlive(true);
  energyMeter.setAutoConfirm(true);
  energyMeter.isAutoConfirm = true;
  energyMeter.setHomePowerConsumption("10")
  energyMeter.setAutoConfirm(true);
  energyMeter.setAutoKeepAlive(true)

      // Use random static data.
      energyMeter.setSelfConsumption("20")
      energyMeter.setPowerToGrid("20")
      energyMeter.setHomePowerConsumption("20")
*/

/*
  await fetchRegularConsumption().then(function (tasmotaData) {
    // do something with the data.
    let total = tasmotaData.StatusSNS.Regular.Total_in;
    let current = tasmotaData.StatusSNS.Regular.Power_curr;

    // Use random static data.
    energyMeter.setSelfConsumption("20")
    energyMeter.setPowerToGrid("20")
    energyMeter.setHomePowerConsumption("20")

    console.log("Update Data.")

  }).catch(function (err) {
    console.log('Error on updating values of Tasmota reader', err);
  });

  }, the_interval);

  */


  //this is not show in the UI. 
  const energyMeter = await freeAtHome.createEnergyOneWayMeterV2Device("TasmotaEnergyMeter", "Tasmota Regular Meter")
  energyMeter.setAutoKeepAlive(true);
  energyMeter.setAutoConfirm(true);
  energyMeter.isAutoConfirm = true;
  energyMeter.setCurrentPowerConsumed("10");
  energyMeter.setAutoKeepAlive(true);
  energyMeter.setAutoConfirm(true);

  console.log("Device Created");



  setInterval(async function () {

    // Use random static data.
    energyMeter.setCurrentPowerConsumed("1111");
    energyMeter.setTotalEnergyExported("2222");
    energyMeter.setExportedEnergyCostsToday("33333");
    energyMeter.setExportedEnergyCostsTotal("4444");
    
    console.log("Update Data.")

  }, the_interval);
  


  /*

  const energyMeter = await freeAtHome.createEnergyOneWayMeterV2Device("TasmotaEnergyMeter", "Tasmota Regular Meter")
  energyMeter.setAutoKeepAlive(true);
  energyMeter.setAutoConfirm(true);
  energyMeter.isAutoConfirm = true;

  energyMeter.setCurrentPowerConsumed("1111");
  energyMeter.setTotalEnergyExported("2222");
  energyMeter.setExportedEnergyCostsToday("33333");
  energyMeter.setExportedEnergyCostsTotal("3333");
  */

} // main


