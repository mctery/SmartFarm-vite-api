// Import the socket.io-client library
const io = require("socket.io-client");

// Specify the URL of your Socket.IO server
const socket = io("http://192.168.43.209:3200"); // Change the URL to match your Socket.IO server's URL

// When receiving data from the server

//=====================================================================================================
//=====================================================================================================

socket.on("temperatureData", (data) => {
  // console.log('Received temperature data:', data);
  // Handle the received data here
  let device_id = data.device_id;
  let rssi = data.rssi;
  let temperatures = data.temperatures;
  console.log("Device ID:", device_id);
  console.log("rssi:", rssi);
  console.log("รายการอุณหภูมิ:");
  temperatures.forEach((temperature) => {
    let id = temperature.id;
    let value = temperature.value;
    console.log(`ID: ${id}, ค่า: ${value}`);
  });
});

//=====================================================================================================
//=====================================================================================================

socket.on("humidityData", (data) => {
  // console.log('Received humidity data:', data);
  // Handle the received data here
  let device_id = data.device_id;
  let rssi = data.rssi;
  let humiditys = data.humiditys;
  console.log("Device ID:", device_id);
  console.log("rssi:", rssi);
  console.log("รายการความชื้นอากาศ:");
  humiditys.forEach((humidity) => {
    let id = humidity.id;
    let value = humidity.value;
    console.log(`ID: ${id}, ค่า: ${value}`);
  });
});

//=====================================================================================================
//=====================================================================================================

socket.on("lightData", (data) => {
  // console.log('Received light data:', data);
  // Handle the received data here
  let device_id = data.device_id;
  let rssi = data.rssi;
  let lights = data.lights;
  console.log("Device ID:", device_id);
  console.log("rssi:", rssi);
  console.log("รายการแสงแดด:");
  lights.forEach((light) => {
    let id = light.id;
    let value = light.value;
    console.log(`ID: ${id}, ค่า: ${value}`);
  });
});

//=====================================================================================================
//=====================================================================================================

socket.on("soilData", (data) => {
  // console.log('Received soil data:', data);
  // Handle the received data here
  let device_id = data.device_id;
  let rssi = data.rssi;
  let soils = data.soils;
  console.log("Device ID:", device_id);
  console.log("rssi:", rssi);
  console.log("รายการความชื้นดิน:");
  soils.forEach((soil) => {
    let id = soil.id;
    let value = soil.value;
    console.log(`ID: ${id}, ค่า: ${value}`);
  });
});

//=====================================================================================================
//=====================================================================================================
