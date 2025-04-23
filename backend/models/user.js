import { dbpg } from "../db/db.js";

export class UserModel {
    static async getAll() {
        const users = dbpg.query('SELECT * FROM usuarios', (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {
                console.log(res.rows)
            }
        });
        
        return users;
    }

    static async getById({id}) {
        return users.find(user => user.id == id)
    }
} 