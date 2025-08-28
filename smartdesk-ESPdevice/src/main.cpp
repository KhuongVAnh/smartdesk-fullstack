#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const char *ssid = "Nhan Home";
const char *password = "nhanhome";

const char *serverUrl = "http://192.168.1.65:4000/api/v1/telemetry";
String token = "706b9e7403f5dd1b29bcc615f037056d"; // token đã nhận khi register

void setup()
{
  Serial.begin(9600);
  dht.begin();
  WiFi.begin(ssid, password);

  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println(" Connected!");
}

void loop()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    if (isnan(temp) || isnan(hum))
    {
      Serial.println("Failed to read from DHT sensor!");
      delay(2000);
      return;
    }

    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + token);

    String payload = "{\"temperature\":" + String(temp, 1) +
                     ",\"humidity\":" + String(hum, 1) +
                     ",\"light\":9999,\"noise\":0}";

    int httpCode = http.POST(payload);

    if (httpCode > 0)
    {
      Serial.printf("POST... code: %d\n", httpCode);
      if (httpCode == HTTP_CODE_OK)
      {
        String res = http.getString();
        Serial.println("Response: " + res);
      }
      Serial.printf("payload: %s", payload.c_str());
    }
    else
    {
      Serial.printf("POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  }

  delay(5000); // gửi 5 giây/lần
}
