### ArsMusic-Bot
Hello guys, Introducing: ArsMusic-Bot.
`"But Artz what's this??"`, The answer is actually simple, A free to use javascript music bot
Yes yes.. you heard that right, Completely free! so lets move to the set up

### Setting up
This is the "harder part" but let's check if we got all the requirements for that bot
**Node.js 8+** ==> [Node](https://nodejs.org/en/)
So we checked our requirements and everything is set up.
Lets start by opening the folder called `config` and inside open `config.json.example`
Take of the example out of the name so it will be `config.json` then go ahead and fill the config files
with ==> **Your bot's Discord token** , **Your own youtube api key** can easily get ==> [Here](https://console.developers.google.com/)
So what we did now is setting up all the Tokens and you can change to prefix if you want but it is optional
**DEFAULT_PREFIX** ==> **`.`** Now we want to open a command prompt inside the musicBot folder and type
`npm install` that will basically install all the dependencies for that project.
After that's done type in the console `node app.js` **Please no nodemon**
and booooooom we are done! simply type `.play <song name / link>` or insted of `.` with your prefix to start download songs
The bot comes up with a custom logger that I wrote can be find inside `classes/logger.js`

__ENOJY THE BOT IS THE KEY! :D__
# ChangeLog
__**7/25/2017**__ - manage to get the songs playing and placed inside the queue **Per Server**.
---
__**7/26/2017**__ - Full playlist support with working skip command.
