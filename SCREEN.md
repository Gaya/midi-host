# Installing the Screen (optional)

This is totally optional, and it most likely catered to my specific use case.

```
git clone https://github.com/goodtft/LCD-show
chmod -R 755 LCD-show
cd LCD-show
sudo ./MHS35-show
```

# Kiosk Mode

Read the article about kiosk mode here: https://reelyactive.github.io/diy/pi-kiosk/

# Start Node.js server in the background

1. Put screen.js in `/usr/local/bin/screen.js`

2. Create /etc/systemd/system/node-app.service

```
[Unit]
Description=Start Node.js server

[Service]
ExecStart=/usr/local/bin/screen.js

[Install]
WantedBy=multi-user.target
```

3. Restart systemctl daemon

```
sudo systemctl daemon-reload
sudo systemctl start node-app
sudo systemctl enable node-app
```
