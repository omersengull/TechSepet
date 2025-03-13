import { Rating } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";
import priceClip from "../utils/priceClip";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  productImage: string;
  productName: string;
  productDescription: string;
  price: number | string;
  reviews: { content: string; rating: number; createdAt: string }[];
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
  productImage,
  productName,
  productDescription,
  price,
  reviews
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] min-h-[500px] max-w-4xl relative">
        {/* Kapatma Butonu */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl"
        >
          ✖
        </button>

        {/* Modal İçeriği */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ürün Görseli */}
          <div className="flex items-center justify-center">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-auto object-cover rounded-md"
            />
          </div>

          {/* Ürün Bilgileri */}
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{productName}</h2>
            <p className="mt-2 text-gray-700">{productDescription}</p>
            <p className="mt-4 font-semibold text-xl">{priceClip(price)} TL</p>

            {/* Yorumlar */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Yorumlar</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {reviews && reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <div key={index} className="border border-gray-200 rounded p-3 shadow-sm">
                      <p className="text-gray-800 text-sm font-medium">{review.content}</p>
                      <Rating  name="read-only"
                        value={review.rating}
                        precision={0.5}
                        className="dark:text-white"
                        readOnly
                        size="small" />
                      <p className="text-gray-400 text-xs">
                        Tarih: {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Henüz yorum bulunmamaktadır.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body // Modal'ı body içine render et
  );
};

export default Modal;
