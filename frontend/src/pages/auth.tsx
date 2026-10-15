import Button from "@/components/site/shared/Button";
import InputField from "@/components/site/shared/InputField";
import OtpInput from "@/components/site/shared/OtpInput";
import { useAuth } from "@/context/AuthContext";
import AuthService from "@/services/auth.service";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AuthPage = () => {
  const { login } = useAuth();
  const [step, setStep] = useState<number>(1);
  const [mobile, setMobile] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  const router = useRouter();
  const { redirect } = router.query;

  // Reset state when modal opens/closes
  useEffect(() => {
    setStep(1);
    setMobile("");
    setOtp("");
    setLoading(false);
    setResendLoading(false);
    setCountdown(0);
  }, []);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle mobile number submission
  const handleMobileSubmit = async () => {
    if (!AuthService.validateMobile(mobile)) {
      toast.error("لطفا شماره موبایل معتبر وارد کنید");
      return;
    }

    setLoading(true);
    try {
      await AuthService.register(mobile);
      setStep(2);
      setCountdown(120); // 2 minutes countdown
      // toast.success(result.message);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error?.response?.data?.message || "خطا در ارسال کد تایید");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async () => {
    if (!AuthService.validateOTP(otp)) {
      toast.error("لطفا کد 4 رقمی را وارد کنید");
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.verifyOTPAndLogin(mobile, otp);

      // toast.success("ورود موفقیت آمیز بود");

      // Update auth context
      login(result.user);

      // Call success callback if provided
      // if (onSuccess) {
      //   onSuccess(result.user);
      // }
      if (redirect) {
        router.push(redirect as string);
      } else {
        router.push("/");
      }

      // Close modal
      // setOpen(false);
    } catch (error: any) {
      console.error("OTP verification error:", error);
      // toast.error(error?.response?.data?.message || "خطا در تایید کد");
    } finally {
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      await AuthService.resendOTP(mobile);
      setCountdown(120); // Reset countdown
    } catch (error: any) {
      console.error("Resend OTP error:", error);
    } finally {
      setResendLoading(false);
    }
  };

  // Format countdown display
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (mobile.length === 11) {
      handleMobileSubmit();
    }
  }, [mobile]);

  useEffect(() => {
    if (otp.length === 4) {
      handleOtpSubmit();
    }
  }, [otp]);

  return (
    <div className="w-screen h-screen bg-input-bg flex items-center justify-center site">
      <div className="bg-white w-full h-screen md:h-auto md:max-w-4xl xl:max-w-4xl p-6 md:p-9 md:border-2 md:border-stroke md:rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <Link href={"/"} className="text-sm">
              بازگشت به سایت
            </Link>
            <div>
              <Link href={"tel:02145322"} className="text-primary font-bold">
                <span className="text-main-text">45322</span> - 021
              </Link>
            </div>
          </div>
          <div className="flex-1 flex pt-10 md:pt-0 md:justify-center flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Image
                src={"/assets/images/logo.svg"}
                alt="logo"
                width={36}
                height={38}
                className="mb-2"
              />
              {step === 1 ? (
                <>
                  <h1 className="font-bold text-xl">
                    به وبسایت{" "}
                    <span className="text-primary">حراج کامپیوتر</span> خوش
                    آمدید!
                  </h1>
                  <span className="text-sm text-[#5D6676]">
                    برای ورود و عضویت در سایت شماره موبایل خود را وارد کنید
                  </span>
                </>
              ) : (
                <>
                  <h1 className="font-bold text-xl">
                    دریافت <span className="text-primary">کد ورود</span>
                  </h1>
                  <span className="text-sm text-[#5D6676]">
                    کد 4 رقمی ارسال شده به شماره{" "}
                    <span className="text-primary">{mobile}</span> در قسمت زیر
                    وارد نمایید
                  </span>
                </>
              )}
            </div>
            {step === 1 ? (
              <InputField
                value={mobile}
                onChange={(value) => setMobile(value)}
                placeholder="شماره همراه خود را وارد نمایید"
                icon="/assets/icons/mobile.svg"
              />
            ) : (
              <div className="space-y-5">
                <OtpInput otp={otp} setOtp={setOtp} />
                <div className="flex items-center justify-between font-medium">
                  {/* Resend OTP section */}
                  <div className="text-center">
                    {countdown > 0 ? (
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span>ارسال مجدد کد تا</span>{" "}
                        <span className="w-7">
                          {formatCountdown(countdown)}
                        </span>
                      </p>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        disabled={resendLoading}
                        className="text-secondary text-sm hover:underline disabled:opacity-50"
                      >
                        {resendLoading ? "در حال ارسال..." : "ارسال مجدد کد"}
                      </button>
                    )}
                  </div>

                  {/* Back to mobile input */}
                  <button
                    onClick={() => setStep(1)}
                    className="text-[#717C91] text-sm hover:underline text-center"
                  >
                    تغییر شماره موبایل
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4">
              <Button
                //  title={step === 1 ? "دریافت کد ورود" : "تایید کد"}
                title={
                  step === 1
                    ? loading
                      ? "در حال ارسال..."
                      : "دریافت کد تایید"
                    : loading
                    ? "در حال تایید..."
                    : "تایید کد"
                }
                className="w-full"
                loading={loading}
                onClick={step === 1 ? handleMobileSubmit : handleOtpSubmit}
                disabled={loading || (step === 2 && otp.length !== 4)}
              />
              <div className="text-xs font-medium">
                ورود شما به معنای پذیرش{" "}
                <span className="text-primary">شرایط حراج کامپیوتر</span> و{" "}
                <span className="text-primary">قوانین حریم خصوصی</span> است
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <Image
            src={`/assets/images/auth.png`}
            alt="auth"
            width={500}
            height={620}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
