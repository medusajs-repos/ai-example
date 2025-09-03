import React from 'react'

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  'data-testid'?: string
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  'data-testid': dataTestId,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pageNumbers = []
    const startPage = Math.max(1, page - 2)
    const endPage = Math.min(totalPages, page + 2)

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8" data-testid={dataTestId}>
      {/* Previous button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-2 txt-small font-medium text-fg-subtle bg-white border border-border-base rounded-md hover:bg-bg-subtledisabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {page > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 txt-small font-medium text-fg-subtle bg-white border border-border-base rounded-md hover:bg-bg-subtle"
            >
              1
            </button>
            {page > 4 && <span className="px-2 py-2 txt-small text-fg-subtle">...</span>}
          </>
        )}

        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`px-3 py-2 txt-small font-medium rounded-md border ${
              pageNum === page
                ? 'bg-black text-white border-black'
                : 'text-fg-subtle bg-white border-border-base hover:bg-bg-subtle'
            }`}
          >
            {pageNum}
          </button>
        ))}

        {page < totalPages - 2 && (
          <>
            {page < totalPages - 3 && <span className="px-2 py-2 txt-small text-fg-subtle">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-2 txt-small font-medium text-fg-subtle bg-white border border-border-base rounded-md hover:bg-bg-subtle"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 txt-small font-medium text-fg-subtle bg-white border border-border-base rounded-md hover:bg-bg-subtledisabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination