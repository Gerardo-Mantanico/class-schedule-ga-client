import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange }) => (
  <div className="flex justify-center mt-4 gap-2">
    <button
      onClick={() => onPageChange(page - 1)}
      disabled={page === 0}
      className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
    >
      Anterior
    </button>
    <span>Página {page + 1} de {totalPages}</span>
    <button
      onClick={() => onPageChange(page + 1)}
      disabled={page + 1 >= totalPages}
      className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50"
    >
      Siguiente
    </button>
  </div>
);

export default Pagination;