import { Button } from "@/components/common/button";

/**
 * AI AGENT USAGE GUIDE:
 *
 * WHEN TO USE:
 * - Use for navigating through paginated content in storefront
 * - Product listings: browse through multiple pages of products
 * - Search results: navigate through filtered product results
 * - Order history: browse through customer order history
 * - Category pages: navigate through product categories
 * - Blog/content: navigate through articles and content
 *
 * ECOMMERCE CONTEXT:
 * - Essential for product discovery and browsing
 * - Critical for search result navigation
 * - Important for order history management
 * - Required for large product catalogs
 * - Important for user experience in content-heavy sections
 *
 * NAVIGATION FEATURES:
 * - Previous/Next buttons for sequential navigation
 * - Page number buttons for direct navigation
 * - Ellipsis (...) for large page ranges
 * - Disabled states for boundary conditions
 * - Responsive design for mobile/desktop
 *
 * COMMON PATTERNS:
 * - Product grid pagination (12-24 items per page)
 * - Search result pagination (10-20 items per page)
 * - Order history pagination (10-50 orders per page)
 * - Category browsing pagination
 *
 * EXAMPLES:
 * - <Pagination page={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
 * - <Pagination page={1} totalPages={5} onPageChange={setPage} />
 * - <Pagination page={3} totalPages={10} onPageChange={handlePageChange} data-testid="product-pagination" />
 */

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  "data-testid"?: string;
};

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  "data-testid": dataTestId,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div
      className="flex items-center justify-center gap-2 mt-8"
      data-testid={dataTestId}
    >
      {/* Previous button */}
      <Button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        variant="secondary"
        size="fit"
      >
        Previous
      </Button>

      {/* Page numbers */}
      <div className="flex gap-1">
        {page > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-2 text-sm font-medium text-secondary-text bg-primary-bg border border-secondary-border hover:bg-secondary-bg"
            >
              1
            </button>
            {page > 4 && (
              <span className="px-2 py-2 text-sm text-secondary-text">...</span>
            )}
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
            {page < totalPages - 3 && (
              <span className="px-2 py-2 text-sm text-secondary-text">...</span>
            )}
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
      <Button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        variant="secondary"
        size="fit"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
