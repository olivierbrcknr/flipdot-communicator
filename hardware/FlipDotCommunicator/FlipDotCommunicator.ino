#include "credentials.h"
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
char refChar = '1';

bool isTimer = false;
int timerCount = 0;
int timerTotalTime = 3 * 60 * 1000;
int timerIncrementTime = timerTotalTime / (COLUMNS*ROWS);
int lastTimerIncrementTime = 0;

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
  firebaseData.setResponseSize(12288);

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

  if (millis() - sendDataPrevMillis > checkTime && !isTimer){
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

  if( buttonIsPressed && !isDisplayingMessage && !isAnimating && !buttonEventHasHappened && !isTimer && totalMessageCount > 0 ){
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
    
      case 'm':
        // star animation
        starAnimation();
        isDisplayingMessage = false;
        displayQueue();
        
        break;
      case 'a':
      
        // display the sent array  
        char pixelChars[70];
        currentContent.toCharArray(pixelChars, 70);
        for( int i = 0; i < COLUMNS * ROWS; i++ ){
          bool pixel = false;
          if( pixelChars[i] == refChar ){
            pixel = true;
          }          
          matrix[i] = pixel;
        }    
        displayMatrix();
        delay(500);
        
        break;
      default:

        Serial.println("Sorry, does not exist yet");
        break;
    }
    isAnimating = false;
  }

  // if is message
  if( buttonIsPressed && isDisplayingMessage && !isAnimating && !buttonEventHasHappened && !isTimer ){
    buttonEventHasHappened = true;
    Serial.println("Displaying queue again");
    isDisplayingMessage = false;
    isAnimating = true;
    resetMatrix();
    displayQueue();
    delay(500);
    isAnimating = false;
  }

  if( isTimer ){
    displayTimer();  
  }

  // if is timer
  if( buttonIsPressed && !buttonEventHasHappened && isTimer ){
    buttonEventHasHappened = true;
    Serial.println("Displaying prev state again");
    isTimer = false;
    timerCount = 0;
    delay(500);
    if( !isDisplayingMessage ){
      displayQueue();
    }
  }


  // display sorry no message
  if( buttonIsPressed && !buttonEventHasHappened && !isTimer && !isDisplayingMessage && !isAnimating && totalMessageCount == 0 ){
    buttonEventHasHappened = true;
    Serial.println("Sorry, no message");
    sorryNoMessage();
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
      /*
      Serial.println("Pretty printed JSON data:");
      String jsonStr;
      json.toString(jsonStr, true);
      Serial.println(jsonStr);
      Serial.println(); 
      */
      
      size_t len = json.iteratorBegin();
      String key, value = "";
      int type = 0;
      bool isNewMessage = false;

      String lastKey = "";
      
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

        if( i > 0 ){
          if(key.indexOf("type") >= 0 ){
            if( value == "timer"){
              totalMessageCount--;
              isTimer = true;
              Serial.println("Start Timer");
              // delete message of timer as it is not needed anymore
              Firebase.deleteNode(firebaseData, path + "/" + lastKey);
            }
          }
        }
        
        // count messages
        if(value.indexOf("{") >= 0){
          totalMessageCount++;
          lastKey = key;
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

void displayTimer() {
  if (millis() - lastTimerIncrementTime > timerIncrementTime){
    lastTimerIncrementTime = millis();
    timerCount++;
  

    for ( int y = 0; y < ROWS; y++ ){
      for( int x = 0; x < COLUMNS; x++ ){
        int i = x + y*COLUMNS;
        int k = y + x*ROWS;
        bool colorPixel = ( k < timerCount ) ? true : false;
        flipdot.drawPixel(x, y, ( colorPixel ? FLIPDOT_YELLOW : FLIPDOT_BLACK ) );
      }
    }
    flipdot.display();
    
    if( timerCount >= ROWS * COLUMNS ){
      isTimer = false;
      timerCount = 0;

      if( !isDisplayingMessage ){
        displayQueue();
      }
    }
  }
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

void sorryNoMessage(){
  for( int i = 0; i < COLUMNS * ROWS; i++ ){
    matrix[i] = ICON_SAD[i];  
  }    
  displayMatrix();
  delay(2000);
  resetMatrix();
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

void starAnimation(){

  int StarAnimDelay = 130;

  for( int i = 0; i < COLUMNS * ROWS; i++ ){
    matrix[i] = ANIM_STAR_1[i];  
  }    
  displayMatrix();
  delay(StarAnimDelay);
  for( int i = 0; i < COLUMNS * ROWS; i++ ){
    matrix[i] = ANIM_STAR_2[i];  
  }    
  displayMatrix();
  delay(StarAnimDelay);
  for( int i = 0; i < COLUMNS * ROWS; i++ ){
    matrix[i] = ANIM_STAR_3[i];  
  }    
  displayMatrix();
  delay(StarAnimDelay);
  for( int i = 0; i < COLUMNS * ROWS; i++ ){
    matrix[i] = ANIM_STAR_4[i];  
  }    
  displayMatrix();
  delay(StarAnimDelay);
  for( int i = 0; i < COLUMNS * ROWS; i++ ){
    matrix[i] = ANIM_STAR_5[i];  
  }    
  displayMatrix();
  delay(StarAnimDelay);
  resetMatrix();
  delay(500);
 
}
