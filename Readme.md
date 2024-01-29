# Forza Telemetry
![](https://github.com/qreidt/forza-telemetry/blob/main/docs/live-dashboard.png?raw=true)


## Images

### Previous Sessions List
![](https://github.com/qreidt/forza-telemetry/blob/main/docs/previous-sessions-list.png?raw=true)

### Stored Session
![](https://github.com/qreidt/forza-telemetry/blob/main/docs/session-01.png?raw=true)
![](https://github.com/qreidt/forza-telemetry/blob/main/docs/session-02.png?raw=true)
![](https://github.com/qreidt/forza-telemetry/blob/main/docs/session-03.png?raw=true)
![](https://github.com/qreidt/forza-telemetry/blob/main/docs/session-04.png?raw=true)

## How it Works
1. Enable UDP Telemetry option on Forza to your computer IP and port 12_000
2. A new session is created each time you start racing from 0
3. API starts collecting the data packets and storing them in MongoDB after each lap
4. You can access your live data in the live panel or study previous sessions in the session list

## What it uses
- MongoDB as data lake
- AdonisJS 5 with SocketIO and Sqlite on the back-end
- Vite with VueJS 3 and ChartJs on the front-end

## How to use it with docker
1. Make sure you have ports 3000 (API) and 80 (User interface; Can be edited in docker-compose.yml) open;
2. Open the command line tool inside this directory and run docker-compose up -d;
3. Docker will pull the necessary images to execute it once it's done.
4. Note: If you're using windows, prefer to have all the source code executed directly in your WSL

## What it shows
- Current Lap
- Average Tire Degradation / lap
- Average Fuel Consumption / lap
- Best Lap Time
- Current Fuel %
- Current Tire Wear % (FL, FR, RL, RR)
- Lap Details:
  - Time
  - Time Difference to Best
  - Tire Degradation on Lap
  - Fuel Consumption on Lap
  - Maximum Speed on Lap
  - Minimum Speed on Lap
  - Position changes on Lap


## To Do
1. Fix Stint Identification
2. Fix Fuel and Wear Averages on Sessions with multiple stints
3. Add button to remove a session
4. Add storage size used for each session