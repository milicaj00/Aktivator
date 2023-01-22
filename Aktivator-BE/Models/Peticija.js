class Peticija {
    id = "";
    naslov = "";
    text = "";
    tag = [];
    lista_potpisa = [];
    broj_potpisa = 0;
    vlasnik;
    slika = "";

    constructor() {}

    makePeticija(peticija) {
        this.id = peticija.elementId;
        this.naslov = peticija.properties.naslov;
        this.text = peticija.properties.text;
        this.broj_potpisa = peticija.properties.broj_potpisa.low;
        this.slika = peticija.properties.slika;
        // this.vlasnik = peticija.user_mail;
    }
}
module.exports = Peticija;
