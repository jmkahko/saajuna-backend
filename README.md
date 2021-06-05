Jyväskylän ammattikorkeakoulun Web-kehittäjä kurssin lopputyön Sää Juna backend

Projektin frontend https://github.com/jmkahko/saajuna-frontend

# .env tiedostoon tarvittavia muuttujia

```
# mongoDB Atlas tunnus
MONGOD_URL="TÄHÄNSALAINENLINKKI"

# verifonetoken JWT-token palvelimelta
SECRET = "SALAINENSALASANA"
```

Luotu modelit Asema.js, Havaintoasema.js, Saanyt.js ja User.js eri datoja varten.
Luotu controllerit asemacontroller.js, havaintoasemacontroller.js, junacontroller.js ja usercontroller.js.
Lisätty sääasemien haku Ilmatieteenlaitoksen avoimesta datasta.
Tehty omat tiedostot manuaalista tiedon tallentamista varten.
Sääennusteen hakeminen ja tiedon parserointi Ilmatieteenlaitoksen avoimesta datasta.
