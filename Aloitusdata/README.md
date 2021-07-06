# Aloitusdata

Säähavaintojen ja -asemien aloitusdata lisätty tietokantaan csv-tiedostoista mongoimport-komennolla, jotta tietokannasta viimeisin haku toimisi oikein.

## Ilmatieteen laitoksen säähavaintoasemat

Komento säähavaintoasemien lataamiseen MongoDB-tietokantaan.

```
mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection havaintoasemas --type=csv --headerline --file=saaasemat.csv
```

## Säähavaintojen aloitusdata

Komento säähavaintojen lataamiseen MongoDB-tietokantaan.

```
mongoimport --uri mongodb+srv://<KÄYTTÄJÄTUNNUS>:<SALASANA>@<MONGO CLUSTER>.doqpu.mongodb.net/<TIETOKANTA> --collection saanyts --type=csv --headerline --file=saahavainnot.csv
```
