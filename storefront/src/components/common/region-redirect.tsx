import getDefaultCountryCode from "@/lib/utils/regions/get-default-country-code";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { lazy, useEffect, useState } from "react";
import { useRegions } from "@/lib/hooks/static/use-region";
import { buildPathWithCountryCode } from "@/lib/utils/regions/build-path-with-country-code";
import { getCountryCodeFromPath } from "@/lib/utils/regions/get-country-code-from-path";
import { getStoredCountryCode, setStoredCountryCode } from "@/lib/utils/regions/stored-country-code";

const NotFound = lazy(() => import("./not-found"));

interface RegionRedirectProps {
  children?: React.ReactNode;
  isChecking404?: boolean;
} 

const RegionRedirect = ({ children, isChecking404 = false }: RegionRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: regions } = useRegions()
  const [is404, setIs404] = useState(false);

  useEffect(() => {
    if (!regions) return;

    const handleRegionRedirect = async () => {
      try {
        const currentPath = location.pathname;
        const urlCountryCode = getCountryCodeFromPath(currentPath);
        let countryCode: string | undefined = urlCountryCode;

        // If URL has a country code, validate it
        if (countryCode) {
          const isValidCountryCode = regions.some(
            (r) => r.countries?.some((c) => c.iso_2 === countryCode)
          );

          if (isValidCountryCode) {
            setStoredCountryCode(countryCode!);
            setIs404(true);
            return;
          }
        }

        countryCode = getStoredCountryCode() || getDefaultCountryCode(regions)

        if (countryCode) {
          setStoredCountryCode(countryCode);
          // Build the new path with country code
          const newPath = buildPathWithCountryCode(currentPath, countryCode);

          // Redirect to the regionalized URL
          navigate({ to: newPath as any, replace: true, reloadDocument: true });
        } else {
          setIs404(true);
        }
      } catch (error) {
        console.error("Region redirect error:", error);
        // Continue rendering even if region detection fails
      }
    };

    handleRegionRedirect();
  }, [location.pathname, location.search, navigate, regions]);

  return (
    <>
      {children}
      {is404 && isChecking404 && <NotFound />}
    </>
  )
};

export default RegionRedirect;
