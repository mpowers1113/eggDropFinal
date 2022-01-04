set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";



CREATE TABLE "public"."users" (
	"userId" serial NOT NULL UNIQUE,
	"username" TEXT NOT NULL UNIQUE,
	"email" TEXT NOT NULL UNIQUE,
	"hashedPassword" TEXT NOT NULL,
	"createdAt" timestamp with time zone default now(),
	"profilePhotoUrl" TEXT,
	CONSTRAINT "users_pk" PRIMARY KEY ("userId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."egg" (
	"eggId" serial NOT NULL UNIQUE,
	"userId" int NOT NULL,
	"photoUrl" TEXT NOT NULL,
	"message" TEXT NOT NULL,
	"createdAt" timestamp with time zone default now(),
	"latitude" DECIMAL NOT NULL,
	"longitude" DECIMAL NOT NULL,
	CONSTRAINT "egg_pk" PRIMARY KEY ("eggId")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."events" (
	"id" serial NOT NULL,
	"type" text,
	"payload" json NOT NULL,
	"createdAt" timestamp with time zone default now(),
	CONSTRAINT "events_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."comments" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"createdAt" timestamp with time zone default now(),
	"content" TEXT NOT NULL,
	CONSTRAINT "comments_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "public"."notifications" (
    "id" serial NOT NULL,
    "userId" INT,
	"payload" json NOT NULL,
	"createdAt" timestamp with time zone default now(),
	CONSTRAINT "notifications_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);


CREATE TABLE "public"."followers" (
	"followerId" int NOT NULL,
	"followingId" int NOT NULL,
	"isAccepted" boolean
) WITH (
  OIDS=FALSE
);



CREATE TABLE "public"."foundEggs" (
	"foundBy" int NOT NULL,
	"eggId" int NOT NULL UNIQUE,
	"foundAt" timestamp with time zone default now()
) WITH (
  OIDS=FALSE
);




ALTER TABLE "public"."egg" ADD CONSTRAINT "egg_fk0" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId");
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("userId") REFERENCES "public"."users"("userId");
ALTER TABLE "public"."followers" ADD CONSTRAINT "followers_fk0" FOREIGN KEY ("followerId") REFERENCES "public"."users"("userId");
ALTER TABLE "public"."followers" ADD CONSTRAINT "followers_fk1" FOREIGN KEY ("followingId") REFERENCES "public"."users"("userId");
ALTER TABLE "public"."foundEggs" ADD CONSTRAINT "foundEggs_fk0" FOREIGN KEY ("foundBy") REFERENCES "public"."users"("userId");
ALTER TABLE "public"."foundEggs" ADD CONSTRAINT "foundEggs_fk1" FOREIGN KEY ("eggId") REFERENCES "public"."egg"("eggId");