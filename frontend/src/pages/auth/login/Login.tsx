import React, { use, useState } from "react";
import { Form, Input, Button, Card, Typography, message, Checkbox } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const { Title, Text } = Typography;

interface LoginFormValues {
  citizanship_no: string;
  password: string;
}


const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data: { token: string }) => {
     
        message.success("Login Successful!");
        setToken(data.token);
        Navigate("/");

     
      setLoading(false);
    },
    onError: (error) => {
      api.error({
        message: "Login failed",
        description: error || "Invalid credentials",
        duration: 5,
        showProgress: true,
      });
      setLoading(false);
    },
  });

  const onFinish = async (values: LoginFormValues) => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 relative">
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
              className=" mb-4 text-4xl font-bold"
            >
              Democracy in Action
            </Title>
            <span className="text-blue-100 text-sm leading-relaxed">
              Every vote matters. Join millions of citizens in shaping the
              future of our nation through secure, transparent, and reliable
              electronic voting.
            </span>
          </div>

          {/* Features List */}
          <div className="mt-12 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-white">Secure & Encrypted Voting</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-white">Real-time Results</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <span className="text-white">Verified Identity Protection</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 bg-blue-400/30 rounded-full"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-2">
            <div className="flex justify-center items-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto  shadow-lg">
                <LoginOutlined className="text-white text-3xl" />
              </div>
              <Title
                level={1}
                className="text-gray-800 mb-2 text-3xl font-bold"
              >
                Voting System
              </Title>
            </div>
            {/* Security Notice */}
            <div className="mt-8 text-center">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Text className="text-green-700 text-sm font-medium">
                  🔒 Your vote is secure and confidential
                </Text>
                <br />
                <Text className="text-green-600 text-xs">
                  We use advanced encryption to protect your privacy
                </Text>
              </div>
            </div>
          </div>

          {/* Login Form Card */}
          <Card className="shadow-xl border-0 rounded-2xl backdrop-blur-sm bg-white/90">
            <div className="mb-6 text-center">
              <Title level={3} className="text-gray-800 mb-2">
                Welcome Back
              </Title>
              <Text className="text-gray-500">
                Please sign in to your account
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="aadharCardNumber"
                label={
                  <span className="text-gray-700 font-semibold">
                    Nagarikta Number
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "Please input your Nagarikta Number!",
                  },
                  {
                    pattern: /^\d{12}$/,
                    message: "Nagarikta Number must be 12 digits!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Enter your 12-digit Aadhar number"
                  className="rounded-xl h-12 border-gray-300 hover:border-blue-400 focus:border-blue-500"
                  maxLength={12}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <span className="text-gray-700 font-semibold">Password</span>
                }
                rules={[
                  { required: true, message: "Please input your password!" },
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

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-600">Remember me</Checkbox>
                </Form.Item>
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 border-0 font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  icon={<LoginOutlined />}
                >
                  {loading ? "Signing In..." : "Sign In to Vote"}
                </Button>
              </Form.Item>
            </Form>

            {/* Register Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-100">
              <Text className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-700 font-semibold transition-colors"
                >
                  Register to Vote
                </Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
