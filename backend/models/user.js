const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Daniel Doe' }
]

export class UserModel {
    static async getAll() {
        return users
    }

    static async getById({id}) {
        return users.find(user => user.id == id)
    }
} 