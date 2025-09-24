import { Button } from "@/components/common/button"

type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  "data-testid"?: string
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  "data-testid": dataTestId,
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
        className="px-3 py-2 txt-small-plus text-secondary-text bg-primary-bg border border-secondary-border rounded-md hover:bg-secondary-bg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {page > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 txt-small-plus text-secondary-text bg-primary-bg border border-secondary-border rounded-md hover:bg-secondary-bg"
            >
              1
            </button>
            {page > 4 && <span className="px-2 py-2 txt-small text-secondary-text">...</span>}
          </>
        )}

        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            variant="secondary"
          >
            {pageNum}
          </Button>
        ))}

        {page < totalPages - 2 && (
          <>
            {page < totalPages - 3 && <span className="px-2 py-2 txt-small text-secondary-text">...</span>}
            <Button
              onClick={() => onPageChange(totalPages)}
              variant="secondary"
            >
              {totalPages}
            </Button>
          </>
        )}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-2 txt-small-plus text-secondary-text bg-primary-bg border border-secondary-border rounded-md hover:bg-secondary-bg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

export default Pagination