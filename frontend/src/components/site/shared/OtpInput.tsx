import ReactOtpInput from "react-otp-input";

export default function OtpInput({
  otp,
  setOtp,
}: {
  otp: string;
  setOtp: (otp: string) => void;
}) {
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  return (
    <ReactOtpInput
      value={otp}
      onChange={setOtp}
      numInputs={4}
      containerStyle={{
        flexDirection: "row-reverse",
        justifyContent: "space-between",
      }}
      inputStyle={{
        width: "50px",
        height: "50px",
        borderRadius: "8px",
        background: "#F5F5F5",
        border: "none",
      }}
      inputType="number"
      shouldAutoFocus
      renderInput={(props) => {
        const { "aria-label": ariaLabel, ...restProps } = props;
        return (
          <input
            aria-label={ariaLabel || "Code"}
            {...restProps}
            className="focus:outline-primary"
            onFocus={handleFocus}
          />
        );
      }}
    />
  );
}
