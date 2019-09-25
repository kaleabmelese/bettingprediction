// INSERT INTO client values(3, 'tsegaye','zenebu');
CREATE TABLE fruits(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

//  create TABLE predictions(
//      pid SERIAL PRIMARY KEY,

//  )

CREATE TABLE client(
    id SERIAL PRIMARY KEY,
    fname VARCHAR(20) NOT NULL,
    lname VARCHAR(20) NOT NULL,
);

INSERT INTO client(fname, lname) values('kaleab', 'melese');

INSERT INTO predictions(league, team1, team2, tip, matchtime, inserted_at)
VALUES
    ('English Primierleague', 'Chelsea FC', 'Liverpool FC', '1X', 2 / 21 / 2018, 'Mon Sep 23 2019 17:13:32 GMT+0300 (EAT)'),
    ('English Primierleague', 'Briton FC', 'Arsenal FC', '2', 2 / 11 / 2018, 'Mon Sep 23 2019 17:13:32 GMT+0300 (EAT)'),
    ('English Primierleague', 'Bernley FC', 'Westham FC', '1X', 2 / 10 / 2018, 'Mon Sep 23 2019 17:13:32 GMT+0300 (EAT)'),
    ('English Primierleague', 'Everton', 'Crystal Palace FC', '2', 2 / 13 / 2018, 'Mon Sep 23 2019 17:13:32 GMT+0300 (EAT)'),
    ('English Primierleague', 'Totenam FC', 'Aston Villa FC', '1', 2 / 23 / 2018, 'Mon Sep 23 2019 17:13:32 GMT+0300 (EAT)') returning *

        {
            "matchtime": "2/21/2018",
            "tip": "1X",
            "team1": "Chelsea FC",
            "team2": "Liverpool FC"
        },
        {
            "matchtime": "2/11/2018",
            "tip": "2",
            "team1": "Briton FC",
            "team2": "Arsenal FC"
        },
        {
            "matchtime": "2/10/2018",
            "tip": "1X",
            "team1": "Bernley FC",
            "team2": "Westham FC"
        },
        {
            "matchtime": "2/13/2018",
            "tip": "2",
            "team1": "Everton",
            "team2": "Crystal Palace FC"
        },
        {
            "matchtime": "2/23/2018",
            "tip": "1",
            "team1": "Totenam FC",
            "team2": "Aston Villa FC"
        }