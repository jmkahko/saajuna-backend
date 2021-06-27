# Jyväskylän ammattikorkeakoulun Web-kehittäjä kurssin lopputyön Sää Juna backend

Projektin frontend https://github.com/jmkahko/saajuna-frontend

Työn ovat tehneet yhdessä Janne ja Leena Kähkönen. Molemmat ovat osallistuneet sekä backendin että frontendin kehittämiseen.

## Yleisesittely

### Sovelluksen idea ja sen toiminnallisuus lyhyesti.

Sovelluksessa haetaan tiedot sekä VR:n että Ilmatieteenlaitoksen avoimesta datasta ja tuodaan ne käyttäjälle näkyviin sovellukseen. Käyttäjä voi luoda sovellukseen oman käyttäjätunnuksen, jolla siihen voi tallentaa 2 kpl suosikkeja (esim. suosikkipaikkakuntia tai asemia). Käyttäjä voi poistaa käyttäjätunnuksen ja vaihtaa sen salasanan. Admin-käyttäjä voi tehdä muutoksia tietokantaan. Admin-käyttäjiä ei voi luoda nettisivun kautta.

## Kuvaus teknologioista

Lyhyehkö kuvaus eri teknologioiden käyttämisestä työssä.
Komennot, joilla kehitysversion saa Githubista omalle koneelle toimimaan.

Lopputyö on tietokanta-pohjainen full-stack-sovellus, jossa on frontend ja backend, jonka taustalla on tietokanta.
Backend on luotu Nodejs:llä ja Expressillä ja sen tietokantana on Mongodb (Atlas). Työ on julkaistu Heroku:hun.

Frontend on luotu Angularilla. CRUD-toiminnot sijaitsevat frontendissä (käyttäjätunnusten luonti, muokkaus ja poisto sekä suosikkien lisäys, muokkaus ja poistaminen).

### Komennot

xxx

## Reflektio ja ajankäyttö

Miten työ onnistui? Mikä oli helppoa, mikä vaikeaa? Kuinka paljon käytit aikaa loppuharjoitustyön tekemiseen? Mitä tietoja/taitoja sinun tulee vielä kehittää?

Toistaiseksi työ on onnistunut hyvin. Vaikeinta on ollut aikatietojen muokkaaminen ja parserointi (UTC-aika).
Aikaa on käytetty backendiin ainakin 30-40 h ja frontendiin xxx h.

## Työssä hyödynnetyt tutoriaalit

Kustakin tutoriaalista ilmoitetaan sen nimi ja osoite.
Kunkin tutorialain osalta kirjataan tieto kuinka paljon kyseistä tutoriaalia on hyödynnetty ja kuinka paljon omaa koodia on tuotettu tutoriaalin lisäksi.

Tour of Heroes https://angular.io/tutorial frontendissä.
Backendissä on käytetty lähinnä Web-kehittäjä koulutuksen materiaaleja sekä ajan parseroimiseen ja muotoiluun on käytetty joitakin ohjeita StackOverFlow:sta.

### Sekalaiset

Luotu modelit Asema.js, Havaintoasema.js, Saanyt.js ja User.js eri datoja ja niiden tietoja varten.
Luotu controllerit asemacontroller.js, havaintoasemacontroller.js, junacontroller.js ja usercontroller.js.
Lisätty sääasemien haku Ilmatieteenlaitoksen avoimesta datasta
Tehty omat tiedostot manuaalista tiedon tallentamista varten.
Sääennusteen hakeminen ja tiedon parserointi Ilmatieteenlaitoksen avoimesta datasta.

### .env tiedostoon tarvittavia muuttujia

```
# mongoDB Atlas tunnus
MONGOD_URL="TÄHÄNSALAINENLINKKI"

# verifonetoken JWT-token palvelimelta
SECRET = "SALAINENSALASANA"

# Cors frontendiin esim. paikallisesti käytetty osoite
FRONTEND_URL = 'http://localhost:4200'
```
