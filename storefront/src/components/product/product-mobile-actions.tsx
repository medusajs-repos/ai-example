import { Dialog, Transition } from "@headlessui/react"
import { Button, clx, useToggleState } from "@medusajs/ui"
import React, { Fragment, lazy, Suspense } from "react"

import { isSimpleProduct } from "@/lib/utils/products/product"
import { HttpTypes } from "@medusajs/types"
import Loading from "@/components/common/loading"
import ProductPrice from "@/components/product/product-price"

const ProductOptionSelect = lazy(() => import("@/components/product/product-option-select"))

type ProductMobileActionsProps = {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
  options: Record<string, string | undefined>
  updateOptions: (title: string, value: string) => void
  inStock?: boolean
  handleAddToCart: () => void
  isAdding?: boolean
  show: boolean
  optionsDisabled: boolean
}

const ProductMobileActions: React.FC<ProductMobileActionsProps> = ({
  product,
  variant,
  options,
  updateOptions,
  inStock,
  handleAddToCart,
  isAdding,
  show,
  optionsDisabled,
}) => {
  const { state, open, close } = useToggleState()

  const isSimple = isSimpleProduct(product)

  return (
    <>
      <div
        className={clx("lg:hidden inset-x-0 bottom-0 fixed z-50", {
          "pointer-events-none": !show,
        })}
      >
        <Transition
          as={Fragment}
          show={show}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-primary-bg flex flex-col gap-y-3 justify-center items-center txt-large p-4 h-full w-full border-t border-primary-border"
            data-testid="mobile-actions"
          >
            <span data-testid="mobile-title" className="text-primary-text">{product.title}</span>
            <ProductPrice
              product={product}
              variant={variant}
            />
            <div
              className={clx("grid grid-cols-2 w-full gap-x-4", {
                "!grid-cols-1": isSimple,
              })}
            >
              {!isSimple && (
                <Button
                  onClick={open}
                  variant="secondary"
                  className="w-full"
                  data-testid="mobile-actions-button"
                >
                  <div className="flex items-center justify-between w-full">
                    <span>
                      {variant
                        ? Object.values(options).join(" / ")
                        : "Select Options"}
                    </span>
                    <span className="text-secondary-text">▼</span>
                  </div>
                </Button>
              )}
              <Button
                onClick={handleAddToCart}
                disabled={!inStock || !variant}
                className="w-full"
                isLoading={isAdding}
                data-testid="mobile-cart-button"
              >
                {!variant
                  ? "Select variant"
                  : !inStock
                  ? "Out of stock"
                  : "Add to cart"}
              </Button>
            </div>
          </div>
        </Transition>
      </div>
      <Transition appear show={state} as={Fragment}>
        <Dialog as="div" className="relative z-[75]" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-overlay-bg backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed bottom-0 inset-x-0">
            <div className="flex min-h-full h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Panel
                  className="w-full h-full transform overflow-hidden text-left flex flex-col gap-y-3"
                  data-testid="mobile-actions-modal"
                >
                  <div className="w-full flex justify-end pr-6">
                    <button
                      onClick={close}
                      className="bg-primary-bg w-12 h-12 rounded-full text-primary-text flex justify-center items-center shadow-lg"
                      data-testid="close-modal-button"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="bg-primary-bg px-6 py-12 rounded-t-lg">
                    {(product.variants?.length ?? 0) > 1 && (
                      <div className="flex flex-col gap-y-6">
                        {(product.options || []).map((option) => {
                          return (
                            <div key={option.id}>
                              <Suspense fallback={<Loading />}>
                                <ProductOptionSelect
                                  option={option}
                                  current={options[option.id]}
                                  updateOption={updateOptions}
                                  title={option.title ?? ""}
                                  disabled={optionsDisabled}
                                  />
                              </Suspense>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ProductMobileActions