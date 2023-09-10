# Tasmoa Add for Busch+Jaeger free@home

Addon for free@home to fetch the data from a Tasmota Device configured as an Energy Meter (SML).

I have to Energy Meters I use this script for

* [Landis Gyr E220](https://tasmota.github.io/docs/Smart-Meter-Interface/#landis-gyr-e220-sml)
* [Easymer Q3a](https://tasmota.github.io/docs/Smart-Meter-Interface/#easymeter-q3a-apator-apox-sml), [Manual](https://www.easymeter.com/downloads/products/zaehler/Q3A1004/BA_Easymeter_Q3A_Rev_13_2019-05-20.pdf)


I'm using [Hichi-IR](https://www.ebay.de/sch/i.html?_ssn=hicbelm-8) as the hardware platform to data from the smart meter. This [process](https://smart-home-assistant.de/tasmota-auf-esp01s-hichi-ir-lesekopf-fuer-smartmeter-stromzaehler-flashen/) is used for building and flashing the device. 

# References for free@home

* [Docu Busch und Jaeger](https://busch-jaeger.github.io/free-at-home-addon-development-kit-documentation-preview/)
* [Sample App](https://github.com/Busch-Jaeger/node-free-at-home-example)
* [Free@Home Lib](https://github.com/Busch-Jaeger/node-free-at-home)
* [ABB Portal](https://developer.eu.mybuildings.abb.com/tutorials)
* [List of Possible Virtual Device](https://github.com/Busch-Jaeger/node-free-at-home/blob/master/src/freeAtHome.ts)

## Request

* API Call:  http://IP/cm?cmnd=status%208


### Regular Meter:

* http://192.168.0.10/cm?cmnd=status%208
* {"StatusSNS":{"Time":"2023-09-10T14:43:28","Regular":{"Total_in":2869.4216,"Power_curr":262}}}


## Response

```json
{}
```

# Package.json

I ensure that the same versions from the NPM Pages in this lib are also used in the top-level [Free@Home Lib](https://github.com/Busch-Jaeger/node-free-at-home/blob/master/package.json)
