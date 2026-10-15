import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import InputField from "../InputField";
import Button from "../Button";
import addressService, {
  CreateAddressRequest,
} from "@/services/user/address.service";
import Address from "@/types/address";
import tapinService, { City, State } from "@/services/user/tapin.service";
import SelectField from "../selectField";
import toast from "react-hot-toast";

const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

interface AddAddressModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  address?: Address | null;
  onSuccess?: () => void;
}

export const token =
  "jwt eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiYTFkM2FmZmEtZDdjYS00MTExLTliYWQtZmNjMmY0ZjBiN2FiIiwidXNlcm5hbWUiOiIwOTEyMTEyMDcwNyIsImVtYWlsIjoic2hheWFua2FyaW1pMjAwMDVAZ21haWwuY29tIiwiZXhwIjoyNjI0MTc3MDk0LCJvcmlnX2lhdCI6MTc2MDE3NzA5NH0.qw-m4dqBx0RNQZGQfMEMH3v4CWbD5vwziD2kNVJwO6s";
export const shopId = "956dcbc2-e527-434d-9ad0-2ccbe4f6742f";

const AddAddressModal = ({
  open,
  setOpen,
  address,
  onSuccess,
}: AddAddressModalProps) => {
  const [formData, setFormData] = useState<CreateAddressRequest>({
    fullName: "",
    phone: "",
    province: "",
    provinceCode: "",
    city: "",
    cityCode: "",
    addressLine: "",
    postalCode: "",
    plaque: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateAddressRequest>>({});
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  // Reset form when modal opens/closes or address changes
  useEffect(() => {
    if (open) {
      if (address) {
        setFormData({
          fullName: address.fullName,
          phone: address.phone,
          province: address.province,
          provinceCode: address.provinceCode,
          cityCode: address.cityCode,
          city: address.city,
          addressLine: address.addressLine,
          postalCode: address.postalCode || "",
          plaque: address.plaque || "",
        });
      } else {
        setFormData({
          fullName: "",
          phone: "",
          province: "",
          provinceCode: "",
          cityCode: "",
          city: "",
          addressLine: "",
          postalCode: "",
          plaque: "",
        });
      }
      setErrors({});
    }
    fetchStates();
  }, [open, address]);

  useEffect(() => {
    if (formData?.provinceCode) {
      fetchCities();
    }
  }, [formData?.provinceCode]);

  const fetchStates = async () => {
    try {
      const response = await tapinService.getStates();
      if (response?.entries?.list) {
        setStates(response.entries.list);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await tapinService.getStatesCities(
        formData?.provinceCode || ""
      );
      if (response?.entries?.list) {
        setCities(response.entries.list);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleInputChange = (
    field: keyof CreateAddressRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    // const newErrors: Partial<CreateAddressRequest> = {};
    const newErrors = [];

    if (!formData.fullName.trim()) {
      newErrors.push("نام و نام خانوادگی الزامی است");
    }

    if (!formData.phone.trim()) {
      newErrors.push("شماره تماس الزامی است");
    } else if (!/^09\d{9}$/.test(formData.phone)) {
      newErrors.push("شماره تماس باید با 09 شروع شود و 11 رقم باشد");
    }

    if (!formData.province.trim()) {
      newErrors.push("استان الزامی است");
    }

    if (!formData.city.trim()) {
      newErrors.push("شهر الزامی است");
    }

    if (!formData.addressLine.trim()) {
      newErrors.push("آدرس الزامی است");
    }

    if (!formData.postalCode && !formData.postalCode?.trim()) {
      newErrors.push("کد پستی الزامی است");
    }

    if (!formData.plaque && !formData.plaque?.trim()) {
      newErrors.push("پلاک الزامی است");
    }

    if (formData.postalCode && !/^\d{10}$/.test(formData.postalCode)) {
      newErrors.push("کد پستی باید 10 رقم باشد");
    }

    if (newErrors.length > 0) {
      newErrors.map((err) => {
        toast.error(err);
      });
    }

    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (address) {
        // Update existing address
        await addressService.updateAddress(address.id, formData);
      } else {
        // Create new address
        await addressService.createAddress(formData);
      }

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      fullName: "",
      phone: "",
      province: "",
      city: "",
      provinceCode: "",
      cityCode: "",
      addressLine: "",
      postalCode: "",
      plaque: "",
    });
    setErrors({});
  };

  return (
    <Modal
      title={address ? "ویرایش آدرس" : "افزودن آدرس جدید"}
      open={open}
      setOpen={handleClose}
      className="md:!max-w-5xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          value={formData.fullName}
          onChange={(value) => handleInputChange("fullName", value)}
          label="نام و نام خانوادگی"
          placeholder="مثال: محمد محمدی"
          error={errors.fullName}
        />
        <InputField
          value={formData.phone}
          onChange={(value) => handleInputChange("phone", value)}
          label="شماره تماس"
          placeholder="مثال: 09123456789"
          error={errors.phone}
        />
        <SelectField
          onChange={(value) => {
            handleInputChange(
              "province",
              states.find(
                (state) => state.code.toString() === value?.toString()
              )?.title || ""
            );
            handleInputChange("provinceCode", value || "");
          }}
          value={formData?.provinceCode || null}
          label="استان"
          options={states.map((state) => ({
            value: state.code.toString(),
            label: state.title,
          }))}
          placeholder="مثال: تهران"
        />
        <SelectField
          onChange={(value) => {
            handleInputChange(
              "city",
              cities.find((city) => city.code.toString() === value?.toString())
                ?.title || ""
            );
            handleInputChange("cityCode", value || "");
          }}
          value={formData?.cityCode || null}
          label="شهر"
          options={cities.map((city) => ({
            value: city.code.toString(),
            label: city.title,
          }))}
          placeholder={`مثال: ${cities?.[0]?.title || "تهران"}`}
        />
        <InputField
          value={formData.postalCode || ""}
          onChange={(value) => handleInputChange("postalCode", value)}
          label="کد پستی"
          placeholder="مثال: 0123456789"
          error={errors.postalCode}
        />
        <InputField
          value={formData.plaque || ""}
          onChange={(value) => handleInputChange("plaque", value)}
          label="پلاک"
          placeholder="مثال: 123"
          error={errors.plaque}
        />
      </div>
      <InputField
        value={formData.addressLine}
        onChange={(value) => handleInputChange("addressLine", value)}
        label="آدرس"
        placeholder="مثال: خیابان فردوسی"
        className="mt-6"
        error={errors.addressLine}
      />
      <Button
        title={address ? "ویرایش آدرس" : "ثبت آدرس"}
        className="mt-6 w-full md:w-fit md:mr-auto md:px-14 sticky bottom-0"
        loading={loading}
        onClick={handleSubmit}
      />
    </Modal>
  );
};

export default AddAddressModal;
