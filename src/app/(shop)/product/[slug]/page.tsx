export const revalidate = 604800; //7 dias

import { getProductBySlug } from "@/actions/products/get-product-by-slug";
import { ProductMobileSlideShow, ProductSlideShow, QuantitySelector, SizeSelector } from "@/components";
import { StockLabel } from "@/components/product/stock-label/StockLabel";
import { titleFont } from "@/config/fonts";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug

  const product = await getProductBySlug(slug);
  return {
    metadataBase: new URL('https://c693-2a0c-5a86-d107-8c00-a4ae-6f5e-ce8d-7a95.ngrok-free.app'),
    title: product?.title ?? 'Producto no encontrado',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      // se busca images: ['https://misitioweb.com/productos/prod-1/image.png']
      images: [`/products/${product?.images[1]}`],
    },
  }
}

interface Props {
  params: {
    slug: string;
  }
}

export default async function productPage({ params }: Props) {

  const { slug } = params;
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* SlideShow */}
      <div className="col-span-1 md:col-span-2">
        {/* Mobile Slideshow */}

        <ProductMobileSlideShow
          images={product.images} title={product.title}
          className="block md:hidden"
        />
        {/* Desktop Slideshow */}
        <ProductSlideShow
          images={product.images} title={product.title}
          className="hidden md:block"
        />
      </div>
      {/* Detalles producto */}
      <div className="col-span-1 px-5">

        <StockLabel slug={product.slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>

        <p className="text-lg mb-5">
          ${product.price}
        </p>

        <AddToCart product={product} />

        {/* Descripción */}
        <h3 className="font-bold text-sm">
          Descripción
        </h3>
        <p className="font-light">
          {product.description}
        </p>


      </div>
    </div>
  );
}