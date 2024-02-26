import { initialData } from "./seed";
import { countries } from "./seed-countries";
import prisma from '../lib/prisma';

async function main() {

    // 1. delete de los registros previos
    await prisma.userAddress.deleteMany();
    await prisma.user.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.country.deleteMany();

    //countries
    await prisma.country.createMany({
        data: countries
    })

    //categorias 
    const { categories, products, users } = initialData;

    await prisma.user.createMany({
        data: users
    })

    const categoriesData = categories.map(category => ({
        name: category
    }));

    await prisma.category.createMany({
        data: categoriesData
    });

    const categoriesDB = await prisma.category.findMany();

    const categoriesMap = categoriesDB.reduce((map, category) => {

        map[category.name.toLocaleLowerCase()] = category.id

        return map
    }, {} as Record<string, string>) // <string=shirt,string=category>

    //productos
    products.forEach(async (product) => {
        const { type, images, ...rest } = product;
        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[type]
            }
        })

        //images
        const imagesData = images.map(image => ({
            url: image,
            productId: dbProduct.id
        }))

        await prisma.productImage.createMany({
            data: imagesData
        })
    })





    console.log('Seed Ejecutado Correctamente')
}

(() => {
    if (process.env.NODE_ENV === 'production') return;

    main();
})();