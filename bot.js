const { Client } = require('whatsapp-web.js');
const client = new Client();
const { exec } = require("child_process");
const code = require("qrcode-terminal")
const config = require("./setbot.json")
const fs = require("fs")

const isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

client.on('qr', (qr) => {
    code.generate(qr, {small: true});
})
    
client.on('ready', () => {
    console.log("Bot is Running")
})

client.on('message', msg => {
    if (msg.body == "!help")
    {
        msg.reply("Commands are\n!status (Look the status server is up or down)\n!online (See how many players are online)\n!count(Counting the players and worlds folder)")
    }
    if(msg.body == "!status") {
        isRunning('enet.exe', (status) => {
            if(status == true) {
                msg.reply("Status Currently : UP")
            }
            else {
                msg.reply("Server Currently : DOWN")
            }
        });
    } 
    if (msg.body == "!online")
    {
        fs.readFile(`onlineplayer.txt`, 'utf8', (err,data) => {
            if (err)
            {
                msg.reply("This server doensn't support !online")
            }
            msg.reply("Player Online = "+ data)
        })
    }
    if (msg.body == "!count")
    {
        fs.readdir(`./${config.worlds}`, (err,world) => {

            
            fs.readdir(`./${config.players}`, (err,player) => {

            
            let w = world.length;
            let p = player.length;
            msg.reply("World Count: "+ w +"\nPlayer Count: " + p)
            });
        });
    }
});
client.initialize();