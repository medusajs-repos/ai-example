import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { useNavigate, useLocation } from "@tanstack/react-router"

import useToggleState, { type StateType } from "@/lib/hooks/use-toggle-state"
import { HttpTypes } from "@medusajs/types"
import { getCountryCodeFromPath } from "@/lib/utils/regions"
import { setStoredCountryCode } from "@/lib/utils/regions/stored-country-code"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const [current, setCurrent] = useState<
    | { country: string | undefined; region: string; label: string | undefined }
    | undefined
  >(undefined)

  const navigate = useNavigate()
  const location = useLocation()
  const countryCode = getCountryCodeFromPath(location.pathname)
  const currentPath = location.pathname.replace(`/${countryCode}`, '') || '/'

  const { state, close } = toggleState

  const options = useMemo(() => {
    const countryMap = new Map<string, CountryOption>()
    
    regions?.forEach((r) => {
      r.countries?.forEach((c) => {
        if (c.iso_2 && !countryMap.has(c.iso_2)) {
          countryMap.set(c.iso_2, {
            country: c.iso_2,
            region: r.id,
            label: c.display_name,
          })
        }
      })
    })
    
    return Array.from(countryMap.values())
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    // Update stored country code
    setStoredCountryCode(option.country)
    
    // Navigate to the new country path
    const searchParams = Object.keys(location.search || {}).length > 0 
      ? `?${new URLSearchParams(location.search as any).toString()}` 
      : ''
    const newPath = `/${option.country}${currentPath === '/' ? '' : currentPath}${searchParams}`
    navigate({ to: newPath as any })
    
    close()
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o?.country === countryCode)
            : undefined
        }
      >
        <ListboxButton className="py-1 w-full">
          <div className="txt-small flex items-start gap-x-2">
            <span>Shipping to:</span>
            {current && (
              <span className="txt-small flex items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={current.country ?? ""}
                />
                {current.label}
              </span>
            )}
          </div>
        </ListboxButton>
        <div className="flex relative w-full min-w-[320px]">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute -bottom-[calc(100%-36px)] left-0 xsmall:left-auto xsmall:right-0 max-h-[442px] overflow-y-scroll z-[900] bg-white drop-shadow-md txt-small uppercase text-black no-scrollbar rounded-md w-full"
              static
            >
              {options?.map((o, index) => {
                return (
                  <ListboxOption
                    key={index}
                    value={o}
                    className="py-2 hover:bg-ui-bg-subtle px-3 cursor-pointer flex items-center gap-x-2"
                  >
                    <ReactCountryFlag
                      svg
                      style={{
                        width: "16px",
                        height: "16px",
                      }}
                      countryCode={o?.country ?? ""}
                    />{" "}
                    {o?.label}
                  </ListboxOption>
                )
              })}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect