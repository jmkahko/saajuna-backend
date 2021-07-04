# JAMK Web-kehittäjä kurssin lopputyön SääJuna backend

Projektin [frontend](https://github.com/jmkahko/saajuna-frontend) -linkki.

Työn ovat tehneet yhdessä Janne ja Leena Kähkönen. Molemmat ovat osallistuneet sekä backendin että frontendin kehittämiseen.

## Yleisesittely

[Sääjuna-backend](https://saajuna-backend.herokuapp.com/) tarjoaa sivuston kautta backend-palveluita [Sääjuna-frontend](https://saajuna-frontend.herokuapp.com/) sivustolle.
Tarjottavia backend-palveluita ovat mm. käyttäjien ja tietojen (esim. tämänhetkinen sää) tallennukseen käytetyt tietokannat ja tietojen haun rajapinnat sekä Ilmatieteen laitokselle että VR:lle.

### Sovelluksen idea ja sen toiminnallisuus lyhyesti.

SääJuna-sovelluksessa haetaan tiedot sekä VR:n että Ilmatieteen laitoksen avoimesta datasta ja tuodaan ne käyttäjälle näkyviin sovellukseen. Käyttäjä voi luoda sovellukseen oman käyttäjätunnuksen, jolla siihen voi tallentaa 2 kpl suosikkeja eli 4 yhteensä (esim. suosikkipaikkakuntia tai asemia). Käyttäjä voi poistaa käyttäjätunnuksen ja vaihtaa sen salasanan. Admin-käyttäjä voi tehdä muutoksia tietokantaan, poistaa käyttäjätunnuksia ja näkee kuinka paljon tietoja on tallennettu tietokantaan. Admin-käyttäjiä ei voi luoda nettisivun kautta.

## Kuvaus teknologioista

Lopputyö on tietokanta-pohjainen full-stack-sovellus, jossa on sekä frontend että backend. Backendin taustalla on tietokanta.
Backend on luotu Nodejs:llä ja Expressillä ja sen tietokantana on Mongodb (Atlas). Sekä frontend että backend on julkaistu Heroku:hun.
Säätiedot parseroidaan Ilmatieteen laitokselta saatavasta XML-datasta.
Junien tiedot parseroidaan Rautatieliikenteeltä saatavasta JSON-datasta.

CRUD-toiminnot sijaitsevat frontendissä (käyttäjätunnusten luonti, muokkaus ja poisto sekä suosikkien lisäys, muokkaus ja poistaminen).
Mutta ne voidaan luoda myös backendiin esimerkiksi Postman-sovelluksen avulla.

### Komennot

Komennot, joilla kehitysversion saa Githubista toimimaan omalle koneelle.

1. `git clone git@github.com:jmkahko/saajuna-backend.git`
2. Tämän jälkeen täytyy rekisteröityä [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) palveluun.
3. Luodaan projektin juureen .env tiedosto.
4. Kopioidaan .env-tiedostoon oheinen sisältö:

```
# mongoDB Atlas tunnus. Tähän syötetään MongoDB Atlas palvelusta saatava linkki
MONGOD_URL="TÄHÄNSALAINENLINKKI"

# verifonetoken JWT-token palvelimelta. Tähän syötetään salasana jota käytetään Tokenien salauksessa
SECRET = "SALAINENSALASANA"

# Cors frontendiin esim. paikallisesti käytetty osoite
FRONTEND_URL = 'http://localhost:4200'
```

5. Lisää määrityksiä riippuen onko backend paikallisella koneella vai Herokussa
   controllers/havaintoasemacontroller.js tiedostossa rivillä 75. Määritä tämä kommentiksi, jos käytetään Herokuta.

```
let tunti = aika1.getHours() - 3; // Ota tämä -3 arvo pois, kun siirretään Herokuhun, koska muuten ei toimi UTC-aika.
```

controllers/havaintoasemacontroller.js tiedostossa rivillä 261. Määritä tämä kommentiksi, jos käytetään Herokuta.

```
let tunti = aika1.getHours() - 3; // Ota tämä -3 arvo pois, kun siirretään Herokuhun, koska muuten ei toimi UTC-aika.
```

6. Tämän jälkeen käynnistä projekti `npm start` komennolla.

## Reflektio ja ajankäyttö

Työ onnistui yllättävän hyvin, vaikka aikaa saatiin kulumaan yllättävän paljon.

Vaikeinta backendin teossa on ollut aikatietojen muokkaaminen ja parserointi (UTC-aika).
Ilmatieteen laitoksen avoimesta datasta XML:n parserointiin meni myös paljon aikaa, että tiedon sai halutunlaiseksi.
Rautatieliikenteen datasta JSON-tietojen parserointi ei ollut niin vaikeaa kuin XML-sanoman parserointi.

Työn virheiden havainnissa on käytetty [Githubin Issues](https://github.com/jmkahko/saajuna-backend/issues) listausta, jotta virheet muistaa korjata myöhemmin kuntoon.

Backendiin käytetty yhteensä aikaa n. 70 h.

## Työssä hyödynnetyt tutoriaalit

- [Tour of Heroes](https://angular.io/tutorial). Tutoriaalia on käytetty siihen, kuinka tehdään tarvittavat reitit ja miten Observablesta haetaan dataa.
- Ajan, XML ja JSON:in parserointiin käytetty paljon StackOverFlow:sta löytyviä vinkkejä ja ohjeita.
- Käytetty myös Rautieliikenteen ja Ilmatieteen laitoksen omia ohjeita ja heidän Github-sivustoja esimerkiksi tiedon määrityksiä varten.
- Lisäksi on käytetty paljon JAMK:n Web-kehittäjä koulutuksen materiaaleja joista eniten hyödynnettiin Node.js- ja Frontend-kurssien materiaaleja.
  Materiaaleja on käytetty esimerkiksi siihen kuinka kirjautuminen tehdään, luodaan tokenit, verifoidaan tokenit ja miten reittejä käytetään.
- Backendissä ei ole käytetty suoraan muita tutoriaaleja vaan pieniä palasia otettua sieltä sun täältä eri nettisivustoilta eri ongelmien ratkaisemiseksi.
