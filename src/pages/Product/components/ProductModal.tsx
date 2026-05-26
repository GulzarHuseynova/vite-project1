import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Select,
    Switch,
} from "antd";

import {
    useEffect,
    useState,
} from "react";

import axiosInstance from "../../../services/AxiosInstance";

import {
    ProductService,
} from "../../../services/ProductService";

import { UploadService } from "../../../services/UploadService";

import ProductImageUpload from "./ProductImageUpload";
import type { ProductFormValues, Props } from '../../../types/Product.type';
import type { CategoryOption , RawCategory } from '../../../types/Category.type';

const ProductModal = ({
    open,
    onClose,
    onSuccess,
    editingProduct,
}: Props) => {
    const [loading, setLoading] =
        useState(false);

    const [images, setImages] =
        useState<File[]>([]);

    const [categories, setCategories] =
        useState<CategoryOption[]>(
            [],
        );

    const [form] =
        Form.useForm<ProductFormValues>();

    const fetchCategories = () => {
        axiosInstance
            .get(
                "/categories/options",
            )
            .then((res) => {
                const raw =
                    Array.isArray(
                        res.data,
                    )
                        ? res.data
                        : res.data
                            ?.data ||
                        [];

                const options =
                    raw.map(
                        (
                            cat: RawCategory,
                        ) => ({
                            value: String(
                                cat.value ||
                                cat.id,
                            ),
                            label: String(
                                cat.label ||
                                cat.name,
                            ),
                        }),
                    );

                setCategories(
                    options,
                );
            })
            .catch((error) => {
                console.error(
                    error,
                );

                message.error(
                    "Categories load failed",
                );
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);
  useEffect(() => {
    if (!open) return;           // ← modal bağlıdırsa heç nə etmə
    if (editingProduct) {
        form.setFieldsValue({
            name: editingProduct.name,
            sku: editingProduct.sku,
            description: editingProduct.description,
            price: editingProduct.price,
            stock: editingProduct.stock || 0,
            categoryId: editingProduct.categoryId,
        });
    } else {
        form.resetFields();
    }
}, [open, editingProduct, form]);  // ← open əlavə edildi

    const onFinish =
        async (
            values: ProductFormValues,
        ) => {
            try {
                setLoading(
                    true,
                );

                let imageUrls:
                    string[] =
                    [];

                if (
                    images.length >
                    0
                ) {
                    const upload =
                        await UploadService.uploadProductImages(
                            images,
                        );

                    imageUrls =
                        upload.urls;
                }

                const payload =
                {
                    name: values.name,
                    sku: values.sku,
                    description:
                        values.description,
                    price:
                        Number(
                            values.price,
                        ),
                    stock:
                        Number(
                            values.stock ||
                            0,
                        ),
                    categoryId:
                        values.categoryId,
                    isActive:
                        values.isActive ??
                        true,
                    images:
                        imageUrls.map(
                            (
                                url,
                                index,
                            ) => ({
                                url,
                                sortOrder:
                                    index,
                                isMain:
                                    index ===
                                    0,
                            }),
                        ),
                };

                if (
                    editingProduct
                ) {
                    await ProductService.update(
                        editingProduct.id,
                        payload,
                    );

                    message.success(
                        "Product updated",
                    );
                } else {
                    await ProductService.create(
                        payload,
                    );

                    message.success(
                        "Product created",
                    );
                }

                form.resetFields();

                setImages(
                    [],
                );

                onClose();

                await onSuccess();
            } catch (
            error
            ) {
                console.error(
                    error,
                );

                message.error(
                    editingProduct
                        ? "Update failed"
                        : "Create failed",
                );
            } finally {
                setLoading(
                    false,
                );
            }
        };

    return (
        <Modal
            open={open}
            onCancel={
                onClose
            }
            footer={null}
            title={
                editingProduct
                    ? "Edit Product"
                    : "Create Product"
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={
                    onFinish
                }
                initialValues={{
                    stock: 0,
                    isActive: true,
                }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message:
                                "Ad yazılmalıdır",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="SKU"
                    name="sku"
                    rules={[
                        {
                            required: true,
                            message:
                                "SKU yazılmalıdır",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message:
                                "Category is required",
                        },
                    ]}
                >
                    <Select
                        options={
                            categories
                        }
                        placeholder="Select category"
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input.TextArea
                        rows={4}
                    />
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message:
                                "Price is required",
                        },
                    ]}
                >
                    <InputNumber className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Stock"
                    name="stock"
                >
                    <InputNumber className="w-full" />
                </Form.Item>

                <Form.Item
                    label="Active"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item label="Images">
                    <ProductImageUpload
                        setImages={
                            setImages
                        }
                    />
                </Form.Item>

                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={
                        loading
                    }
                >
                    {editingProduct
                        ? "Update"
                        : "Create"}
                </Button>
            </Form>
        </Modal>
    );
};

export default ProductModal;