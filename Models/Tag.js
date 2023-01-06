class Tag {
    naziv = "";
    lista_blogova = [];
    lista_peticija = [];

    constructor(naziv) {
        this.naziv = naziv;
    }

    makeTag(tag) {
        this.naziv = tag.properties.naziv;
    }
}
module.exports = Tag;
