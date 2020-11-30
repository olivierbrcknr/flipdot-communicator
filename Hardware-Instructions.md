# Hardware Instructions — FlipDot Communicator

## Components used

- 2 ✕ Flip Dot Displays 5✕7 from [hannIO](https://hannio.org/)
- ESP32 Dev Kit
- 2 ✕ phone jacks
- Strip board 
- Button
- AUX cable
- AC/DC adapter 12V 5A[^1] 

[^1]: I use 5A. 1.5A seemed to work, but did a lot of mistakes. I could not find a documentation specifying which is the minimum current needed.

## Assembly

### Case

Find the `.obj` file to print out the case on a 3D printer.

### FlipDot Matrix

[Instructions](https://github.com/ArduinoHannover/FlipDot_5x7)
[Video](https://www.youtube.com/watch?v=s-VXi5K4Zl0) (german)

### Pin Layout

|ESP32|FlipDot|
|-----|-------|
|VIN  |5V     |
|D5   |LAT    |
|GND  |GND    |
|D19  |SCL    |
|D18  |SDA    |
|-    |GND    |
|-    |12V    |
|-    |12V    |

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

Then open the [`.ino`](hardware/FlipDotCommunicator/FlipDotCommunicator.ino) file. Add your credentials to the Firebase Realtime Database at the top of the sketch. The placeholders are these ones:

```cpp
// Placeholder
```

Finally flash it onto the board.