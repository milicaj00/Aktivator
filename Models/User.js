class User {
    email = "";
    name = "";
    surname = "";
    password = "";

    constructor() {}

    makeUser(user) {
        this.email = user.properties.email;
        this.name = user.properties.name;
        this.surname = user.properties.surname;
        this.password = user.properties.password;
    }

    toShort() {
        return {
            email: this.email,
            name: this.name,
            surname: this.surname
        };
    }
}
module.exports = User;
