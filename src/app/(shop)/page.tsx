export const revalidate = 60;

import { Pagination, ProductGrid } from '@/components';
import { Title } from '../../components/ui/title/Title';
import { getPaginatedProductsWithImages } from '@/actions/products/product-pagination';
import { redirect } from 'next/navigation';

interface Props {
  searchParams: {
    page?: string;
  }
}

export default async function Home({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, currentPage, totalPages } = await getPaginatedProductsWithImages({ page });

  if (products.length === 0) {
    redirect('/')
  }

  // console.log(products);

  return (
    <>
      <Title
        title="Tienda"
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