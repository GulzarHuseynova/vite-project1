import { Button } from "antd";
import {
    useEffect,
    useState,
} from "react";
import ProductModal from "./components/ProductModal";
import ProductTable from "./components/ProductTable";
import { useProduct } from "../../hooks/UseProduct";
import type { ProductItem } from "../../services/ProductService";

const Product = () => {
    const [open, setOpen] =
        useState(false);

    const [
        editingProduct,
        setEditingProduct,
    ] =
        useState<ProductItem | null>(
            null,
        );

    const {
        products,
        fetching,
        fetchProducts,
        deleteProduct,
        pagination,
    } = useProduct();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleEdit = (
        product: ProductItem,
    ) => {
        setEditingProduct(
            product,
        );

        setOpen(true);
    };

    const handleClose =
        () => {
            setOpen(false);

            setEditingProduct(
                null,
            );
        };

    return (
        <div className="p-6">
            <div className="flex justify-between mb-5">
                <h1 className="text-2xl font-bold">
                    MƏHSULLAR
                </h1>

                <Button
                    type="primary"
                    onClick={() =>
                        setOpen(true)
                    }
                >
                    Məhsul əlavə et
                </Button>
            </div>

            <ProductTable
                products={products}
                loading={fetching}
                pagination={pagination}
                onPageChange={fetchProducts}
                onEdit={
                    handleEdit
                }
                onDelete={
                    deleteProduct
                }
            />

            <ProductModal
                open={open}
                onClose={
                    handleClose
                }
                onSuccess={
                    fetchProducts
                }
                editingProduct={
                    editingProduct
                }
            />
        </div>
    );
};

export default Product;