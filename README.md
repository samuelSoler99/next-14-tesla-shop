# Descripción

Proyecto de ecommerce replicando la tienda de tesla, utilizando Next.js 14, prisma, postgreSql, docker-compose

## Docs interesantes

1. Prisma [text](https://www.prisma.io/docs/getting-started/quickstart)

## Modo dev

1. Clonar el repositorio
2. Crear una copia del ````.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Lanzar migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
6. Correr el proyecto ```npm run dev```


## Modo prod
