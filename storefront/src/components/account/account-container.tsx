import { type ReactNode } from "react"

interface AccountContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  backLink?: {
    href: string;
    label: string;
  };
}

const AccountContainer = ({
  title,
  description,
  children,
  backLink,
}: AccountContainerProps) => {
  return (
    <div className="px-6 py-2 sm:px-8 sm:py-2 max-w-4xl mx-auto">
      <div className="mb-12 flex flex-col gap-y-6">
        {backLink && (
          <a
            href={backLink.href}
            className="text-accent-text hover:text-accent-text-hover txt-small inline-flex items-center gap-x-2 w-fit group"
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {backLink.label}
          </a>
        )}

        <h1 className="txt-xlarge text-primary-text">{title}</h1>
        <p className="txt-large text-secondary-text max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      <div className="space-y-12">{children}</div>
    </div>
  )
}

export default AccountContainer
