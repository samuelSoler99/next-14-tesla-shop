export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions/products/product-pagination";
import { Pagination, ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { Gender } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

const seedProducts = initialData.products;

interface Props {
  params: {
    gender: Gender;
  },
  searchParams: {
    page?: string;
  }
}

export default async function genderPage({ params, searchParams }: Props) {

  const { gender } = params
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page, gender });

  const labels: Record<Gender, string> = {
    'men': 'para Hombres',
    'women': 'para Mujeres',
    'kid': 'para Niños',
    'unisex': 'para Todos'
  }

  if (products.length === 0) {
    redirect('/')
  }

  return (
    <>
      <Title
        title={`Artículos de ${labels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid
        products={products}
      />
      
      <Pagination totalPages={totalPages} />
    </>
  );
}