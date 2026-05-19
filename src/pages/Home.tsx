import { useEffect, useState } from "react";
import { Card, Col, Row, Spin, Table, Image } from "antd";
import { DashboardService } from "../services/DashboardService";
import type {
  DashboardStats,
  LatestProduct,
} from "../types/Dashboard.type";

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
      title: "Image",
      dataIndex: "imageUrl",
      key: "image",
      render: (image: string) => (
        <Image width={60} src={image} />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Category",
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
          <Card title="Total Users">
            {stats?.totalUsers}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Verified Users">
            {stats?.verifiedUsers}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Total Products">
            {stats?.totalProducts}
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Total Categories">
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