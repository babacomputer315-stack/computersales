import commentService from "@/services/user/comment.service";
import { ProductComment } from "@/types/productComment";
import { convertToJalali } from "@/utils/convertToJalali";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useState } from "react";
const Rating = dynamic(
  () => import("react-rating").then((m) => (m as any).default),
  { ssr: false }
) as any;

const ProductsComments = ({ productId }: { productId: number }) => {
  const [comments, setComments] = useState<ProductComment[]>([]);

  const getComments = async () => {
    try {
      const response = await commentService.getProductComments(productId);
      setComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getComments();
  }, [productId]);

  if (comments.length === 0) {
    return (
      <div className="text-center text-sm text-secondary-text">
        هیچ دیدگاهی ثبت نشده است
      </div>
    );
  }
  return (
    <div>
      {comments.map((comment, index) => (
        <div key={comment.id} className="pt-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center bg-stroke">
              <Image
                src="/assets/icons/user2.svg"
                alt="product-reviews"
                width={28}
                height={28}
              />
            </div>
            <div
              className={`flex-1 pb-8 border-b border-stroke ${
                index === comments.length - 1 ? "border-b-0 pb-0" : ""
              }`}
            >
              <div className="flex items-center justify-between flex-col lg:flex-row">
                <div className="flex items-center gap-4 justify-between w-full lg:w-auto lg:justify-start">
                  <span className="font-semibold text-base">
                    {comment?.author?.name}
                  </span>
                  <span className="text-sm text-secondary-text">
                    {convertToJalali(comment?.createdAt)}
                  </span>
                </div>
                <Rating
                  readonly={true}
                  emptySymbol={
                    <img
                      src="/assets/icons/star-outline.svg"
                      className="icon mt-1 w-5 h-5"
                    />
                  }
                  fullSymbol={
                    <img
                      src="/assets/icons/star-fill-2.svg"
                      className="icon mt-1 w-5 h-5"
                    />
                  }
                  initialRating={comment?.rating}
                />
              </div>
              <div className="text-sm mt-2 leading-8">{comment?.content}</div>
              {comment.answer && (
                <div className="bg-[#F4F6FA] rounded-xl p-3 mt-4 text-sm leading-8 font-medium">
                  {comment.answer}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsComments;
