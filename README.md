# midi-host

This project turns any linux device into a midi-host. As long as the device can run Node.js and `aconnect` you're set.

What makes this project different is that it uses a settings file to configure in what mode a device needs to connect. It also connects devices to all available MIDI ports instead of just port 0.

You can set a device to be MIDI out only, MIDI in only, or both. You can also turn off a device altogether, so it will not connect to your other devices.

Based on the instructions on [https://neuma.studio/rpi-midi-complete.html](https://neuma.studio/rpi-midi-complete.html)

## But why?

After happily using the midi host as described in the article above I ran into a strange problem. I wanted to connect my Korg microKEY2 to my Korg Minilogue XD but it stopped working. It looked like the microKEY2 crashed, it wasn't responding to any input.

I found out that by not accepting MIDI in it wouldn't crash. And since it's a simple MIDI controller I thought to put in a failsafe and not have it connect.

What also is not ideal is that only connects to port 0 of a MIDI device, so I added functionality to connect to all ports.

## How to Install (Raspberry Pi example)

1. Install dependencies: 

```sudo apt-get install nodejs git```

2. Create new file in bin folder:

```sudo vim /usr/local/bin/connect.js```

3. Copy the contents of [`./bin/connect.js`](https://raw.githubusercontent.com/Gaya/midi-host/main/bin/connect.js) to the file.

4. (Optional) You can change the location of the settings file by changing `/home/pi/midi.settings.json` to your desired path. The default for Raspberry Pi is `/home/pi/midi.settings.json`.

5. Change permissions to the script:

```sudo chmod +x /usr/local/bin/connect.js```

6. Automatically connect devices on add / remove USB devices. Let's create a new file:

```sudo vim /etc/udev/rules.d/33-midiusb.rules```

7. Add the following:

```ACTION=="add|remove", SUBSYSTEM=="usb", DRIVER=="usb", RUN+="/usr/local/bin/connect.js"```

8. Restart udev:

```
sudo udevadm control --reload
sudo service udev restart
```

9. Configure MIDI connection on startup. Let's create a new system service file:

```sudo vim /lib/systemd/system/midi.service```

10. Add the following:

```

[Unit]
Description=Initial USB MIDI connect

[Service]
ExecStart=/usr/local/bin/connect.js

[Install]
WantedBy=multi-user.target
```

11. Restart service:

```
sudo systemctl daemon-reload
sudo systemctl enable midi.service
sudo systemctl start midi.service
```

12. Check if it's working (that is if you have any MIDI devices connected):

```aconnect -l```

## Adding config

At step 4 of the installation process we defined a settings file location. Create a new file in that location:

```vim /home/pi/midi.settings.json```

Here we will put a JSON object with the following structure:

```json
{
    "device-name": 1
}
```

`"device-name"` is the name of the device you want to configure as it would show up using `aconnect -l`. The value is the mode you want the device to operate in.

Options are as follows:

```
0 = device is disabled, will not connect to other devices
1 = device accepts MIDI in, and sends MIDI out (default)
2 = device accepts MIDI in, will not send MIDI out
3 = device does not accept MIDI in, will only send MIDI out
```