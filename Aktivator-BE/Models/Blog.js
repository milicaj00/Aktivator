class Blog {
    naslov = "";
    text = "";
    tag = [];
    vlasnik;

    constructor() {}

    makeBlog(blog) {
        this.id = blog.elementId;
        this.naslov = blog.properties.naslov;
        this.text = blog.properties.text;
        this.vlasnik = blog.user_mail;
    }
}
module.exports = Blog;
