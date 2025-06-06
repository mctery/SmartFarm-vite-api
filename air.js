import fetch from "node-fetch";

// ใช้ API Key ของคุณที่ได้จาก OpenWeatherMap
const apiKey = "61a7721545d33e17c99cb86a264ee6ad";

// สร้างฟังก์ชันสำหรับเรียก API
function getWeatherData(cityName) {
  // สร้าง URL ของ API ด้วยชื่อเมืองและ API Key
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  // ทำ HTTP GET request โดยใช้ fetch
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // ทำอะไรกับข้อมูลที่ได้รับ เช่น แสดงข้อมูลอากาศ
      console.log(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// เรียกใช้ฟังก์ชัน getWeatherData โดยระบุชื่อเมืองที่คุณต้องการ
getWeatherData("ปราจีนบุรี");
