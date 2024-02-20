import { initialData } from "./seed";
import prisma from '../lib/prisma';

interface ABC {
    asd: String;
}

async function main() {

    // 1. delete de los registros previos
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();


    //categorias 
    const { categories, products } = initialData;
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