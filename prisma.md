# Prisma

- [What is an ORM](#what-is-an-orm)
- [Setup Prisma](#setup-prisma)


---
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

For Typescript a ts-config.json file must be created. The contents of the file can be found in the Prisma documentation in the [quick starter guide](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgres).

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
