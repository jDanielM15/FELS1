BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Impresora" (
	"id"	INTEGER,
	"nombre"	TEXT,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "Impresora" ("id","nombre") VALUES (4,'Impresora
');
INSERT INTO "Impresora" ("id","nombre") VALUES (5,'dos');
INSERT INTO "Impresora" ("id","nombre") VALUES (6,'tres');
INSERT INTO "Impresora" ("id","nombre") VALUES (7,'cuatro');
COMMIT;
