import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Button from "../Button";
import Label from "../Label";
import commentService from "@/services/user/comment.service";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const Rating = dynamic(
  () => import("react-rating").then((m) => (m as any).default),
  { ssr: false }
) as any;

const Modal = dynamic(() => import("./Modal"), {
  ssr: false,
});

interface AddCommentModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productId: number;
  onSuccess?: () => void;
}

const AddCommentModal = ({
  open,
  setOpen,
  productId,
  onSuccess,
}: AddCommentModalProps) => {
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState<{ content: string; rating: number }>(
    {
      content: "",
      rating: 5,
    }
  );
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await commentService.createComment(productId, formData);

      setOpen(false);
      setFormData({
        content: "",
        rating: 5,
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      content: "",
      rating: 5,
    });
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      if (!isAuthenticated) {
        toast.error("لطفا برای ثبت دیدگاه وارد حساب کاربری خود شوید");
        setOpen(false);
        router.push("/auth");
      }
    }
  }, [open, isAuthenticated]);

  return (
    <Modal
      title={"ثبت دیدگاه"}
      open={open}
      setOpen={handleClose}
      className="md:!max-w-5xl"
    >
      <Label label="متن دیدگاه" />
      <textarea
        className="border-none outline-none rounded-xl px-3 text-sm py-3 resize-none bg-input-bg w-full"
        rows={5}
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        placeholder="متن دیدگاه خود را به صورت کامل بنویسید..."
      />
      <div className="bg-[#F4F6FA] rounded-xl p-3 flex items-center justify-between mt-2">
        <span className="text-gray-800 text-sm">امتیاز شما</span>
        <Rating
          onChange={(value: number) => {
            setFormData({ ...formData, rating: value });
          }}
          readonly={false}
          emptySymbol={
            <img
              src="/assets/icons/star-outline.svg"
              className="icon mt-1 w-5 lg:w-7 h-5 lg:h-7"
            />
          }
          fullSymbol={
            <img
              src="/assets/icons/star-fill-2.svg"
              className="icon mt-1 w-5 lg:w-7 h-5 lg:h-7"
            />
          }
          initialRating={formData.rating}
        />
      </div>
      <Button
        title={"ثبت دیدگاه"}
        className="mt-6 w-full md:w-fit md:mr-auto md:px-14 sticky bottom-0"
        loading={loading}
        onClick={handleSubmit}
      />
    </Modal>
  );
};

export default AddCommentModal;
