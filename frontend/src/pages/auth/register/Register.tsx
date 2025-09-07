import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Row,
  Col,
  InputNumber,
  Spin,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
  UserAddOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../../apis/AuthApis";

const { Title, Text } = Typography;

interface RegisterFormValues {
  name: string;
  age: number;
  email: string;
  mobile_number: string;
  address: string;
  citizenship_no: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (data: { message: string }) => {
      console.log("Registration Successful:", data.message);
      messageApi.success("Registration Successful! Please login to continue.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      setLoading(false);
    },
    onError: (error) => {
      messageApi.error(`Registration Failed: ${error}`);
      setLoading(false);
    },
  });

  const onFinish = async (values: RegisterFormValues) => {
    console.log("Register Form Values:", values);
    setLoading(true);

    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };

  const validateConfirmPassword = ({
    getFieldValue,
  }: {
    getFieldValue: (field: string) => string;
  }) => ({
    validator(_: unknown, value: string) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("The two passwords do not match!"));
    },
  });

  const validateAge = (_: unknown, value: number) => {
    if (value && (value < 18 || value > 120)) {
      return Promise.reject(new Error("Age must be between 18 and 120 years!"));
    }
    return Promise.resolve();
  };

  return (
    <Spin spinning={loading}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
        {/* Left Side - Image Section */}
        {contextHolder}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br max-h-screen from-green-600 to-blue-800 relative">
          <div className="flex flex-col justify-center items-center p-12 text-white">
            {/* Decorative Image/Illustration */}
            <div className="mb-8">
              <div className="w-80 h-80 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-64 h-64 bg-white/30 rounded-full flex items-center justify-center">
                  <img
                    src="/voting-demo.svg"
                    alt="Voting System Demo"
                    className="w-48 h-48 object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-center max-w-md">
              <Title
                style={{ color: "white" }}
                level={2}
                className="mb-4 text-4xl font-bold"
              >
                Join Democracy
              </Title>
              <span className="text-blue-100 text-sm leading-relaxed">
                Register to become a part of our democratic process. Your voice
                matters, and every vote counts towards building a better future.
              </span>
            </div>

            {/* Features List */}
            <div className="mt-12 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">Secure Registration Process</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">
                  Protected Personal Information
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">✓</span>
                </div>
                <span className="text-white">Easy Voting Access</span>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/3 right-20 w-16 h-16 bg-green-400/30 rounded-full"></div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex  items-center justify-center p-4">
          <div className="w-full max-w-2xl h-[95vh] overflow-y-auto  px-6">
            {/* Header Section */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center mb-4">
                <div className="w-20 h-20 bg-green-500   rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <UserAddOutlined className="text-white text-3xl" />
                </div>
              </div>
              <Title
                level={1}
                className="text-gray-800 mb-2 text-3xl font-bold"
              >
                Voter Registration
              </Title>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <Text className="text-blue-700 text-sm font-medium">
                    🔒 Your information is secure and confidential
                  </Text>
                  <br />
                  <Text className="text-blue-600 text-xs">
                    We protect your personal data with advanced encryption
                  </Text>
                </div>
              </div>
            </div>

            {/* Register Form Card */}
            <Card className="shadow-xl border-0 rounded-2xl backdrop-blur-sm bg-white/90">
              <div className="mb-6 text-center">
                <Title level={3} className="text-gray-800 mb-2">
                  Create Your Account
                </Title>
                <Text className="text-gray-500">
                  Please fill in all the required information
                </Text>
              </div>

              <Form
                form={form}
                name="register"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                scrollToFirstError
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      label={
                        <span className="text-gray-700 font-semibold">
                          Full Name
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your full name!",
                        },
                        {
                          min: 2,
                          message: "Name must be at least 2 characters!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined className="text-gray-400" />}
                        placeholder="Enter your full name"
                        className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="age"
                      label={
                        <span className="text-gray-700 font-semibold">Age</span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your age!",
                        },
                        {
                          validator: validateAge,
                        },
                      ]}
                    >
                      <InputNumber
                        prefix={<CalendarOutlined className="text-gray-400" />}
                        placeholder="Enter your age"
                        className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500 w-[50px]"
                        min={18}
                        max={120}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label={
                        <span className="text-gray-700 font-semibold">
                          Email Address
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your email address!",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email address!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined className="text-gray-400" />}
                        placeholder="Enter your email address"
                        className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="mobile_number"
                      label={
                        <span className="text-gray-700 font-semibold">
                          Mobile Number
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your mobile number!",
                        },
                        {
                          pattern: /^[0-9]{10}$/,
                          message:
                            "Please enter a valid 10-digit mobile number!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<PhoneOutlined className="text-gray-400" />}
                        placeholder="Enter your mobile number"
                        className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                        maxLength={10}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="address"
                  label={
                    <span className="text-gray-700 font-semibold">Address</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input your address!",
                    },
                  ]}
                >
                  <Input.TextArea
                    prefix={<HomeOutlined className="text-gray-400" />}
                    placeholder="Enter your complete address"
                    className="rounded-xl border-gray-300 hover:border-blue-400 focus:border-blue-500"
                    rows={3}
                  />
                </Form.Item>

                <Form.Item
                  name="citizenship_no"
                  label={
                    <span className="text-gray-700 font-semibold">
                      Citizenship Number
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please input your citizenship number!",
                    },
                    {
                      pattern: /^[0-9]{12}$/,
                      message:
                        "Please enter a valid 12-digit citizenship number!",
                    },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined className="text-gray-400" />}
                    placeholder="Enter your 12-digit citizenship number"
                    className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                    maxLength={12}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="password"
                      label={
                        <span className="text-gray-700 font-semibold">
                          Password
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        {
                          min: 6,
                          message: "Password must be at least 6 characters!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Enter your password"
                        className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="confirmPassword"
                      label={
                        <span className="text-gray-700 font-semibold">
                          Confirm Password
                        </span>
                      }
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        validateConfirmPassword,
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined className="text-gray-400" />}
                        placeholder="Confirm your password"
                        className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 border-0 font-semibold text-lg hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    icon={<UserAddOutlined />}
                  >
                    {loading ? "Creating Account..." : "Register to Vote"}
                  </Button>
                </Form.Item>
              </Form>

              {/* Login Link */}
              <div className="text-center mt-6 pt-6 border-t border-gray-100">
                <Text className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Sign In Here
                  </Link>
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default Register;
