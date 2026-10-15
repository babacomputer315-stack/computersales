import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import InputField from "../InputField";
import Button from "../Button";
import { useAuth } from "@/context/AuthContext";
import AuthService from "@/services/auth.service";
import toast from "react-hot-toast";

const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

const EditProfileModal = ({
  open,
  setOpen,
  onSuccess,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
}) => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    nationalCode: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nationalCode: user.nationalCode || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!formData.firstName || !formData.lastName) {
        toast.error("لطفا نام و نام خانوادگی را وارد کنید");
        return;
      }
      if (formData.nationalCode && !/^\d{10}$/.test(formData.nationalCode)) {
        toast.error("لطفا کد ملی را به صورت صحیح وارد کنید");
        return;
      }
      const response = await AuthService.updateProfile(formData);
      updateUser(response);
      setOpen(false);
      setTimeout(() => {
        onSuccess?.();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      title="اطلاعات حساب کاربری"
      open={open}
      setOpen={setOpen}
      className="md:!max-w-5xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          value={formData.firstName}
          onChange={(value) => handleInputChange("firstName", value)}
          label="نام"
          placeholder="مثال: محمد"
        />
        <InputField
          value={formData.lastName}
          onChange={(value) => handleInputChange("lastName", value)}
          label="نام خانوادگی"
          placeholder="مثال: محمدی"
        />
        <InputField
          value={formData.nationalCode}
          onChange={(value) => handleInputChange("nationalCode", value)}
          label="کد ملی (اختیاری)"
          placeholder="001122334"
          textAlign="left"
        />
        <InputField
          value={formData.email}
          onChange={(value) => handleInputChange("email", value)}
          label="آدرس ایمیل (اختیاری)"
          placeholder="example@gmail.com"
          textAlign="left"
        />
        {/* <InputField
          textAlign="left"
          value={formData.phone}
          onChange={(value) => handleInputChange("phone", value)}
          label="شماره تلفن ثابت (اختیاری)"
          placeholder="021-12345678"
        /> */}
      </div>
      <Button
        title="ثبت اطلاعات"
        className="mt-6 w-full md:w-fit md:mr-auto md:px-14"
        onClick={handleSubmit}
      />
    </Modal>
  );
};

export default EditProfileModal;
