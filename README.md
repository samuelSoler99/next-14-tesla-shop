# Descripción

Proyecto de ecommerce replicando la tienda de tesla, utilizando Next.js 14, prisma, postgreSql, docker-compose

todo: Faltaria agregar la comprobacion de stock de producto por talla, acutalmente un producto tiene un stock y deberia de ser las tallas tienenn un stock
todo: Faltaria agregar/sustituir un sistema de logs, actualmente hay muchos console.log que no deberian llegar a produccion, se recomienda https://www.npmjs.com/package/winston

## Docs interesantes

1. Prisma [text](https://www.prisma.io/docs/getting-started/quickstart)

## Modo dev

1. Clonar el repositorio
2. Crear una copia del ````.env.template``` y renombrarlo a ```.env``` y cambiar las variables de entorno
3. Instalar dependencias ```npm install```
4. Levantar la base de datos ```docker compose up -d```
5. Lanzar migraciones de Prisma ```npx prisma migrate dev```
6. Ejecutar seed ```npm run seed```
7. limpiar el localStorage del navegador.
8. Correr el proyecto ```npm run dev```

## Modo prod