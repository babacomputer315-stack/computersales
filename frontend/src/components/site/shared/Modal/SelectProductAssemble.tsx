import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { Product, userProductService } from "@/services/user/product.service";
import Image from "next/image";
import { imageBaseUrl } from "@/utils/constants";
import { formatNumber } from "@/utils/formatNumber";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import Button from "../Button";

const SelectProductAssembleModal = ({
  open,
  setOpen,
  categoryId,
  onSelectProduct,
  motherboardOptionId,
  ramOptionId,
  fanOptionId,
  graphicsCardOptionIds,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  categoryId: number;
  onSelectProduct: (product: Product) => void;
  motherboardOptionId: number | null;
  ramOptionId: number | null;
  fanOptionId: number | null;
  graphicsCardOptionIds: number[];
}) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [showSpecificationModal, setShowSpecificationModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setProducts([]);
    let specificationOptionIds: number[] | undefined = undefined;
    if (!categoryId) return;
    if (categoryId === 38) {
      specificationOptionIds = motherboardOptionId
        ? [motherboardOptionId]
        : undefined;
    }
    if (categoryId === 41) {
      specificationOptionIds = ramOptionId ? [ramOptionId] : undefined;
    }
    if (categoryId === 44) {
      specificationOptionIds = fanOptionId ? [fanOptionId] : undefined;
    }
    if (categoryId === 40) {
      specificationOptionIds =
        graphicsCardOptionIds.length > 0 ? graphicsCardOptionIds : undefined;
    }
    try {
      const response = await userProductService.getProducts({
        categoryId: categoryId,
        name: search,
        limit: 100,
        minPrice: 1000,
        withSpecifications: true,
        specificationOptionIds: specificationOptionIds,
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [search, categoryId]);

  return (
    <>
      <Modal
        open={open}
        setOpen={setOpen}
        headerClassName="!mb-0"
        className="lg:max-w-3xl"
        title="انتخاب کالا"
      >
        <div className="min-h-[85vh]">
          <div className="sticky top-20 z-10 bg-white py-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی کالا"
              className="w-full h-12 px-3 rounded-lg text-sm text-right  bg-[#F4F6FA] outline-none"
            />
          </div>
          {loading ? (
            <div className="site">
              <div className="lg:container lg:mx-auto">
                <div className="flex items-center justify-center min-h-[70vh]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {products?.map((product) => (
                <div key={product.id}>
                  <div className="border border-stroke rounded-xl overflow-hidden flex p-4 gap-2 pr-0">
                    <Image
                      src={`${imageBaseUrl}/${
                        product.images?.find((image) => image.isThumbnail)?.file
                          ?.name
                      }`}
                      alt={product.name}
                      width={100}
                      height={100}
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <h3 className="text-xs font-peydaEn font-medium leading-6">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            onClick={() => {
                              setOpen(false);
                              onSelectProduct(product);
                            }}
                            className="bg-primary text-white text-xs font-medium h-8 px-4 flex items-center justify-center rounded-lg cursor-pointer"
                          >
                            افزودن
                          </div>
                          <div
                            onClick={() => {
                              setShowSpecificationModal(true);
                              setSelectedProduct(product);
                            }}
                            className="bg-[#E6ECF3] text-secondary-900 text-xs font-medium h-8 px-4 flex items-center justify-center rounded-lg cursor-pointer"
                          >
                            <span className="hidden lg:inline ml-1">
                              مشاهده
                            </span>{" "}
                            مشخصات
                          </div>
                        </div>
                        <div className="text-xs">
                          {product.salePrice ? (
                            <>
                              <span className="font-semibold">
                                {formatNumber(product.salePrice)}
                              </span>
                              <span className="text-gray-500 mr-1">تومان</span>
                            </>
                          ) : product.regularPrice ? (
                            <>
                              <span className="font-semibold">
                                {formatNumber(product.regularPrice)}
                              </span>
                              <span className="text-gray-500 mr-1">تومان</span>
                            </>
                          ) : (
                            "تماس بگیرید"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
      <Modal
        className="z-50"
        title="مشخصات محصول"
        open={showSpecificationModal}
        setOpen={setShowSpecificationModal}
      >
        <h2 className="text-sm font-semibold leading-6">
          {selectedProduct?.name}
        </h2>
        <div className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
            {selectedProduct?.specifications
              ?.filter(
                (spec) =>
                  spec?.specification.type === "select" ||
                  spec?.specification.type === "multi_select"
              )
              .map((spec, i) => (
                <div
                  key={i}
                  className="border-1.5 border-stroke rounded-lg p-3 flex flex-col gap-2"
                >
                  <span className="text-secondary-text text-sm line-clamp-1">
                    {spec.specification.name}
                  </span>
                  <span className="text-sm font-medium">
                    {spec.specification.type === "text"
                      ? spec.value
                      : spec.specification.type === "multi_select"
                      ? spec?.selectedOptions
                          ?.map((option) => option?.option?.label)
                          .join(", ")
                      : spec?.option?.value}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 sticky bottom-0 bg-white">
          <Button
            className="flex-1"
            title="افزودن"
            onClick={() => {
              setOpen(false);
              setShowSpecificationModal(false);
              if (selectedProduct) {
                onSelectProduct(selectedProduct);
              }
            }}
          />
          <Button
            className="flex-1"
            variant="secondary"
            title="بستن"
            onClick={() => setShowSpecificationModal(false)}
          />
        </div>
      </Modal>
    </>
  );
};

export default SelectProductAssembleModal;
