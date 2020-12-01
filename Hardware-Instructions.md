# Hardware Instructions — FlipDot Communicator

## Components used

- 2 ✕ Flip Dot Displays 5✕7 from [hannIO](https://hannio.org/)
- ESP32 Dev Kit
- 2 ✕ phone jacks
- Strip board 
- Button
- AUX cable
- AC/DC adapter 12V 5A*

*I use 5A. 1.5A seemed to work, but did a lot of mistakes. I could not find a documentation specifying which is the minimum current needed.

## Assembly

### Case

Find the `.obj` file to print out the case on a 3D printer.

### FlipDot Matrix

[Instructions](https://github.com/ArduinoHannover/FlipDot_5x7)

I managed to get them a little bit closer to each other by going without the accepting header pins and directly soldering the two PCBs together. This way I could save a couple of millimeters. 

**! Watch out:** The connection to daisychain them is confusingly communicated on the schematics from hannIO, it needs to be the other way around when looking from the back. 

[Video](https://www.youtube.com/watch?v=s-VXi5K4Zl0) (german)

### Pin Layout

|ESP32|FlipDot|Button|Color (in my case)|
|-----|-------|------|-------------------|
|VIN  |5V     |-     |Orange             |
|D5   |LAT    |-     |Green              |
|GND  |GND    |Pin   |Gray               |
|D19  |SCL    |-     |Yellow            |
|D18  |SDA    |-     |Blue               |
|-    |GND    |-     |White             |
|-    |12V    |-     |Red                |
|-    |12V    |-     |-                  |
|D15  |-      |Pin   |Purple             |

## Software

### Libraries to install

* ESP32
* FlipDot
* Firebase ESP32 

#### Adjustments

I needed to change the pin layout in the [FlipDot_5x7.h](https://github.com/ArduinoHannover/FlipDot_5x7/blob/5966683c8d426884d215b8a05659c2891b238b62/FlipDot_5x7.h#L63-L76) to this one, as it seems to need four analog pins (lines 63-76):

```cpp
#ifndef ESP8266
class FlipDot_5x7_Slave : public FlipDot_5x7 {
	private:
		const uint8_t
			addr1	= 32,
			addr2	= 33,
			addr3	= 34,
			addr4	= 35;
	public:
		FlipDot_5x7_Slave(boolean invert) : FlipDot_5x7(1,1,invert) {}
		void begin(void);
		void receiveEvent(int);
};
#endif /* ESP8266 */
```

### Flash the ESP32

Then open the [`.ino`](hardware/FlipDotCommunicator/FlipDotCommunicator.ino) file. Add your credentials to the `credentials.h` file. The placeholders are these ones:

```cpp
#define FIREBASE_HOST "YOUR_FIREBASE_PROJECT.firebaseio.com"
#define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET"
#define WIFI_SSID "YOUR_WIFI_AP"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
```

If you are not sure where to find them, this [stackoverflow question](https://stackoverflow.com/questions/37418372/firebase-where-is-my-account-secret-in-the-new-console) will help you.

Finally flash it onto the board.