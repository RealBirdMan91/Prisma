# Prisma

- [What is an ORM](#what-is-an-orm)
- [Setup Prisma](#setup-prisma)
- [Prisma Schema File](#prisma-schema-file)
- [Prisma Migrate](#prisma-migrate)
- [Prisma Client](#prisma-client)
- [Model](#model)
  - [Field Types](#field-types)
    - [String Attributes](#string-attributes)
    - [Int Attributes](#int-attributes)
    - [Float Attributes](#float-attributes)
    - [Decimal Attributes](#decimal-attributes)
    - [DateTime Attributes](#datetime-attributes)
  - [Field Type modifiers](#field-type-modifiers)
  - [Attributes](#attributes)
    - [@id](#id)
    - [@default](#default)
    - [@unique](#unique)
    - [@map](#map)
    - [@updatedAt](#updatedat)
    - [@ignore](#ignore)
    - [@relation](#relation)
  - [Attribute functions](#attribute-functions)
    - [autoincrement()](#autoincrement)
    - [cuid()](#cuid)
    - [uuid()](#uuid)
    - [now()](#now)
- [enum](#enum)
- [Relations](#relations)
  - [One to One Relations](#one-to-one-relations)
  - [One to many relations](#one-to-many-relations)
  - [Many to many relations](#many-to-many-relations)
    - [Explicit many to many relations](#explicit-many-to-many-relations)
    - [Implicit many to many relations](#implicit-many-to-many-relations)
  - [Self relations](#self-relations)
    - [One to one self relations](#one-to-one-self-relations)
    - [One to many self relations](#one-to-many-self-relations)
    - [Many to many self relations](#many-to-many-self-relations)
    - [Referential actions](#referential-actions)
- [Prisma Client in detail](#prisma-client-in-detail)
  - [CRUD](#crud)
    - [Create](#create)
      - [Create multiple records](#create-multiple-records)
    - [Update](#update)
      - [Update multiple records](#update-multiple-records)
      - [Update or create records](#update-or-create-records)
    - [Delete](#delete)
      - [Delete multiple records](#delete-multiple-records)
    - [Read](#read)
      - [Get record by ID or unique identifier](#get-record-by-id-or-unique-identifier)
      - [Get all records](#get-all-records)
      - [Get the first record that matches a specific criteria](#get-the-first-record-that-matches-a-specific-criteria)
    - [Filtering and sorting](#filtering-and-sorting)
      - [not](#not)
      - [in](#in)
      - [notIn](#notin)
      - [lt](#lt)
      - [gt](#gt)
      - [contains](#contains)
      - [startsWith](#startswith)
      - [endsWith](#endswith)

## What is an ORM

ORM stands for **Object-Relational Mapping**. It is a technique that lets you query and manipulate data from a database using an object-oriented paradigm. When talking about ORM, most people are referring to a library that implements the Object-Relational Mapping technique, such **Prisma** is one of them.

---

## Setup Prisma

In order to work with Prisma, it must be installed and configured beforehand. With `npm init` the Node Package Manager can be initialized in a folder of your choice.
Afterwards the following development dependencies are installed.

- typescript
- ts-node
- nodemon
- @types/node
- prisma

For Typescript a tsconfig.json file must be created. The contents of the file can be found in the Prisma documentation in the [quick starter guide](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres).

```JSON
{
    "compilerOptions": {
      "sourceMap": true,
      "outDir": "dist",
      "strict": true,
      "lib": ["esnext"],
      "esModuleInterop": true
    }
}
```

Prisma is initialized via `npx prisma init --datasource-provider postgresql`. The last specification (postgresql) specifies which RDBMS should be used for Prisma.

---

## Prisma Schema File

The Prisma Schema File `schema.prisma` is the main configuration file for your Prisma setup. The Prisma schema is not a Javascript file or a SQL file but a file with its own format that can only be understood by Prisma. Therefore also the file extension **.prisma**.

### generator:

The `genorator` in the file specifies what the Prisma file should be converted to. By default the provider is set to `prisma-client-js` formatter. GraphQl API, for example, needs a different formatter to choose from.

### datasource:

datasource is relatively self-explanatory. It specifies which RDBMS is used, in our case PostgreSQL.
The `url` specifies the database link. This can be found and changed in the **.env** file.
Care must be taken to ensure that the username, password, port and database name are specified correctly.

> DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"

---

## Prisma Migrate

Migrations can be realized via a `model` in Prisma. These are needed to create tables in a database and to define which values the database fields accept. A first simple `model` could look like this.

```Prisma
model User {
  id Int @id @default(autoincrement())
  name String
}
```

To map your data model to the database schema, you need to use the prisma migrate CLI commands:

> npx prisma migrate dev --name init

This command does two things:

1. It creates a new SQL migration file for this migration
2. It runs the SQL migration file against the database

As soon as the npx command is executed the text message **Generated Prisma Client (4.7.0 | library) to .\node_modules\@prisma\client in 74ms** is printed to console.<br> This means in our node_modules folder a new client folder is created which contains javascript files they allow us to interact with the database. That these are javascript files is due to the `prisma-client-js` formatter in the schema.prisma file.

---

## Prisma Client

As described in the previous chapter, `prisma-client-js` is needed to interact with our database. But this must first be installed via `npm install @prisma/client`.

> Notice that the install command automatically invokes prisma generate for you which reads your Prisma schema and generates a version of Prisma Client that is tailored to your models.<br><br>
> Whenever you make changes to your Prisma schema in the future, you manually need to invoke prisma generate in order to accommodate the changes in your Prisma Client API (`npx prisma generate`).

After installation, the client can be used by importing it and creating a new `PrismaClient` instance.

```Typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
   const createdUser = await prisma.user.create({data: {
       name: "manfred"
    }})

    console.log(createdUser);
}

main()
  .catch((e) => {
    console.log(e.message)
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

---

## Model

A `model` represents a table in a database.
The name of the model can be freely chosen and will later be the name of the table in the database. Each row within the model represents a field in the DB table. <br>
**A model row can be divided into four parts:**

1. name (id, name, age)
2. type of Field (String, String, Number)
3. field modifier (?)
4. attributes (@id @default(uuid()))

```Prisma
model User {
  id       String       @id @default(uuid())
  name     String
  age      Number?
}
```

The command `npx prisma migrate dev --name init` is used to create the desired tables in the database based on the `model`.
A whole example can be found [here](https://www.prisma.io/docs/concepts/components/prisma-migrate/get-started):

---

## Field Types

The Field types are needed to specify which value may be entered into the field of a table.

> Field Types can differ depending on the RDBMS you are using with Prisma. In this chapter, the most common Field Types for PostgreSQL are discussed. Special Field Types or Field Types for another RDBMS can be looked up [here](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#string).

**The field types in Prisma can be divided into:**

| Field Type | Default       |
| ---------- | ------------- |
| String     | TEXT          |
| Boolean    | BOOLEAN       |
| Int        | INTEGER       |
| BigInt     | BIGINT        |
| Float      | DOUBLE        |
| Decimal    | DECIMAL(5, 2) |
| DateTime   | TIMESTAMP     |

A default data type is assigned to the field types (see above). This can be changed at any time via the Prisma attributes. To refer to a native database type the `@db` attribute is needed. A dot can then be used to access a desired Native Database Type.

> Example: `@db.VarChar(x)`

---

## String Attributes

| Native Database Type | Prisma Attribute |
| -------------------- | ---------------- |
| TEXT                 | @db.Text         |
| CHAR(X)              | @db.CHAR(X)      |
| VARCHAR(X)           | @db.VarChar(X)   |
| UUID                 | @db.Uuid         |

---

## Int Attributes

| Native Database Type | Prisma Attribute |
| -------------------- | ---------------- |
| INTEGER              | @db.Integer      |
| SMALLINT             | @db.SmallInt     |

---

## Float Attributes

| Native Database Type | Prisma Attribute    |
| -------------------- | ------------------- |
| DOUBLE PRECISION     | @db.DoublePrecision |
| REAL                 | @db.REAL            |

---

## Decimal Attributes

| Native Database Type | Prisma Attribute  |
| -------------------- | ----------------- |
| DECIMAL              | @db.Decimal(p, s) |
| MONEY                | @db.Money         |

---

## DateTime Attributes

| Native Database Type | Prisma Attribute |
| -------------------- | ---------------- |
| TIMESTAMP(X)         | @db.Timestamp(X) |
| DATE                 | @db.Date         |
| TIME(X)              | @db.Time(X)      |

---

## Field Type modifiers

Field type modifiers are quick to understand. This is because only two exist.

**The [ ] modifier:** with the `[]` it is indicated that this field type is a list i.e. array.
This will be very important later when it comes to building relationships to other tables.

```Prisma
model User {
  id             Int      @id @default(autoincrement())
  favoriteColors String[]
}
```

**The ? modifier:** With the `?` modifier it is possible to make a field optional. Notice that you can't set a list array optional.

```Prisma
model User {
  id   Int     @id @default(autoincrement())
  name String?
}
```

---

## Attributes

Attributes modify the behavior of a field or block (e.g. models). There are two ways to add attributes to your data model:

- Field attributes are prefixed with `@`
- Block attributes are prefixed with `@@`

---

## @id

Defines a single-field ID on the model and Cannot be optional.

- Corresponding database type: `PRIMARY KEY`
- Can be annotated with a `@default()` value that uses functions to auto-generate an ID:
  - `autoincrement()`
  - `cuid()`
  - `uuid()`
- Can be defined on any scalar field (String, Int, enum)

```Prisma
model User {
  id       String       @id @default(uuid())
}
```

## @@id

Defines a multi-field ID (composite ID) on the model.

- Corresponding database type: `PRIMARY KEY`
- Can be annotated with a `@default()` value that uses functions to auto-generate an ID
- Cannot be optional
- Can be defined on any scalar field (String, Int, enum)
- Cannot be defined on a relation field
- The name of the composite ID field in Prisma Client has the following pattern: field1_field2_field3

```Prisma
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
}
```

---

## @default

Defines a default value for a field.

- Corresponding database type: `DEFAULT`
- Default values can be a static value (4, "hello") or one of the following functions:
  - autoincrement()
  - cuid()
  - uuid()
  - now()

```Prisma
model User {
  email  String @unique
  number Float  @default(1.1)
}
```

**Default Enum Types:**

```Prisma
enum Role {
  USER
  ADMIN
}

model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  name    String?
  role    Role     @default(USER)
  posts   Post[]
  profile Profile?
}
```

---

## @unique

Defines a unique constraint for this field.

- Corresponding database type: `UNIQUE`
- A field annotated with `@unique` can be optional or required
- A model can have any number of unique constraints
- Can be defined on any scalar field
- Cannot be defined on a relation field

```Prisma
model User {
  email String @unique
  name  String
}
```

## @@unique

Defines a compound unique constraint for the specified fields.

```Prisma
model User {
  firstname Int
  lastname  Int
  id        Int

  @@unique([firstname, lastname, id])
}
```

---

## @map

Maps a field name or enum value from the Prisma schema to a column or document field with a different name in the database. If you do not use `@map`, the Prisma field name matches the column name or document field name exactly.

```Prisma
model User {
  id        Int    @id @default(autoincrement())
  firstName String @map("first_name")
}
```

---

## @updatedAt

Automatically stores the time when a record was last updated. If you do not supply a time yourself, the Prisma Client will automatically set the value for fields with this attribute.

- Compatible with DateTime fields

```Prisma
model Post {
  id        String   @id
  updatedAt DateTime @updatedAt
}
```

## @ignore

Add `@ignore` to a field that you want to exclude from the Prisma Client (for example, a field that you do not want Prisma users to update). Ignored fields are excluded from the generated Prisma Client. The model's create method is disabled when doing this for required fields with no `@default` (because the database cannot create an entry without that data).

```
model User {
  id    Int    @id
  name  String
  email String @ignore // this field will be excluded
}
```

## @relation

Defines meta information about the relation.

- Corresponding database types: `FOREIGN KEY` / `REFERENCES`

```Prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

> more detail in the [Relations section](#relations)

---

## Attribute functions

## autoincrement( )

Create a sequence of integers in the underlying database and assign the incremented values to the ID values of the created records based on the sequence.

```Prisma
model User {
  id   Int    @id @default(autoincrement())
  name String
}
```

---

## cuid( )

Generate a globally unique identifier based on the cuid spec.

- Compatible with String

```Prisma
model User {
  id   String @id @default(cuid())
  name String
}
```

---

## uuid( )

Generate a globally unique identifier based on the UUID spec, version 4 (random).

- Compatible with String

```Prisma
model User {
  id   String @id @default(uuid())
  name String
}
```

---

## now( )

Set a timestamp of the time when a record is created.

- Compatible with DateTime

```Prisma
model User {
  id   String @id @default(uuid())
  name String
  createdAt DateTime @default(now())
}
```

---

## enum

Defines an enum

```Prisma
enum Role {
  USER
  ADMIN
}

model User {
  id   Int  @id @default(autoincrement())
  role Role
}
```

---

## Relations

A relation is a connection between two models in the Prisma schema.

The following Prisma schema defines a one-to-many relation between the User and Post models. The fields involved in defining the relation are highlighted:

```Prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}

```

In the Prisma schema, the foreign key-primary key relationship is represented by the `@relation` attribute for the author field.

### Types of relations

There are three different types (or cardinalities) of relations in Prisma:

- One-to-one (also called 1-1-relation)
- One-to-many (also called 1-n-relation)
- Many-to-many (also called m-n-relation)

The following Prisma schema includes every type of relation:

- 1-1: User ↔ Profile
- 1-n: User ↔ Post
- m-n: Post ↔ Category

---

## One to One Relations

One-to-one (1-1) relations refer to relations where at most one record can be connected on both sides of the relation.

**In the example below, there is a one-to-one relation between User and Profile.**

```Prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique
}
```

You can also reference a different field. In this case, you need to mark the field with the `@unique` attribute, to guarantee that there is only a single User connected to each Profile.

```Prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?
}

model Profile {
  id        Int    @id @default(autoincrement())
  user      User   @relation(fields: [userEmail], references: [email])
  userEmail String @unique
}
```

### Multi-field relations in relational databases

In relational databases only, you can also define use multi-field IDs to define a 1-1 relation

```Prisma
model User {
  firstName String
  lastName  String
  profile   Profile?

  @@id([firstName, lastName])
}

model Profile {
  id            Int    @id @default(autoincrement())
  user          User   @relation(fields: [userFirstName, userLastName], references: [firstName, lastName])
  userFirstName String
  userLastName  String

  @@unique([userFirstName, userLastName])
}
```

---

## One to many relations

One-to-many (1-n) relations refer to relations where one record on one side of the relation can be connected to zero or more records on the other side.

**In the following example, there is one one-to-many relation between the User and Post models.**

```Prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}
```

This one-to-many relation expresses the following:

- A user can have zero or more posts
- A post must always have an author

You can also reference another field. In this case, you must tag the field with the `@unique` attribute to ensure that only a single user is associated with each post.

```Prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id          Int    @id @default(autoincrement())
  authorEmail String
  author      User   @relation(fields: [authorEmail], references: [email])
}
```

### Required and optional relation fields in one-to-many relations

In the following example, you can create a Post without assigning a User

```Prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int   @id @default(autoincrement())
  author   User? @relation(fields: [authorId], references: [id])
  authorId Int?
}
```

---

## Many to many relations

Many-to-many (m-n) relations refer to relations where zero or more records on one side of the relation can be connected to zero or more records on the other side.

> In relational databases, m-n-relations are typically modelled via relation tables. m-n-relations can be either explicit or implicit in the Prisma schema.

## Explicit many to many relations

In an explicit many-to-many relation, the relation table is represented as a model in the Prisma schema and can be used in queries. Explicit many-to-many relations define three models

- Two models that have a many-to-many relation, such as Category and Post
- One model that represents the relation table, such as CategoriesOnPosts (also sometimes called JOIN table) in the underlying database.

In this example, the model representing the relation table defines additional fields that describe the Post/Category relationship - who assigned the category (assignedBy), and when the category was assigned (assignedAt)

```Prisma
model Post {
  id         Int                 @id @default(autoincrement())
  title      String
  categories CategoriesOnPosts[]
}

model Category {
  id    Int                 @id @default(autoincrement())
  name  String
  posts CategoriesOnPosts[]
}

model CategoriesOnPosts {
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int
  assignedAt DateTime @default(now())
  assignedBy String

  @@id([postId, categoryId])
}
```

---

## Implicit many-to-many relations

Implicit many-to-many relations define relation fields as lists on both sides of the relation. Although the relation table exists in the underlying database.

**In the example below, there's one implicit m-n-relation between Post and Category**

```Prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String
  posts Post[]
}
```

---

## Self relations

A relation field can also reference its own model, in this case the relation is called a self-relation. Self-relations can be of any cardinality, 1-1, 1-n and m-n.

> Note that self-relations always require the `@relation` attribute.

---

## One to one self relations

```Prisma
model User {
  id          Int     @id @default(autoincrement())
  name        String?
  successorId Int?    @unique
  successor   User?   @relation("BlogOwnerHistory", fields: [successorId], references: [id])
  predecessor User?   @relation("BlogOwnerHistory")
}
```

This relation expresses the following:

- "a user can have one or zero predecessors" (for example, Sarah is Mary's predecessor as blog owner)
- "a user can have one or zero successors" (for example, Mary is Sarah's successor as blog owner)

> **Note:** One-to-one self-relations cannot be made required on both sides. One or both sides must be optional, otherwise it becomes impossible to create the first User record.

**To create a one-to-one self-relation:**

- Both sides of the relation must define a `@relation` attribute that share the same name - in this case, `BlogOwnerHistory`.

- One relation field must be a fully annotated. In this example, the `successor` field defines both the field and references arguments.

- One relation field must be backed by a foreign key. The `successor` field is backed by the `successorId` foreign key, which references a value in the id field. The `successorId` scalar relation field also requires a `@unique` attribute to guarantee a one-to-one relation.

---

## One to many self relations

```Prisma
model User {
  id        Int     @id @default(autoincrement())
  name      String?
  teacherId Int?
  teacher   User?   @relation("TeacherStudents", fields: [teacherId], references: [id])
  students  User[]  @relation("TeacherStudents")
}
```

This relation expresses the following:

- "a user has zero or one teachers "

- "a user can have zero or more students"

---

## Many to many self relations

```Prisma
model User {
  id         Int     @id @default(autoincrement())
  name       String?
  followedBy User[]  @relation("UserFollows")
  following  User[]  @relation("UserFollows")
}
```

This relation expresses the following:

- "a user can be followed by zero or more users"
- "a user can follow zero or more users"

---

## Referential actions

Referential actions are policies that define how a referenced record is handled by the database when you run an update (`onUpdate`)or delete (`OnDelete`) query.

In the following example, adding onDelete: Cascade to the author field on the Post model means that deleting the User record will also delete all related Post records.

```Prisma
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId Int
}

model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

Prisma supports the following referential actions:

- Cascade
- Restrict
- NoAction
- SetNull
- SetDefault

All referential actions can be looked up [here](https://www.prisma.io/docs/concepts/components/prisma-schema/relations/referential-actions)

### Cascade

- onDelete: Cascade Deleting a referenced record will trigger the deletion of referencing record.

- onUpdate: Cascade Updates the relation scalar fields if the referenced scalar fields of the dependent record are updated.

### Restrict

- onDelete: Restrict Prevents the deletion if any referencing records exist.

- onUpdate: Restrict Prevents the identifier of a referenced record from being changed.

### SetNull

- onDelete: SetNull The scalar field of the referencing object will be set to NULL.

- onUpdate: SetNull When updating the identifier of a referenced object, the scalar fields of the referencing objects will be set to NULL.

---

## Prisma Client in detail

After the client has been installed via `npm install @prisma/client`, it can be imported and used in the desired controller.

```Prisma
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

> Notice that the install command automatically invokes prisma generate for you which reads your Prisma schema and generates a version of Prisma Client that is tailored to your models.<br><br>
> Whenever you make changes to your Prisma schema in the future, you manually need to invoke prisma generate in order to accommodate the changes in your Prisma Client API (npx prisma generate).

---

## CRUD

All examples of CRUD operations are based on the [following scheme](./project-one/prisma/schema.prisma) in the project-one folder.

---

## Create

The method call `create` can be used to create a new record in the database.

The `create` call accepts an object as a parameter.
This object accepts `data`, `select` and `include` as keys.

1. `data`: Wraps all the model fields in a type so that they can be provided when creating new records. It also includes relation fields which lets you perform (transactional) nested inserts.

   ```Javascript
   const user = await prisma.user.create({
   data: {
     email: 'elsa@prisma.io',
     name: 'Elsa Prisma',
     profile: {
       create: {
         biography: 'Some biograpy data'
       }
     }
   }
   })
   ```

2. `select`: Specifies which properties to include on the returned object.

   ```Javascript
   const user = await prisma.user.create({
    data: {
      email: 'bernd@prisma.io',
      name: 'bernd Prisma',
      profile: {
        create: {
          biography: 'Some nother biograpy data'
        }
      }
    },
    select: {
      email: true,
      id: true
    }
   })
   ```

3. `include`: Specifies which relations should be eagerly loaded on the returned object.

   ```Javascript
   await prisma.user.create({
    data: {
      email: 'marion@prisma.io',
      name: 'marion Prisma',
      profile: {
        create: {
          biography: 'Some nother biograpy data'
        }
      }
    },
    include: {
      profile: true
    }
   })
   ```

---

## Create multiple records

`createMany` creates multiple records in a transaction.

The `createMany` call accepts an object as a parameter.
This object accepts `data` and `skipDuplicates` as keys.

```Javascript
const createMany = await prisma.user.createMany({
  data: [
    { name: 'Bob', email: 'bob@prisma.io' },
    { name: 'Bobo', email: 'bob@prisma.io' }, // Duplicate unique key!
    { name: 'Yewande', email: 'yewande@prisma.io' },
    { name: 'Angelique', email: 'angelique@prisma.io' },
  ],
  skipDuplicates: true, // Skip 'Bobo'
})
```

---

## Update

`update` updates an existing database record.

The `update` call accepts an object as a parameter.
This object accepts `data`, `where`, `select`, `include` as keys.

```Javascript
const updateUser = await prisma.user.update({
  where: {
    email: 'viola@prisma.io',
  },
  data: {
    name: 'Viola the Magnificent',
  },
})
```

---

## Update multiple records

`updateMany` updates a batch of existing database records in bulk and returns the number of updated records.

The `updateMany` call accepts an object as a parameter.
This object accepts `data`, `where` as keys.

```Javascript
const updateUsers = await prisma.user.updateMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
  data: {
    role: 'ADMIN',
  },
})
```

---

## Update or create records

upsert does the following:

- If an existing database record satisfies the where condition, it updates that record
- If no database record satisfies the where condition, it creates a new database record

The `upsert` call accepts an object as a parameter.
This object accepts `create`, `update`, `where`, `select`, `include` as keys.

```Javascript
const upsertUser = await prisma.user.upsert({
  where: {
    email: 'viola@prisma.io',
  },
  update: {
    name: 'Viola the Magnificent',
  },
  create: {
    email: 'viola@prisma.io',
    name: 'Viola the Magnificent',
  },
})
```

---

## Delete

delete deletes an existing database record. You can delete a record:

- By ID
- By a unique attribute

The `delete` call accepts an object as a parameter.
This object accepts `where`, `select`, `include` as keys.

```javascript
const deleteUser = await prisma.user.delete({
  where: {
    email: "elsa@prisma.io",
  },
});
```

---

## Delete multiple records

The `delete` call accepts an object as a parameter. This object accepts `where` as keys.

The following query uses deleteMany to delete all User records where email contains prisma.io:

```Javascript
const deleteUsers = await prisma.user.deleteMany({
  where: {
    email: {
      contains: 'prisma.io',
    },
  },
})
```

---

## Read

## Get record by ID or unique identifier

`findUnique` query lets you retrieve a single database record:

- By ID
- By a unique attribute

The `findUnique` call accepts an object as a parameter.
This object accepts `where`, `select`, `include`, `rejextOnNotFound` as keys.

```javascript
const user = await prisma.user.findUnique({
  where: {
    email: "elsa@prisma.io",
  },
  rejectOnNotFound: true,
});
```

> findUnique replaced findOne in version.

---

## Get all records

`findMany` returns a list of records.

The `findMany` call accepts an object as a parameter.
This object accepts `where`, `orderBy`, `skip`, `cursor`, `take`, `select`, `include`, `distinct`

1. `orderBy`: Lets you order the returned list by any property.

   ```Javascript
   const users = await prisma.user.findMany({
   orderBy: {
     name: "asc"
   }
   })
   ```

2. `skip`: Specifies how many of the returned objects in the list should be skipped.

   ```Javascript
   const users = await prisma.user.findMany({
    orderBy: {
      name: "asc"
    },
    skip: 2
   })
   ```

3. `take`: Specifies how many objects should be returned in the list (as seen from the beginning (positive value) or end (negative value) either of the list or from the cursor position if mentioned)

   ```Javascript
   const users = await prisma.user.findMany({
    orderBy: {
      name: "asc"
    },
    skip: 2,
    take: 1
   })
   ```

---

## Get the first record that matches a specific criteria

`findFirst` returns the first record in a list that matches your criteria.

The `findFirst` call accepts an object as a parameter.
This object accepts `distinct`, `where`, `orderBy`, `include`,
`select`, `skip`, `take`, `cursor`, `rejectOnNotFound`

---

## Filtering and sorting

Prisma Client allows you to filter records on any combination of model fields, including related models, and supports a variety of filter conditions.

For this purpose, Prisma provides a variety of filter conditions and operators.

**Filter conditions and operators:**

---

## not

Return all users where name does not equal "Eleanor"

```Javascript
const result = await prisma.user.findMany({
  where: {
    name: {
      not: 'Eleanor',
    },
  },
})
```

---

## in

Value n exists in list.

Get User records where the name can be found in the following list: `['Saqui', 'Clementine', 'Bob']`.

```Javascript
const getUser = await prisma.user.findMany({
  where: {
    name: { in: ['Saqui', 'Clementine', 'Bob'] },
  },
})
```

---

## notIn

Value n does not exist in list.

Get User records where the id can not be found in the following list: [22, 91, 14, 2, 5]

```Javascript
const getUser = await prisma.user.findMany({
  where: {
    id: { notIn: [22, 91, 14, 2, 5] },
  },
})
```

---

## lt

Value n is less than x.

Get all Post records where likes is less than 9.

```Javascript
const getPosts = await prisma.post.findMany({
  where: {
    likes: {
      lt: 9,
    },
  },
})
```

## lte

Value n is less than or equal to x.

Get all Post records where likes is less or equal to 9

```Javascript
const getPosts = await prisma.post.findMany({
  where: {
    likes: {
      lte: 9,
    },
  },
})
```

---

## gt

Value n is greater than x.

Get all Post records where likes is greater than 9

```Javascript
const getPosts = await prisma.post.findMany({
  where: {
    likes: {
      gt: 9,
    },
  },
})
```

## gte

Value n is greater than or equal to x.

Get all Post records where likes is greater than or equal to 9

```Javascript
const getPosts = await prisma.post.findMany({
  where: {
    likes: {
      gte: 9,
    },
  },
})
```

---

## contains

Value n contains x.

1. Count all Post records where content contains databases

   ```Javascript
   const result = await prisma.post.count({
     where: {
       content: {
         contains: 'databases',
       },
     },
   })
   ```

2. Count all Post records where content does not contain databases
   ```Javascript
   const result = await prisma.post.count({
     where: {
       NOT: {
         content: {
           contains: 'databases',
           mode: 'insensitive' // searches in case insensitive way
         },
       },
     },
   })
   ```

---

## startsWith

Get all Post records where title starts with Pr (such as Prisma)

```Javascript
const result = await prisma.post.findMany({
  where: {
    title: {
      startsWith: 'Pr',
    },
  },
})
```

---

## endsWith

Get all User records where email ends with prisma.io

```Javascript
const result = await prisma.user.findMany({
  where: {
    email: {
      endsWith: 'prisma.io',
    },
  },
})
```
---