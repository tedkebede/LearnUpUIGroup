# README
### NodeVersion: 8.9.4
### Description: The LearnUp Team at Code For Good manages a web application attempting to digitize an established reading curriculum. The primary technologies used are Express and Socket.io
<!-- Can you see comments? -->
<!-- Answer is You Cannot -->
<!-- # 1 Large-->
<!-- ## 2 Medium -->
<!-- ### 3 Small-->

-----------------------
## Sprint Timelime: 5/28/2018 - 6/8/2018
### Meeting, 6/8/2018

- Sounds: Ingrid
- Snapping: Daniel
- Layout: Emily, Maria
- Terminating Room: Lisa
- Version Control: Jonathan

### Accomplishments
- Team was able to redesign the board to better match the magnetic board design
- Added the feature for attaching sound files to tiles
- Added feature to redirect student when teacher closes the session

### Challenges
- Application starts to delay overtime
- Need MP3 files for individual sounds

-----------------------
<!-- Below are previous group notes that don't fit with the standardized meeting notes established 6/8. -->

<!-- # LearnUpProject 4/18/18 updated -->
<!-- ## Changes for forget pw -->
<!--  -->
<!-- ### package.json: -->
<!-- - jsonwebtoken            -->
<!--   // Please remember to nom install this!  -->
<!--  -->
<!-- ### views -->
<!-- - Add forgetpw.ejs -->
<!-- - Add Purest.ejs -->
<!-- - In admin.ejs, add Line 37 - 39, forget password related -->
<!--  -->
<!-- ### static/ stylesheets / style.css -->
<!-- - Add Line 62 - 64, style of class forgetpw -->
<!--  -->
<!-- ### models -->
<!-- - Add Line 22, resettoken -->
<!-- // Not sure if it really adds in or not -->
<!--  -->
<!-- ### controllers -->
<!-- - Add Line 21, 22, define jwt and secret  -->
<!-- - Add Line 239 - 326, function forgetpassword, getUserinforgetpw, resetpassword -->
<!--  -->
<!-- ### routes -->
<!-- - Add Line 20 - 22, app.get'/forgetpw’ -->
<!-- - Add Line 75 - 77, app.post'/forgetpassword' -->
<!-- - Add Line 79 - 81, app.get ‘/reset/:token' -->
<!-- - Add Line 83-85, app.post'/resetpw' -->
<!--  -->
<!-- ## 4/13/18 -->
<!-- ## 1. Logged in light for student on reading board / Logged in light for the admin on reading board -->
<!-- ### Server: -->
<!--   * In socket join room, based on the length within the room to distinguish the light to on or off -->
<!--   * also add socket.leave room -->
<!--   * also add if users > 2 then redirect to index -->
<!--    -->
<!-- ### Client - board.ejs: -->
<!--   Add var admin, in socket user_joined, addClass if users is equal to 2    -->
<!-- ### CSS: -->
<!--   css for the light -->
<!--    -->
<!-- ## 2. Prevent tiles from being dragged off into space -->
<!-- ### Client - board.ejs: -->
<!--   Add restrict in interact('.draggable') -->
<!--    -->
<!-- ## 3. Board switch -->
<!-- ### Client - board.ejs:  -->
<!--   * Add div to include all back and front side -->
<!--   * create function switchboard() -->
<!--   * then emit the button switch click -->
<!--   * socket on for switch_boards -->
<!-- ### Server: -->
<!--   socket on for switch -->
<!--    -->
<!-- ## 4. Board reset feature for instructor that resets student view as well -->
<!-- ### Client - board.ejs: -->
<!--   fix the reset function -->
<!--  -->
<!-- ## 5. Fixing Admin login w/o pw problems -->
<!-- ### Server: -->
<!--   fix function in login in users.js -->
<!--  -->
<!-- ## [Pending] -->
<!-- ### 1. Logged in light for student on reading board / Logged in light for the admin on reading board -->
<!-- * Not working if teacher left the room first due to its based on users within the room length, not getting user id -->
