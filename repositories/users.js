const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
const Repository = require('./repository');

class UsersRepository extends Repository {
    async create(attrs) {
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buff = await scrypt(attrs.password, salt, 64);
        const records = await this.getAll();
        const record = {
            ...attrs,
            password: `${buff.toString('hex')}.${salt}`
        }
        records.push(record);
        await this.writeAll(records);
        return record;
    }

    async comparePasswords(saved, supplied) {
        //Saved -> password saved in our database. 'hashed.salt'
        //Supplied -> password given to us by a user trying to sign in
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuff = await scrypt(supplied, salt, 64);
        return hashed === hashedSuppliedBuff.toString('hex');
    }
}

module.exports = new UsersRepository('users.json');

