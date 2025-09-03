import { Text } from "@medusajs/ui"
import { useState } from "react"
import PaymentContainer from "./PaymentContainer"
import Input from "@components/ui/Input"

type StripeCardContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }>
  disabled?: boolean
  setCardBrand?: (brand: string) => void
  setError?: (error: string | null) => void
  setCardComplete?: (complete: boolean) => void
  onSelect?: () => void
}

const StripeCardContainer: React.FC<StripeCardContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setCardBrand,
  setError,
  setCardComplete,
  onSelect,
}) => {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")

  const isSelected = selectedPaymentOptionId === paymentProviderId

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardNumber(value)
    
    // Simulate card brand detection
    if (value.startsWith('4')) {
      setCardBrand?.('Visa')
    } else if (value.startsWith('5')) {
      setCardBrand?.('Mastercard')
    } else {
      setCardBrand?.('')
    }
    
    // Simulate validation
    const isComplete = value.replace(/\s/g, '').length >= 16 && expiryDate.length >= 5 && cvv.length >= 3
    setCardComplete?.(isComplete)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4)
    }
    setExpiryDate(value)
    
    // Simulate validation
    const isComplete = cardNumber.replace(/\s/g, '').length >= 16 && value.length >= 5 && cvv.length >= 3
    setCardComplete?.(isComplete)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCvv(value)
    
    // Simulate validation
    const isComplete = cardNumber.replace(/\s/g, '').length >= 16 && expiryDate.length >= 5 && value.length >= 3
    setCardComplete?.(isComplete)
  }

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="my-4 transition-all duration-150 ease-in-out">
          <Text className="txt-medium-plus text-ui-fg-base mb-4">
            Enter your card details:
          </Text>
          <div className="space-y-4">
            <Input
              label="Card number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry date"
                value={expiryDate}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
              />
              <Input
                label="CVV"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                maxLength={4}
              />
            </div>
            <Input
              label="Cardholder name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div className="mt-3 txt-xsmall text-ui-fg-subtle">
            This is a demo form. In production, use Stripe Elements for secure card input.
          </div>
        </div>
      )}
    </PaymentContainer>
  )
}

export default StripeCardContainer