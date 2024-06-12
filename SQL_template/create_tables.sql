DROP TABLE IF EXISTS ROOM CASCADE;
DROP TABLE IF EXISTS MESSAGE CASCADE;

CREATE TABLE ROOM (
    name varchar(25) PRIMARY KEY NOT NULL,
    active BOOLEAN NOT NULL
);

CREATE TABLE MESSAGE (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    room_name varchar(25) NOT NULL,
    room_user_name varchar(25) NOT NULL,
    message TEXT,
    time bigint,
    FOREIGN KEY (room_name) REFERENCES ROOM(name)
);