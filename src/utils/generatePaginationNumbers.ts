export const generatePagination = (currentPage: number, totalPages: number) => {
    //si el numero total de páginas es 7 o menos 
    // mostramos el total sin puntos suspensivos
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    //si la página actual está entre las primeras 3 páginas
    //mostrar las primeras 3 y puntos suspenmsivos y las ultimas 2
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages]
    }
 
    //si la página actual esta entre las últimas 3 páginas
    // mostrar las primeras 2, punstos suspensivos, las últimas 3 páginas

    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
    }

    //si la página actual está en otro lugar medio
    // mostrar las primera página, puntos suspensivos, página actual y vecinos, puntos suspnesivos y última página
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ];
}