import { AppDispatch, RootState } from "../store";
import { Button, Form, Input, type FormProps, Spin } from "antd";
import { LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { NavBar, NavDetails } from "../common";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";

type FieldType = {
  phone?: string;
  password?: string;
  remember?: string;
};

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loggingLoading } = useSelector((state: RootState) => state.auth);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    dispatch(loginUser({ phone: values.phone, password: values.password }));
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <NavBar>
        <NavDetails />
      </NavBar>
      <section className="auth-page">
        <Form
          name="basic"
          style={{ maxWidth: 520 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="auth-card"
        >
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to access your Si-Maxis meter operations dashboard.</p>
          </div>
          <Form.Item<FieldType>
            name="phone"
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input
              placeholder="Phone number"
              prefix={
                <PhoneOutlined className="site-form-item-icon text-blue" />
              }
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              placeholder="Password"
              prefix={
                <LockOutlined className="site-form-item-icon text-blue" />
              }
            />
          </Form.Item>

          <div className="col-12">
            {loggingLoading ? (
              <div className="text-center py-2">
                <Spin />
              </div>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                className="btn-brand btn-brand-block"
              >
                Login
              </Button>
            )}
          </div>

          <div className="auth-footer">
            <div className="text-center text-primary d-flex justify-content-end">
              <small className="cursor">Forgot password</small>
            </div>
          </div>
        </Form>
      </section>
    </>
  );
};

export default Login;
