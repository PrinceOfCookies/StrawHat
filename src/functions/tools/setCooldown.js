const fs = require('fs');

module.exports = async (client) => {
    client.setCooldown = async (user, commandName, time, filepath, line) => {
        const Profile = await client.checkProfile(user);
        const cooldowns = Profile.cooldowns;
        const CommandName = commandName.toLowerCase();
        // Saftey checks just incase I'm stupid
        if (typeof(time) !== 'number') throw new TypeError('Time must be a number');
        if (typeof(commandName) !== 'string') throw new TypeError('Command name must be a string');
        if (typeof(line) !== 'number') throw new TypeError('Line must be a number');
        if (typeof(filepath) !== 'string') throw new TypeError('File must be a string: Input: ' + typeof(filepath) + ' ' + filepath + ' ' + line);

        line = line.toString();

        // Check if the file is a valid js file
        if (!filepath.endsWith('.js')) throw new Error(`Invalid file passed to setCooldown, \nfile: ${file} line: ${line} commandName: ${commandName}`);

        // File should be a file path, soocheck if that path is valid
        if (!fs.existsSync(filepath)) throw new Error(`Invalid file path passed to setCooldown, \nfile: ${file} line: ${line} commandName: ${commandName}`);


        const defaults = {
            shoot: 30,
            stab: 20,
            beg: 15,
            attack: 5
        }

        if (time == 0) {
            time = defaults[CommandName];
        } else if (time < 0) {
            time = defaults[CommandName];
        } else {
            time = time + defaults[CommandName];
        }


        
        switch (commandName) {
            case 'shoot':
                Profile.updateOne({
                    cooldowns: {
                        shoot: Date.now() / 1000 + time,
                        stab: cooldowns.stab,
                        beg: cooldowns.beg,
                        attack: cooldowns.attack
                    }
                })
                break;
            case 'stab':
                Profile.updateOne({
                    cooldowns: {
                        shoot: cooldowns.shoot,
                        stab: Date.now() / 1000 + time,
                        beg: cooldowns.beg,
                        attack: cooldowns.attack
                    }
                })
                break;
            case 'beg':
                Profile.updateOne({
                    cooldowns: {
                        shoot: cooldowns.shoot,
                        stab: cooldowns.stab,
                        beg: Date.now() / 1000 + time,
                        attack: cooldowns.attack
                    }
                })
                break;
            case 'attack':
                Profile.updateOne({
                    cooldowns: {
                        shoot: cooldowns.shoot,
                        stab: cooldowns.stab,
                        beg: cooldowns.beg,
                        attack: Date.now() / 1000 + time
                    }
                })
                break;
            default:
                // Throw an error if the command name is not valid, this is to prevent people from setting cooldowns on commands that don't exist
                // Add what file the error is from, and what command name was passed (as well as the line number)
                throw new Error(`Invalid command name passed to setCooldown, \nfile: ${file} line: ${line} commandName: ${CommandName}`)
        }
    }
}