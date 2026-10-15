import { Product, userProductService } from "@/services/user/product.service";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Button from "../Button";
import { imageBaseUrl } from "@/utils/constants";
import Link from "next/link";

const Modal = dynamic(() => import("../../shared/Modal/Modal"), {
  ssr: false,
});

interface SearchModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: (user: any) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  open,
  setOpen,
  onSuccess,
}) => {
  const [search, setSearch] = useState("");

  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
    }
  }, [open]);

  const handleSearch = useCallback(async () => {
    if (search.length < 3) {
      setSearchResults([]);
      return;
    }
    const response = await userProductService.searchProducts(search, 50);
    setSearchResults(response.data);
  }, [search]);

  useEffect(() => {
    handleSearch();
  }, [search]);

  return (
    <Modal
      className="w-screen h-screen !max-w-[100vw] !max-h-[100vh]"
      headerClassName="!mb-0"
      open={open}
      setOpen={setOpen}
      title={
        <h3 className="text-base md:text-xl font-bold font-noora">
          جستجوی محصولات
        </h3>
      }
      subTitle={""}
    >
      <div className="w-full h-full relative">
        <div className="flex items-center gap-2 sticky top-[81px] z-10 bg-white py-4 border-b border-b-stroke">
          <input
            type="text"
            className="w-full h-12 rounded-xl border-none outline-none px-4 text-sm bg-[#F4F6FA]"
            placeholder="جستجو ..."
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            ref={inputRef}
          />
          <Button title="جستجو" onClick={handleSearch} className="!h-12" />
        </div>
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {searchResults.map((result) => (
              <div
                onClick={() => {
                  setSearch("");
                  setSearchResults([]);
                  setOpen(false);
                  window.location.href = `/products/${result.slug}`;
                }}
                key={result.id}
                className="p-4 border border-stroke rounded-xl flex items-center gap-4 cursor-pointer"
              >
                <Image
                  src={`${imageBaseUrl}/${
                    result.images.find((img) => img.isThumbnail)?.file.name
                  }`}
                  alt={result.name}
                  width={64}
                  height={64}
                />
                <h4 className="leading-6 text-sm font-peydaEn font-medium">
                  {result.name}
                </h4>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default SearchModal;
