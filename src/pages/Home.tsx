import { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Table, Image } from "antd";
import { DashboardService } from "../services/DashboardService";
import type {
  DashboardStats,
  LatestProduct,
} from "../types/Dashboard.type";
import {
  FALLBACK_IMG,
  getProductImages,
} from "../utils/ProductHelpers";

const Home = () => {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response =
          await DashboardService.getStats();

        setStats(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const columns = [
    {
      title: "Şəkil",
      key: "image",
      render: (
        _: unknown,
        record: LatestProduct
      ) => {
       const images =
    getProductImages(
        record,
    );

        return (
          <Image
            width={60}
            height={60}
            src={
              images[0] ||
              FALLBACK_IMG
            }
            fallback={
              FALLBACK_IMG
            }
            style={{
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        );
      },
    },
    {
      title: "Məhsul Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Qiymət",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stok",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Kategoriya",
      key: "category",
      render: (
        _: unknown,
        record: LatestProduct
      ) => record.category?.name,
    },
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card title="Ümumi İstifadəçilər">
            {stats?.totalUsers}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Təsdiqlənmiş İstifadəçilər">
            {stats?.verifiedUsers}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Ümumi Məhsullar">
            {stats?.totalProducts}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Ümumi Kategoriyalar">
            {stats?.totalCategories}
          </Card>
        </Col>
      </Row>

      <Card
        title="Latest Products"
        style={{ marginTop: 20 }}
      >
        <Table
          columns={columns}
          dataSource={stats?.latestProducts}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Home;