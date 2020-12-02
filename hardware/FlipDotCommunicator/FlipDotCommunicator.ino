#include "myCredentials.h"
#include "icons.h"

#include <FlipDot_5x7.h>
#include <WiFi.h>
#include <FirebaseESP32.h>

#define CLOCK 19
#define DATA  18
#define LATCH 5

#define BTN   15

int buttonIsPressed = false;

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

int checkTime = 5000; // in ms

String path = "/flipMessages/physical";

String currentType = "";
String currentContent = "";
String currentKey = "";

int prevMessageCount = 0;
int totalMessageCount = 0;

// give space for 70 pixels in matrix
int matrix[70];

bool isAnimating = false;
bool isDisplayingMessage = false;


void resetMatrix( bool shouldDisplay = true );

void setup() {

  Serial.begin(115200);

  // init Button
  pinMode(BTN, INPUT_PULLUP);
  
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

  bool buttonEventHasHappened = false;
  buttonIsPressed = digitalRead(BTN) ? false : true;

  if (millis() - sendDataPrevMillis > checkTime){
    sendDataPrevMillis = millis();
    count++;
    prevMessageCount = totalMessageCount;
    checkForMessages();
  }
  
  // only update queue if is new
  if( prevMessageCount != totalMessageCount && !isDisplayingMessage ){
    prevMessageCount = totalMessageCount;
    displayQueue();
    delay(500);
  }

  // prevent button listener when animating

  if( buttonIsPressed && !isDisplayingMessage && !isAnimating && !buttonEventHasHappened && totalMessageCount > 0 ){
    buttonEventHasHappened = true;
    Serial.print("Displaying Message: ");
    Serial.println( currentType );
    
    isAnimating = true;
    isDisplayingMessage = true;
    
    resetMatrix();
    deleteCurrentMessage();
    
    switch ( currentType.charAt(0) ){
      case 'h':
        sweepAnimation();
        isDisplayingMessage = false;
        resetMatrix();
        displayQueue();
        
        break;
      case 'i':
        // display the icon
        for( int i = 0; i < COLUMNS * ROWS; i++ ){
          matrix[i] = ICON_CUP[i];  
        }    
        displayMatrix();
        delay(500);
        
        break;
      /*
      case 'a':
        // for star animation
        break;
      */
      default:

        Serial.println("Sorry, does not exist yet");
        break;
    }
    isAnimating = false;
  }

  if( buttonIsPressed && isDisplayingMessage && !isAnimating && !buttonEventHasHappened ){
    buttonEventHasHappened = true;
    Serial.println("Displaying queue again");
    isDisplayingMessage = false;
    isAnimating = true;
    resetMatrix();
    displayQueue();
    delay(500);
    isAnimating = false;
  }

}

void checkForMessages() {
  Serial.println("------------------------------------");
  Serial.println("Get Data...");
  totalMessageCount = 0;
  if (Firebase.get(firebaseData,  path))
  {   
    
    Serial.println("------------------------------------");
    Serial.println();

    if( firebaseData.dataType() == "json" ){

      FirebaseJson &json = firebaseData.jsonObject();

      Serial.println("Pretty printed JSON data:");
      String jsonStr;
      json.toString(jsonStr, true);
      Serial.println(jsonStr);
      Serial.println(); 
      
      size_t len = json.iteratorBegin();
      String key, value = "";
      int type = 0;
      bool isNewMessage = false;
      
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

      /*
      Serial.println("Next Message —————————————— ");
      Serial.println(currentKey);
      Serial.println(currentType);
      Serial.println(currentContent);
      Serial.println();
      */

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

void deleteCurrentMessage() {
  // remove one count just in case
  totalMessageCount--;
  Firebase.deleteNode(firebaseData, path + "/" + currentKey);
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

void resetMatrix( bool shouldDisplay ) {
  for( int i = 0; i < ROWS*COLUMNS; i++ ){
    matrix[i] = 0;
  }
  if( shouldDisplay ){
    flipdot.fillScreen(FLIPDOT_BLACK);
    flipdot.display();
  }
}

void sweepAnimation() {
  int printedColumns = 0;
  for ( int x = 0; x < COLUMNS; x++ ){
    resetMatrix( false );
    for (int y = 0; y < ROWS; y++) {
      matrix[y*COLUMNS+printedColumns] = true;
    }
    displayMatrix();
    delay(100);
    printedColumns++;
  }
  delay(100);
  resetMatrix();
  delay(500);
}
