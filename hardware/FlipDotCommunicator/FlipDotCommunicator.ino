#include "credentials.h"
#include "icons.h"

#include <FlipDot_5x7.h>
#include <WiFi.h>
#include <FirebaseESP32.h>

#define CLOCK 19
#define DATA  18
#define LATCH 5

#define BTN   15

int buttonState = 0;

FlipDot_5x7 flipdot(2, 1, false);

int COLUMNS = 10;
int ROWS = 7;

FirebaseData firebaseData;
FirebaseJsonData jsonData;
FirebaseJson json;
FirebaseJsonArray arr;
void printResult(FirebaseData &data);

unsigned long sendDataPrevMillis = 0;
uint16_t count = 0;

int checkTime = 15000; // in ms

String path = "/flipMessages";

String currentType = "";
String currentContent = "";
String currentKey = "";

int totalMessageCount = 0;

// give space for 70 pixels in matrix
int matrix[70];

bool isDisplayingMessage = false;

void setup() {

  Serial.begin(115200);

  // init Button
  pinMode(BTN, INPUT);
  
  // init WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  // init Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  
  Firebase.setReadTimeout(firebaseData, 1000 * 60);
  Firebase.setwriteSizeLimit(firebaseData, "small");

  Firebase.setFloatDigits(2);
  Firebase.setDoubleDigits(6);


  if (!Firebase.beginStream(firebaseData, path))
  {
      Serial.println("------------------------------------");
      Serial.println("Can't begin stream connection...");
      Serial.println("REASON: " + firebaseData.errorReason());
      Serial.println("------------------------------------");
      Serial.println();
  }
  

  // init flipdot and flip all of them briefly
  flipdot.begin(DATA, CLOCK, LATCH);
  flipdot.fillScreen(FLIPDOT_YELLOW);
  flipdot.display();
  delay(1000);
  flipdot.fillScreen(FLIPDOT_BLACK);
  flipdot.display();
  delay(1000);
}

void loop() {

  buttonState = digitalRead(BTN);

  if (millis() - sendDataPrevMillis > checkTime){
    sendDataPrevMillis = millis();
    count++;

    Serial.println("------------------------------------");
    Serial.println("Get Data...");
    if (Firebase.get(firebaseData,  path))
    {   
      
      Serial.println("------------------------------------");
      Serial.println();

      if( firebaseData.dataType() == "json" ){

        FirebaseJson &json = firebaseData.jsonObject();
        size_t len = json.iteratorBegin();
        String key, value = "";
        int type = 0;
        bool isNewMessage = false;
        totalMessageCount = 0;
        
        for (size_t i = 0; i < len; i++)
        {
          json.iteratorGet(i, type, key, value);

          // save latest key to variable to remember what to play
          if( i == 0 ){
            currentKey = key;
          }

          // if is not the first element and a main key, do this
          if( i > 0 && isNewMessage == false ){

            // check what type the message is
            if(key.indexOf("type") >= 0 ){
              // Serial.println(value);
              currentType = value;
            }

            // check what content the message has
            if(key.indexOf("content") >= 0 ){
              // Serial.println(value);
              currentContent = value;
            }

            // check if new message starts
            if(value.indexOf("{") >= 0){
              // Serial.println("Contains a {}");
              isNewMessage = true;
            }
          }

          // count messages
          if(value.indexOf("{") >= 0){
            totalMessageCount++;
          }
        }
        json.iteratorEnd();


        Serial.println("Next Message —————————————— ");
        Serial.println(currentKey);
        Serial.println(currentType);
        Serial.println(currentContent);
        Serial.println();

        Serial.print("Total Messages: ");
        Serial.println(totalMessageCount);        
      }
    } else {
      Serial.println("FAILED");
      Serial.println("REASON: " + firebaseData.errorReason());
      Serial.println("------------------------------------");
      Serial.println();
    }

  }

  displayQueue();

}

void displayQueue() {

  for ( int y = 0; y < ROWS; y++ ){
    for( int x = 0; x < COLUMNS; x++ ){
      int i = x + y*COLUMNS;
      int k = y + x*ROWS;
      bool colorPixel = ( k < totalMessageCount ) ? true : false;
      flipdot.drawPixel(x, y, ( colorPixel ? FLIPDOT_YELLOW : FLIPDOT_BLACK ) );
    }
  }
  flipdot.display();

}

void displayMatrix() {
  for ( int y = 0; y < ROWS; y++ ){
    for( int x = 0; x < COLUMNS; x++ ){
      int i = x + y*COLUMNS;
      // int k = y + x*ROWS;

      bool colorPixel = matrix[i] ? true : false;

      flipdot.drawPixel(x, y, ( colorPixel ? FLIPDOT_YELLOW : FLIPDOT_BLACK ) );
    }
  }
  flipdot.display();
}

void resetMatrix() {
  for( int i = 0; i < ROWS*COLUMNS; i++ ){
    matrix[i] = 0;
  }
  flipdot.fillScreen(FLIPDOT_BLACK);
  flipdot.display();
}
