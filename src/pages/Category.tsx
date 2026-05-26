import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Switch,
  Tag,
} from "antd";
import type { Category, CategoryForm } from "../types/Category.type";
import { CategoryService } from "../services/CategoryService";

const Categories = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);

    try {
      const res = await CategoryService.getAll();

      const list =
        res.data?.data?.data ||
        res.data?.data ||
        res.data?.result ||
        [];

      setData(Array.isArray(list) ? list : []);
    } catch (err) {
      console.log(err);
      message.error("Kateqoriyalar yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchCategories);
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({ isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = async (record: Category) => {
    setEditingId(record.id);

    form.setFieldsValue({
      name: record.name,
      description: record.description || "",
      isActive: record.isActive,
    });

    setIsModalOpen(true);

    try {
      const res = await CategoryService.getById(record.id);
      const category = res.data?.data || res.data;

      form.setFieldsValue({
        name: category.name,
        description: category.description || "",
        isActive: category.isActive,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (values: CategoryForm) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || "",
        isActive: values.isActive ?? true,
      };

      if (editingId) {
        await CategoryService.update(editingId, payload);
        message.success("Kateqoriya yeniləndi");
      } else {
        await CategoryService.create(payload);
        message.success("Kateqoriya əlavə olundu");
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.log(err);
      message.error("Əməliyyat uğursuz oldu");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await CategoryService.remove(id);
      message.success("Kateqoriya silindi");
      fetchCategories();
    } catch (err) {
      console.log(err);
      message.error("Kateqoriya silinmədi");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold dark:text-white!">Kateqoriyalar</h2>

        {/* + Yeni Kateqoriya Düyməsi (YAŞIL) */}
        <Button
          type="primary"
          onClick={openCreateModal}
          className="bg-green-600! text-white! border-green-600!
                     hover:bg-green-700! hover:text-white!
                     dark:bg-green-600! dark:text-white!
                     dark:hover:bg-green-500!"
        >
          + Yeni kateqoriya
        </Button>
      </div>

      <Table
        loading={loading}
        dataSource={data}
        rowKey="id"
        style={{ marginTop: 20 }}
        columns={[
          { title: "Ad", dataIndex: "name" },
          {
            title: "Açıqlama",
            dataIndex: "description",
            render: (value) => value || "Açıqlama yoxdur",
          },
          {
            title: "Status",
            dataIndex: "isActive",
            render: (value) =>
              value ? <Tag color="white" className="bg-green-600! text-white! border-green-600!
                     hover:bg-green-700! hover:text-white!
                     dark:bg-green-600! dark:text-white!
                     dark:hover:bg-green-500!">Aktiv</Tag> : <Tag className="bg-green-600! text-white! border-green-600!
                     hover:bg-green-700! hover:text-white!
                     dark:bg-green-600! dark:text-white!
                     dark:hover:bg-green-500!">Passiv</Tag>,
          },
          {
            title: "Məhsul sayı",
            dataIndex: "productsCount",
            render: (value) => value ?? 0,
          },
          {
            title: "Əməliyyatlar",
            render: (_, record) => (
              <div className="flex gap-2">
                {/* Redaktə Et Düyməsi (MAVİ/GÖY) */}
                <Button
                  onClick={() => openEditModal(record)}
                  className="bg-blue-600! text-white! border-blue-600!
                             hover:bg-blue-700! hover:text-white!
                             dark:bg-blue-600! dark:text-white!
                             dark:hover:bg-blue-500!"
                >
                  Redaktə et
                </Button>

                {/* Sil Düyməsi (KIRMIZI - İçi dolu, yazısı ağ) */}
                <Popconfirm
                  title="Silmək istədiyinə əminsən?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Bəli"
                  cancelText="Xeyr"
                >
                  <Button
                    danger
                    className="bg-red-600! text-white! border-red-600!
                               hover:bg-red-700! hover:text-white!
                               dark:bg-red-600! dark:text-white!
                               dark:hover:bg-red-500!"
                  >
                    Sil
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        title={editingId ? "Kateqoriyanı redaktə et" : "Yeni kateqoriya"}
        okText={editingId ? "Yenilə" : "Yarat"}
        cancelText="Bağla"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Kateqoriya adı"
            rules={[{ required: true, message: "Ad yaz" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Açıqlama">
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Aktiv" unCheckedChildren="Passiv" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories;