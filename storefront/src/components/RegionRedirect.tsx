import {
  getCountryCode,
  getCountryCodeFromPath,
  getRegionMap,
} from "@lib/util/regions";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

interface RegionRedirectProps {
  children: React.ReactNode;
}

const RegionRedirect = ({ children }: RegionRedirectProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleRegionRedirect = async () => {
      try {
        const currentPath = location.pathname;
        const urlCountryCode = getCountryCodeFromPath(currentPath);

        // If URL has a country code, validate it
        if (urlCountryCode) {
          const regionMap = await getRegionMap();

          // If the country code is invalid, redirect to default
          if (!regionMap.has(urlCountryCode)) {
            const defaultCountryCode = await getCountryCode();
            const pathWithoutCountry =
              currentPath.replace(`/${urlCountryCode}`, "") || "/";
            const searchParams =
              Object.keys(location.search || {}).length > 0
                ? `?${new URLSearchParams(location.search as any).toString()}`
                : "";
            const newPath = `/${defaultCountryCode}${
              pathWithoutCountry === "/" ? "" : pathWithoutCountry
            }${searchParams}`;

            navigate({ to: newPath as any, replace: true });
            return;
          }

          // Valid country code, no redirect needed
          return;
        }

        // No country code in URL, add default one
        const countryCode = await getCountryCode();

        if (countryCode) {
          // Build the new path with country code
          const searchParams =
            Object.keys(location.search || {}).length > 0
              ? `?${new URLSearchParams(location.search as any).toString()}`
              : "";
          const newPath = `/${countryCode}${
            currentPath === "/" ? "" : currentPath
          }${searchParams}`;

          // Redirect to the regionalized URL
          navigate({ to: newPath as any, replace: true });
        }
      } catch (error) {
        console.error("Region redirect error:", error);
        // Continue rendering even if region detection fails
      }
    };

    handleRegionRedirect();
  }, [location.pathname, location.search, navigate]);

  return <>{children}</>;
};

export default RegionRedirect;
