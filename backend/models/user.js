import { dbpg } from "../config/db.js";

export class UserModel {
    static async getAll() {
        try {
            const users = await dbpg.query('SELECT * FROM usuarios')
            return users.rows;            
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
        }
        
    }

    static async getById({id}) {
        try {
            const user = await dbpg.query('SELECT * FROM usuarios WHERE id = $1', [id])
            return user.rows[0];
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    }

    static async create({nombre, email, password}) {
        try {
            const user = await dbpg.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', [nombre, email, password])
            return user.rows;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
        }
    }
    
    static async update({id}, {nombre, email, password}) {
        try {
            const fields = [];
            const values = [];
            let idx = 1;
        
            if (nombre !== undefined) {
              fields.push(`nombre = $${idx++}`);
              values.push(nombre);
            }
            if (email !== undefined) {
              fields.push(`email = $${idx++}`);
              values.push(email);
            }
            if (password !== undefined) {
              fields.push(`password = $${idx++}`);
              values.push(password);
            }
        
            if (fields.length === 0) {
              throw new Error('No se enviaron campos para actualizar');
            }
        
            const query = `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
            values.push(id);
        
            const user = await dbpg.query(query, values);
            return user.rows[0];
          } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw error;
          }
    }

    static async delete({id}) {
        try {
            const user = await dbpg.query('DELETE FROM usuarios WHERE id = $1', [id])
            return user.rows;
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    }
} 