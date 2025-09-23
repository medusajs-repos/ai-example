import { paymentInfoMap } from "../../lib/constants/constants";

type PaymentMethodInfoProps = {
  provider_id: string;
}

const PaymentMethodInfo = ({ provider_id }: PaymentMethodInfoProps) => {
  return (
    <div className="flex items-center gap-2">
      <span>{paymentInfoMap[provider_id]?.title || provider_id}</span>
      {paymentInfoMap[provider_id]?.icon}
    </div>
  )
}

export default PaymentMethodInfo;