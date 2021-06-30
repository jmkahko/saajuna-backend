# JAMK Web-kehittäjä kurssin lopputyön SääJuna backend

Projektin frontend https://github.com/jmkahko/saajuna-frontend

Työn ovat tehneet yhdessä Janne ja Leena Kähkönen. Molemmat ovat osallistuneet sekä backendin että frontendin kehittämiseen.

## Yleisesittely

(Sääjuna-backend)[https://saajuna-backend.herokuapp.com/] tarjoaa sivuston kautta backend palveluita (Sääjuna-frontend)[https://saajuna-frontend.herokuapp.com/] sivustolle. 


### Sovelluksen idea ja sen toiminnallisuus lyhyesti.

Sovelluksessa haetaan tiedot sekä VR:n että Ilmatieteenlaitoksen avoimesta datasta ja tuodaan ne käyttäjälle näkyviin sovellukseen. Käyttäjä voi luoda sovellukseen oman käyttäjätunnuksen, jolla siihen voi tallentaa 2 kpl suosikkeja (esim. suosikkipaikkakuntia tai asemia). Käyttäjä voi poistaa käyttäjätunnuksen ja vaihtaa sen salasanan. Admin-käyttäjä voi tehdä muutoksia tietokantaan, poistaa käyttäjätunnuksia ja näkee miten paljon tietoja on tallennettu. Admin-käyttäjiä ei voi luoda nettisivun kautta.

## Kuvaus teknologioista

Lopputyö on tietokanta-pohjainen full-stack-sovellus, jossa on frontend ja backend, jonka taustalla on tietokanta.
Backend on luotu Nodejs:llä ja Expressillä ja sen tietokantana on Mongodb (Atlas). Työ on julkaistu Heroku:hun.
Säätiedot parseroidaan Ilmatieteen laitokselta saatavasta XML datasta.
Juna tiedot parseroidaan Rautatieliikenteeltä saatavasta JSON:n datasta.

Frontend on luotu Angularilla. CRUD-toiminnot sijaitsevat frontendissä (käyttäjätunnusten luonti, muokkaus ja poisto sekä suosikkien lisäys, muokkaus ja poistaminen).

### Komennot

Komennot, joilla kehitysversion saa Githubista omalle koneelle toimimaan.
1. git clone git@github.com:jmkahko/saajuna-backend.git
2. Tämän jälkeen täytyy rekisteröityä (MongoDB Atlas)[https://www.mongodb.com/cloud/atlas] palveluun
3. Luodaan projektin juureen .env tiedosto
4. Kopioidaan oheinen sisältö

```
# mongoDB Atlas tunnus. Tähän syötetään MongoDB Atlas palvelusta saatava linkki
MONGOD_URL="TÄHÄNSALAINENLINKKI"

# verifonetoken JWT-token palvelimelta. Tähän syötetään salasana jota käytetään Tokenien salauksessa
SECRET = "SALAINENSALASANA"

# Cors frontendiin esim. paikallisesti käytetty osoite
FRONTEND_URL = 'http://localhost:4200'
```

5. Määrityksiä riippuen onko backend paikallisella koneella vai Herokuussa
controllers/havaintoasemacontroller.js tiedostossa rivillä XXXXXXXX. Määritä tämä kommenttiin, jos käytetään Herokuta

```
let tunti = aika1.getHours() - 3; // Ottaa tämä pois, kun siirtää Herokuuhun. Muuten ei toimi UTC aika. Haetaan ajasta tunti-tieto.
```

<<<<<<< HEAD
controllers/havaintoasemacontroller.js tiedostossa rivillä XXXXXXX. Määritä tämä kommenttiin, jos käytetään Herokuta
=======
controllers/havaintoasemacontroller.js tiedostossa rivillä 248. Määritä tämä kommenttiin, jos käytetään Herokuta

>>>>>>> 9f982ee22031d18aa1eaf55d0c47d0ecf23cfbad
```
let tunti = aika1.getHours() - 3; // Laita tämä kommenttiin, jos Herokuussa. Muuten ei toimi UTC aika
```

6. Näiden jälkeen käynnistää projekti ``` npm start ``` komennolla

## Reflektio ja ajankäyttö

Työ onnistui yllättävän hyvin, vaikka aikaa saatiin kulumaan useampi kymmenen tuntia. 

Vaikeinta on ollut aikatietojen muokkaaminen ja parserointi (UTC-aika).
Ilmatieteen laitoksen avoimesta datasta XML:n parserointiin meni useampi tunti aikaa, että tiedon sai halutunlaiseksi.
Rautatieliikenteen datasta JSON tietojen parserointi ei ollut niin vaikeaa kuin XML sanoman.

Työn virheiden havainnissa on käytetty (Githubin Issues)[https://github.com/jmkahko/saajuna-backend/issues] listausta, jotta virheen muistaa korjata myöhemmin kuntoon. Tällä hetkellä avoimet reitit, joita ei ole suojattu tunnistautumisella on muutettu, ettei backend kaadu virheen sattuessa.

Backendiin käytetty yhteensä aikaa n. 70 h.

## Työssä hyödynnetyt tutoriaalit

Kustakin tutoriaalista ilmoitetaan sen nimi ja osoite.
Kunkin tutorialain osalta kirjataan tieto kuinka paljon kyseistä tutoriaalia on hyödynnetty ja kuinka paljon omaa koodia on tuotettu tutoriaalin lisäksi.

- Tour of Heroes https://angular.io/tutorial. Käytetty miten tehdään tarvittavat reitit ja miten Observablesta haetaan dataa
- Ajan, XML ja JSON:in parserointiin käytetty paljon StackOverFlow:sta löytyviä vinkkejä ja ohjeita.
- Rautieliikenteen ja Ilmatieteen laitoksen omia ohjeita ja heidän Github sivustoja.
- Lisäksi on käytetty paljon koulutuksen materiaaleja joista eniten Node.js ja Frontend kurssien osalta.
  Miten kirjautuminen tehdään, luodaan tokenit, verifoidaan tokenit, miten reittejä käytetään.
- Backendissä ei ole käytetty suoraan muita tutoeriaaleja vaan pieniä palasia otettua sieltä sun täältä eri nettisivustoilta.

### Sekalaiset 

Luotu modelit Asema.js, Havaintoasema.js, Saanyt.js ja User.js eri datoja ja niiden tietoja varten.
Luotu controllerit asemacontroller.js, havaintoasemacontroller.js, junacontroller.js ja usercontroller.js.
Lisätty sääasemien haku Ilmatieteenlaitoksen avoimesta datasta
Tehty omat tiedostot manuaalista tiedon tallentamista varten.
Sääennusteen hakeminen ja tiedon parserointi Ilmatieteenlaitoksen avoimesta datasta.