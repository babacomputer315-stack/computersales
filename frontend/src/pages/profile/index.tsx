import SiteLayout from "@/components/site/layout/Layout";
import ProfileSidebar from "@/components/site/layout/ProfileSidebar";
import AddAddressModal from "@/components/site/shared/Modal/AddAddressModal";
import EditProfileModal from "@/components/site/shared/Modal/EditProfileModal";
import Image from "next/image";
import React, { ReactElement, useState, useEffect } from "react";
import addressService from "@/services/user/address.service";
import Address from "@/types/address";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const { user } = useAuth();

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await addressService.getUserAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("خطا در دریافت آدرس ها");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setAddAddressModalOpen(true);
  };

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address);
    setAddAddressModalOpen(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("آیا از حذف این آدرس اطمینان دارید؟")) {
      return;
    }

    try {
      await addressService.deleteAddress(addressId);
      toast.success("آدرس با موفقیت حذف شد");
      fetchAddresses(); // Refresh the list
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("خطا در حذف آدرس");
    }
  };

  const handleAddressSuccess = () => {
    fetchAddresses(); // Refresh the list after create/update
  };

  return (
    <>
      <EditProfileModal
        open={editProfileModalOpen}
        setOpen={setEditProfileModalOpen}
      />
      <AddAddressModal
        open={addAddressModalOpen}
        setOpen={setAddAddressModalOpen}
        address={selectedAddress}
        onSuccess={handleAddressSuccess}
      />
      <div className="container mx-auto px-6 md:px-0 mt-6 md:mt-8 mb-16 md:mb-32">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6">
          <ProfileSidebar />
          <div className="flex flex-col gap-6">
            <div className="border-1.5 border-stroke p-6 rounded-lg">
              <div className="flex items-center justify-between pb-6 border-b-1.5 border-b-stroke">
                <h4 className="text-base font-semibold font-noora">
                  اطلاعات کاربری
                </h4>
                <button
                  onClick={() => setEditProfileModalOpen(true)}
                  className="text-secondary text-sm h-10 px-6 flex items-center justify-center border-1.5 border-stroke rounded-lg font-medium"
                >
                  ویرایش
                </button>
              </div>
              <div className="mt-6 grid-cols-1 grid md:grid-cols-2 gap-8">
                <div className="flex flex-col md:gap-10 gap-8">
                  <div className="flex flex-row md:flex-col items-center justify-between md:items-start gap-2">
                    <span className="text-sm text-secondary-text">
                      نام و نام خانوادگی
                    </span>
                    <span className="font-medium">{user?.name || "-"}</span>
                  </div>
                  <div className="flex flex-row md:flex-col items-center justify-between md:items-start gap-2">
                    <span className="text-sm text-secondary-text">کد ملی</span>
                    <span className="font-medium">
                      {user?.nationalCode || "-"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:gap-10 md:border-r-1.5 md:border-r-stroke md:pr-10 gap-8">
                  <div className="flex flex-row md:flex-col items-center justify-between md:items-start gap-2">
                    <span className="text-sm text-secondary-text">
                      آدرس ایمیل
                    </span>
                    <span className="font-medium">{user?.email || "-"}</span>
                  </div>
                  <div className="flex flex-row md:flex-col items-center justify-between md:items-start gap-2">
                    <span className="text-sm text-secondary-text">
                      شماره تلفن
                    </span>
                    <span className="font-medium">{user?.phone || "-"}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-1.5 border-stroke p-6 rounded-lg">
              <div className="flex items-center justify-between pb-6 border-b-1.5 border-b-stroke">
                <h4 className="text-base font-semibold font-noora">
                  لیست آدرس ها
                </h4>
                <button
                  onClick={handleAddAddress}
                  className="text-secondary text-sm h-10 px-6 flex items-center justify-center border-1.5 border-stroke rounded-lg font-medium"
                >
                  افزودن آدرس جدید
                </button>
              </div>
              <div className="mt-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-secondary-text mt-2">
                      در حال بارگذاری...
                    </p>
                  </div>
                ) : addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-secondary-text">
                      هیچ آدرسی ثبت نشده است
                    </p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="mb-6 last:mb-0 border-b-1.5 border-stroke pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center flex-1 gap-2">
                          <Image
                            src={"/assets/icons/map-pin.svg"}
                            alt="map"
                            width={20}
                            height={20}
                          />
                          <p>{address.addressLine}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-secondary text-sm px-3 py-1 border border-stroke rounded-md hover:bg-gray-50"
                          >
                            ویرایش
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-danger text-sm px-3 py-1 border border-danger rounded-md hover:bg-red-50"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-3 flex-wrap">
                        <div className="text-sm px-4 py-2 bg-[#F7F7F7] rounded-md">
                          استان: <span>{address.province}</span>
                        </div>
                        <div className="text-sm px-4 py-2 bg-[#F7F7F7] rounded-md">
                          شهر: <span>{address.city}</span>
                        </div>
                        <div className="text-sm px-4 py-2 bg-[#F7F7F7] rounded-md">
                          شماره تماس: <span>{address.phone}</span>
                        </div>
                        {address.postalCode && (
                          <div className="text-sm px-4 py-2 bg-[#F7F7F7] rounded-md">
                            کد پستی: <span>{address.postalCode}</span>
                          </div>
                        )}
                        <div className="text-sm px-4 py-2 bg-[#F7F7F7] rounded-md">
                          گیرنده: <span>{address.fullName}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <SiteLayout>{page}</SiteLayout>;
};
