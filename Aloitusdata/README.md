# Aloitusdata

Säähavaintojen ja -ennusteiden aloitusdata lisätty tietokantaan csv-tiedostoista mongoimport-komennolla, jotta tietokannasta viimeisin haku toimisi oikein.

## Halutut Ilmatieteenlaitoksen säähavaintoasemat

Säähavaintoasemien lataus MongoDB-tietokantaan

```
mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection havaintoasemas --type=csv --headerline --file=saaasemat.csv
```

## Säähavaintoasemien aloitusdata

```
mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection saanyts --type=csv --headerline --file=saahavainnot.csv
```
