import { dbpg } from "../db/db.js";

export class UserModel {
    static async getAll() {
        try {
            const users = await dbpg.query('SELECT * FROM usuarios')
            return users;            
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
        
    }

    static async getById({id}) {
        try {
            const user = await dbpg.query('SELECT * FROM usuarios WHERE id = $1', [id])
            return user;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }

    }
} 