import React from 'react'
import SortProducts, { type SortOptions } from './SortProducts'

type RefinementListProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  'data-testid'?: string
}

const RefinementList = ({
  sortBy,
  setQueryParams,
  'data-testid': dataTestId,
}: RefinementListProps) => {
  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
    </div>
  )
}

export default RefinementList