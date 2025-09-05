import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Statistic,
  Badge,
  Avatar,
  Progress,
  Row,
  Col,
  Typography,
  Space,
  Tag,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
  CalendarOutlined,
  LockOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  ArrowRightOutlined,
  LoginOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

interface Election {
  id: number;
  title: string;
  description: string;
  endDate: string;
  totalVotes: number;
  status: "active" | "completed";
  timeLeft: string;
  candidates: number;
}

interface User {
  name: string;
  hasVoted: boolean;
  avatar: string;
}

interface AuthStore {
  isLoggedIn: boolean;
}

const Home = () => {
  const { isLoggedIn } = useAuthStore() as AuthStore;
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeElections, setActiveElections] = useState<Election[]>([
    {
      id: 1,
      title: "Student Government President",
      description:
        "Choose the next student body president for the 2025-2026 academic year",
      endDate: "2025-09-15",
      totalVotes: 1247,
      status: "active",
      timeLeft: "7 days left",
      candidates: 4,
    },
    {
      id: 2,
      title: "Campus Safety Committee",
      description:
        "Select representatives for the campus safety advisory committee",
      endDate: "2025-09-20",
      totalVotes: 892,
      status: "active",
      timeLeft: "7 days left",
      candidates: 6,
    },
  ]);

  const stats = {
    totalElections: 12,
    activeElections: 2,
    totalVoters: 15420,
    participationRate: 73,
  };

  // Simulate user login state
  useEffect(() => {
    setCurrentUser({
      name: "Alex Johnson",
      hasVoted: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div
        className="relative overflow-hidden h-[90vh]  text-white"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-6  bg-opacity-20 rounded-full backdrop-blur-sm">
                <TrophyOutlined className="text-6xl" />
              </div>
            </div>

            <Title level={1} className="!text-white !text-5xl !font-bold !mb-6">
              Your Voice, Your Vote
            </Title>

            <Paragraph className="!text-xl !text-white !mb-8 max-w-3xl mx-auto">
              Participate in secure, transparent, and accessible democratic
              processes. Every vote counts, every voice matters.
            </Paragraph>

            {isLoggedIn ? (
              <Card className="max-w-md mx-auto bg-white bg-opacity-20 backdrop-blur-sm border-0">
                <Space
                  direction="vertical"
                  size="middle"
                  className="w-full text-center"
                >
                  <Space>
                    <Avatar
                      size="large"
                      src={currentUser?.avatar}
                      icon={<UserOutlined />}
                    />
                    <Text className="!text-white !text-lg !font-semibold">
                      Welcome back, {currentUser?.name}
                    </Text>
                  </Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ArrowRightOutlined />}
                    className="w-full bg-white text-blue-600 border-0 hover:!bg-blue-50"
                  >
                    View My Ballot
                  </Button>
                </Space>
              </Card>
            ) : (
              <Space size="large">
                <Button
                  type="primary"
                  size="large"
                  icon={<LoginOutlined />}
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Sign In to Vote
                </Button>
              </Space>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <Row gutter={[32, 32]}>
            <Col xs={12} md={6}>
              <Card
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                bordered={false}
              >
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TrophyOutlined className="text-2xl text-blue-600" />
                </div>
                <Statistic
                  value={stats.totalElections}
                  title="Total Elections"
                  valueStyle={{
                    color: "#1f2937",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                bordered={false}
              >
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircleOutlined className="text-2xl text-green-600" />
                </div>
                <Statistic
                  value={stats.activeElections}
                  title="Active Elections"
                  valueStyle={{
                    color: "#1f2937",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                bordered={false}
              >
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <TeamOutlined className="text-2xl text-purple-600" />
                </div>
                <Statistic
                  value={stats.totalVoters}
                  title="Registered Voters"
                  valueStyle={{
                    color: "#1f2937",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <RiseOutlined className="text-2xl text-orange-600" />
                </div>
                <Statistic
                  value={stats.participationRate}
                  suffix="%"
                  title="Participation Rate"
                  valueStyle={{
                    color: "#1f2937",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Active Elections */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Title level={2} className="!text-4xl !mb-4">
              Active Elections
            </Title>
            <Paragraph className="!text-xl !text-gray-600 max-w-2xl mx-auto">
              Cast your vote in ongoing elections. Your participation shapes our
              community's future.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {activeElections.map((election) => (
              <Col key={election.id} xs={24} lg={12}>
                <Card
                  className="hover:shadow-xl transition-all duration-300"
                  title={
                    <Space className="w-full justify-between">
                      <Text className="text-xl font-bold">
                        {election.title}
                      </Text>
                      <Badge status="processing" text="Active" />
                    </Space>
                  }
                  extra={
                    <Tag color="green" icon={<CheckCircleOutlined />}>
                      Live
                    </Tag>
                  }
                >
                  <Space direction="vertical" size="middle" className="w-full">
                    <Paragraph className="text-gray-600 mb-4">
                      {election.description}
                    </Paragraph>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Space>
                          <CalendarOutlined className="text-gray-500" />
                          <Text type="secondary">{election.timeLeft}</Text>
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Space>
                          <TeamOutlined className="text-gray-500" />
                          <Text type="secondary">
                            {election.totalVotes.toLocaleString()} votes
                          </Text>
                        </Space>
                      </Col>
                    </Row>

                    <Space className="w-full" size="middle">
                      <Button
                        type="primary"
                        size="large"
                        icon={<TrophyOutlined />}
                        className="flex-1"
                      >
                        Vote Now
                      </Button>
                      <Button size="large" icon={<InfoCircleOutlined />}>
                        Details
                      </Button>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Title level={2} className="!text-4xl !mb-4">
              Why Choose Our Platform?
            </Title>
            <Paragraph className="!text-xl !text-gray-600 max-w-2xl mx-auto">
              Built with security, accessibility, and transparency at its core
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card
                className="text-center h-full hover:bg-blue-50 transition-all duration-300 border-0 shadow-sm"
                bodyStyle={{ padding: "2rem" }}
              >
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <LockOutlined className="text-2xl text-blue-600" />
                </div>
                <Title level={3} className="!text-2xl !mb-4">
                  Secure & Private
                </Title>
                <Paragraph className="text-gray-600">
                  End-to-end encryption ensures your vote remains private while
                  maintaining complete audit trails for transparency.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="text-center h-full hover:bg-green-50 transition-all duration-300 border-0 shadow-sm"
                bodyStyle={{ padding: "2rem" }}
              >
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <GlobalOutlined className="text-2xl text-green-600" />
                </div>
                <Title level={3} className="!text-2xl !mb-4">
                  Accessible to All
                </Title>
                <Paragraph className="text-gray-600">
                  Designed with accessibility in mind, supporting multiple
                  languages, screen readers, and various assistive technologies.
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                className="text-center h-full hover:bg-purple-50 transition-all duration-300 border-0 shadow-sm"
                bodyStyle={{ padding: "2rem" }}
              >
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <ThunderboltOutlined className="text-2xl text-purple-600" />
                </div>
                <Title level={3} className="!text-2xl !mb-4">
                  Real-time Results
                </Title>
                <Paragraph className="text-gray-600">
                  Get instant updates on election progress and results with
                  real-time data visualization and notifications.
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Title level={2} className="!text-white !text-4xl !mb-6">
            Ready to Make Your Voice Heard?
          </Title>
          <Paragraph className="!text-xl !text-white !mb-8">
            Join thousands of citizens participating in secure, transparent
            democratic processes.
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<UserOutlined />}
              className="bg-white text-blue-600 border-0 hover:!bg-blue-50 px-8 py-6 h-auto"
            >
              Register to Vote
            </Button>
            <Button
              size="large"
              icon={<CalendarOutlined />}
              className="border-2 border-white text-white hover:!bg-white hover:!text-blue-600 px-8 py-6 h-auto"
            >
              View Election Calendar
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Home;
