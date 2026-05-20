import {
    Button,
    Form,
    Image,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Switch,
    Table,
    Upload,
} from "antd";
import type { UploadFile } from "antd";
import { useEffect, useState } from "react";

import { ProductService } from "../services/ProductService";
import type { ProductItem } from "../services/ProductService";
import { UploadService } from "../services/UploadService";
import axiosInstance from "../services/AxiosInstance";
import { resolveImageUrl } from "../utils/ImageUrl";

interface ProductFormValues {
    name: string;
    sku: string;
    description?: string;
    price: number;
    stock?: number;
    categoryId: string;
    isActive?: boolean;
}

interface CategoryOption {
    label: string;
    value: string;
}

interface RawCategory {
    id?: string;
    value?: string;
    name?: string;
    label?: string;
}

const getProductImages = (product: ProductItem): string[] => {
    if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images
            .map((img) => {
                if (img && typeof img === "object" && typeof img.url === "string" && img.url.trim() !== "") {
                    return resolveImageUrl(img.url);
                }
                return null;
            })
            .filter((url): url is string => url !== null && url !== "");
    }

    if (typeof product.imageUrl === "string" && product.imageUrl.trim() !== "") {
        return [resolveImageUrl(product.imageUrl)];
    }

    return [];
};

const getArray = <T,>(response: unknown): T[] => {
    if (Array.isArray(response)) return response as T[];

    if (response && typeof response === "object") {
        const obj = response as {
            data?: unknown;
            items?: unknown;
        };

        if (Array.isArray(obj.data)) return obj.data as T[];
        if (Array.isArray(obj.items)) return obj.items as T[];

        if (obj.data && typeof obj.data === "object") {
            const nested = obj.data as { items?: unknown };
            if (Array.isArray(nested.items)) return nested.items as T[];
        }
    }

    return [];
};

const FALLBACK_IMG =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAAI0lEQVRoge3BMQEAAADCoPVP7WsIoAAAAAAAAAAAAAAAeAMBxAAALJqiagAAAABJRU5ErkJggg==";

const Product = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [categories, setCategories] = useState<CategoryOption[]>([]);

    const [form] = Form.useForm<ProductFormValues>();

    const fetchProducts = async () => {
        try {
            setFetching(true);
            const res = await ProductService.getAll();
            setProducts(getArray<ProductItem>(res));
        } catch (error: unknown) {
            console.error(error);
            message.error("Products load failed");
        } finally {
            setFetching(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/categories/options");

            const raw = getArray<RawCategory>(res.data);

            const options: CategoryOption[] = raw.map((cat) => ({
                value: String(cat.value || cat.id),
                label: String(cat.label || cat.name),
            }));

            setCategories(options);
        } catch (error: unknown) {
            console.error(error);
            message.error("Categories load failed");
        }
    };

    useEffect(() => {
        const load = async () => {
            await Promise.all([fetchProducts(), fetchCategories()]);
        };

        load();
    }, []);

    const resetModal = () => {
        form.resetFields();
        setImages([]);
        setOpen(false);
    };

    const onFinish = async (values: ProductFormValues) => {
        try {
            setLoading(true);

            let imageUrls: string[] = [];

            if (images.length > 0) {
                try {
                    const upload = await UploadService.uploadProductImages(images);
                    imageUrls = upload.urls;
                } catch (error: unknown) {
                    console.error(error);
                    message.error("Image upload failed");
                    return;
                }
            }

            await ProductService.create({
                name: values.name,
                sku: values.sku,
                description: values.description,
                price: Number(values.price),
                stock: Number(values.stock || 0),
                categoryId: values.categoryId,
                isActive: values.isActive ?? true,
                images: imageUrls.map((url, index) => ({
                    url,
                    sortOrder: index,
                    isMain: index === 0,
                })),
            });

            message.success("Product created");
            resetModal();
            await fetchProducts();
        } catch (error: unknown) {
            console.error(error);
            message.error("Product create failed");
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (file: File) => {
        const isValidType = ["image/jpeg", "image/png", "image/webp"].includes(file.type);

        if (!isValidType) {
            message.error("Only JPG, PNG, WEBP allowed");
            return Upload.LIST_IGNORE;
        }

        if (file.size > 5 * 1024 * 1024) {
            message.error("Max 5MB");
            return Upload.LIST_IGNORE;
        }

        setImages((prev) => [...prev, file]);
        return false;
    };

    const columns = [
        {
            title: "Image",
            render: (_: unknown, product: ProductItem) => {
                const imgs = getProductImages(product);
                if (imgs.length === 0) return <span>-</span>;
                return (
                    <Image
                        width={50}
                        height={50}
                        src={imgs[0]}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        fallback={FALLBACK_IMG}
                    />
                );
            },
        },
        { title: "Name", dataIndex: "name" },
        { title: "SKU", dataIndex: "sku" },
        {
            title: "Price",
            dataIndex: "price",
            render: (p: number) => `${p} AZN`,
        },
        { title: "Stock", dataIndex: "stock" },
        { title: "Description", dataIndex: "description" },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between mb-5">
                <h1 className="text-2xl font-bold">Products</h1>

                <Button type="primary" onClick={() => setOpen(true)}>
                    Add Product
                </Button>
            </div>

            <Table
                loading={fetching}
                dataSource={products}
                columns={columns}
                rowKey={(r) => r.id}
            />

            <Modal open={open} onCancel={resetModal} footer={null} title="Create Product">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{ stock: 0, isActive: true }}
                >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                        <Select options={categories} />
                    </Form.Item>

                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item name="stock" label="Stock">
                        <InputNumber className="w-full" />
                    </Form.Item>

                    <Form.Item name="isActive" label="Active" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <Form.Item label="Images">
                        <Upload
                            multiple
                            listType="picture-card"
                            beforeUpload={handleImageUpload}
                            onRemove={(file: UploadFile) => {
                                setImages((prev) =>
                                    prev.filter((f) => f.name !== file.name),
                                );
                                return true;
                            }}
                        >
                            Upload
                        </Upload>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Create
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default Product;