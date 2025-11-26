import { Button } from "@/components/common/button";
import { getCountryCodeFromPath } from "@/lib/utils/region/get-country-code-from-path";
import { Link, useLocation } from "@tanstack/react-router";

const Hero = () => {
  const location = useLocation();
  const countryCode = getCountryCodeFromPath(location.pathname);
  const baseHref = countryCode ? `/${countryCode}` : "";

  return (
    <div className="h-[75vh] w-full border-b border-primary-border relative bg-secondary-bg">
      <div className="w-full h-full flex flex-col justify-center items-center text-center gap-8">
        <div>
          <h1 className="text-3xl sm:text-4xl text-primary-text mb-4">
            Medusa Store
          </h1>
          <h2 className="!text-xlarge sm:text-xl text-secondary-text sm:max-w-sm text-pretty">
            Your modern commerce solution for exceptional shopping experiences.
          </h2>
        </div>
        <div className="flex gap-4">
          <Link to={`${baseHref}/store` as string}>
            <Button variant="primary">View Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
