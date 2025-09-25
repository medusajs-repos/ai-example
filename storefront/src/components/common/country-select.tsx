import { useEffect, useMemo, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { useNavigate, useLocation } from "@tanstack/react-router"

import { HttpTypes } from "@medusajs/types"
import { getCountryCodeFromPath } from "@/lib/utils/regions/get-country-code-from-path"
import { setStoredCountryCode } from "@/lib/utils/regions/stored-country-code"
import { Select } from "@medusajs/ui"
import { useUpdateCart } from "@/lib/hooks/dynamic/use-cart"
import { buildPathWithCountryCode } from "@/lib/utils/regions/build-path-with-country-code"

type CountryOption = {
  country_code: string
  region_id: string
  label: string
}

type CountrySelectProps = {
  regions: HttpTypes.StoreRegion[]
  className?: string
}

const CountrySelect = ({ regions, className }: CountrySelectProps) => {
  const [currentCountry, setCurrentCountry] = useState<
    CountryOption | undefined
  >()

  const navigate = useNavigate()
  const location = useLocation()
  const pathCountryCode = getCountryCodeFromPath(location.pathname)
  const currentPath = location.pathname.replace(`/${pathCountryCode}`, "") || "/"

  const updateCartMutation = useUpdateCart()

  const countries = useMemo(() => {
    const countryMap = new Map<string, CountryOption>()
    
    regions?.forEach((region) => {
      region.countries?.forEach((country) => {
        if (country.iso_2 && !countryMap.has(country.iso_2)) {
          countryMap.set(country.iso_2, {
            country_code: country.iso_2,
            region_id: region.id,
            label: country.display_name ?? "",
          })
        }
      })
    })
    
    return Array.from(countryMap.values())
      .sort((a, b) => (a?.label ?? "").localeCompare(b?.label ?? ""))
  }, [regions])

  useEffect(() => {
    if (pathCountryCode) {
      const option = countries?.find((o) => o?.country_code === pathCountryCode)
      setCurrentCountry(option)
    }
  }, [countries, pathCountryCode])

  const handleChange = async (countryCode: string) => {
    const option = countries?.find((o) => o?.country_code === countryCode)
    if (!option) return
    // Update stored country code
    setStoredCountryCode(option.country_code)
    
    // Navigate to the new country path
    const newPath = buildPathWithCountryCode(currentPath, option.country_code)
    navigate({ to: newPath as any })
    
    if (currentCountry?.region_id !== option.region_id) {
      await updateCartMutation.mutateAsync({
        region_id: option.region_id
      })
    }
  }

  return (
    <div className={className}>
      <Select onValueChange={handleChange} value={currentCountry?.country_code ?? ""}>
        <Select.Trigger className="border-0 shadow-none gap-2">
          <Select.Value placeholder="Select country" />
        </Select.Trigger>
        <Select.Content>
          {countries?.map((country) => (
            <Select.Item key={country.country_code} value={country.country_code}>
              <span className="flex items-center gap-x-2">
                <ReactCountryFlag
                  svg
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                  countryCode={country.country_code ?? ""}
                />
                {country.label}
              </span>
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default CountrySelect