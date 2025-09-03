import { useUpdateCustomer } from "@lib/hooks/useAuth";
import { HttpTypes } from "@medusajs/types";
import { Badge, Button, Input } from "@medusajs/ui";
import { useState } from "react";
import AccountInfo from "./AccountInfo";
import AccountContainer from "./AccountContainer";

interface ProfileTemplateProps {
  customer: HttpTypes.StoreCustomer;
}

const ProfileTemplate = ({ customer }: ProfileTemplateProps) => {
  return (
    <AccountContainer
      title="Profile"
      description="Manage your personal information, contact details, and account preferences in one place."
    >
      <ProfileName customer={customer} />
      <ProfileEmail customer={customer} />
      <ProfilePhone customer={customer} />
    </AccountContainer>
  );
};

const ProfileName = ({ customer }: { customer: HttpTypes.StoreCustomer }) => {
  const [firstName, setFirstName] = useState(customer.first_name || "");
  const [lastName, setLastName] = useState(customer.last_name || "");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const updateCustomer = useUpdateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      return;
    }

    try {
      await updateCustomer.mutateAsync({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      setSuccess("Name updated successfully");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update name");
    }
  };

  const clearState = () => {
    setError("");
    setSuccess("");
    setFirstName(customer.first_name || "");
    setLastName(customer.last_name || "");
  };

  return (
    <AccountInfo
      label="Name"
      currentInfo={
        <span>
          {customer.first_name} {customer.last_name}
        </span>
      }
      isSuccess={!!success}
      isError={!!error}
      successMessage={success}
      errorMessage={error}
      clearState={clearState}
      data-testid="account-name-editor"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-6">
          <Input
            label="First name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            data-testid="first-name-input"
            className="w-full"
          />
          <Input
            label="Last name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            data-testid="last-name-input"
            className="w-full"
          />
        </div>
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={updateCustomer.isPending}
            data-testid="save-button"
            disabled={!firstName.trim() || !lastName.trim()}
            className="px-8"
          >
            Save changes
          </Button>
        </div>
      </form>
    </AccountInfo>
  );
};

const ProfileEmail = ({ customer }: { customer: HttpTypes.StoreCustomer }) => {
  return (
    <AccountInfo
      label="Email"
      currentInfo={
        <div className="flex items-center gap-x-2">
          <span>{customer.email}</span>
          {customer.has_account && (
            <Badge size="small" color="green">
              Verified
            </Badge>
          )}
        </div>
      }
      data-testid="account-email-editor"
    >
      <div className="text-ui-fg-subtle space-y-3 leading-relaxed">
        <p>
          Email changes are currently not supported through this interface for
          security reasons.
        </p>
        <p>
          If you need to update your email address, please{" "}
          <a
            href="/customer-service"
            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover underline decoration-1 underline-offset-2"
          >
            contact customer service
          </a>{" "}
          for assistance.
        </p>
      </div>
    </AccountInfo>
  );
};

const ProfilePhone = ({ customer }: { customer: HttpTypes.StoreCustomer }) => {
  const [phone, setPhone] = useState(customer.phone || "");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const updateCustomer = useUpdateCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (phone && !phoneRegex.test(phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      await updateCustomer.mutateAsync({
        phone: phone.trim(),
      });
      setSuccess("Phone number updated successfully");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update phone number"
      );
    }
  };

  const clearState = () => {
    setError("");
    setSuccess("");
    setPhone(customer.phone || "");
  };

  return (
    <AccountInfo
      label="Phone"
      currentInfo={<span>{customer.phone || "No phone number"}</span>}
      isSuccess={!!success}
      isError={!!error}
      successMessage={success}
      errorMessage={error}
      clearState={clearState}
      data-testid="account-phone-editor"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <Input
            label="Phone number"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            data-testid="phone-input"
            className="w-full"
          />
          <p className="txt-small text-ui-fg-subtle leading-relaxed">
            We'll use this number to contact you about your orders if needed.
          </p>
        </div>
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={updateCustomer.isPending}
            data-testid="save-button"
            className="px-8"
          >
            Save changes
          </Button>
        </div>
      </form>
    </AccountInfo>
  );
};

export default ProfileTemplate;
