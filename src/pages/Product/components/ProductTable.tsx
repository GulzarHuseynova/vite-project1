import { Button, Image, Popconfirm, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { ProductItem } from "../../../services/ProductService";
import { FALLBACK_IMG, getProductImages } from "../../../utils/ProductHelpers";

interface PaginationMeta {
    current: number;
    pageSize: number;
    total: number;
}

interface Props {
    products: ProductItem[];
    loading: boolean;
    pagination: PaginationMeta;
    onPageChange: (page: number, pageSize: number) => void;
    onEdit: (product: ProductItem) => void;
    onDelete: (id: string) => void;
}

const ProductTable = ({ products, loading, pagination, onPageChange, onEdit, onDelete }: Props) => {
    const columns: ColumnsType<ProductItem> = [
        {
            title: "Image",
            render: (_, product) => {
                const imgs = getProductImages(product);
                if (!imgs.length) return <span>-</span>;
                return (
                    <Image
                        width={50} height={50}
                        src={imgs[0]}
                        fallback={FALLBACK_IMG}
                        style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                );
            },
        },
        { title: "Ad", dataIndex: "name" },
        { title: "SKU", dataIndex: "sku" },
        { title: "Qiymət", dataIndex: "price", render: (price: number) => `${price} AZN` },
        { title: "Stock", dataIndex: "stock" },
        { title: "Açıqlama", dataIndex: "description" },
        {
            title: "Actions",
            render: (_, product) => (
                <div className="flex gap-2">
                    <Button type="primary" onClick={() => onEdit(product)}>Yenilə</Button>
                    <Popconfirm
                        title="Delete Product"
                        description="Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => onDelete(product.id)}
                    >
                        <Button danger className="bg-red-600! text-white! border-red-600!
                              hover:bg-red-700! hover:text-white! hover:border-red-700!
                              dark:bg-red-600! dark:text-white! dark:border-red-600!
                              dark:hover:bg-red-500! dark:hover:text-white! dark:hover:border-red-500!"
                        >
                            Sil
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={products}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                onChange: onPageChange,
            }}
        />
    );
};

export default ProductTable;