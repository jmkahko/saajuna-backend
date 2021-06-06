# Jyväskylän ammattikorkeakoulun Web-kehittäjä kurssin lopputyön Sää Juna backend

Projektin frontend https://github.com/jmkahko/saajuna-frontend

## Yleisesittely

Sovelluksen idea ja sen toiminnallisuus lyhyesti.

Sovelluksessa haetaan tiedot sekä VR:n että Ilmatieteenlaitoksen avoimesta datasta ja tuodaan ne käyttäjälle näkyviin sovellukseen. Käyttäjä voi luoda sovellukseen oman käyttäjätunnuksen, jolla siihen voi tallentaa 3 kpl suosikkeja (esim. suosikkipaikkakuntia tai asemia).

## Kuvaus teknologioista

Lyhyehkö kuvaus eri teknologioiden käyttämisestä työssä.
Komennot, joilla kehitysversion saa Githubista omalle koneelle toimimaan

## Reflektio ja ajankäyttö

Miten työ onnistui? Mikä oli helppoa, mikä vaikeaa? Kuinka paljon käytit aikaa loppuharjoitustyön tekemiseen? Mitä tietoja/taitoja sinun tulee vielä kehittää?

## Käytetyt tutoriaalit

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
```
