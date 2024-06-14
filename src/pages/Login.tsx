import { AppDispatch, RootState } from "../store";
import { Button, Form, Input, type FormProps, Spin } from "antd";
import { LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
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
      <div className="d-flex justify-content-center align-items-center">
        <Form
          name="basic"
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="form-height shadow rounded p-3 mt-5 col-md-3 col-sm-3 bg-white col-10"
        >
          <div className="text-center my-3">
            <h5>Si-Maxis Meters Limited</h5>
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
              <Spin />
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                className=" mt-3 col-12 bg-blue"
              >
                Login
              </Button>
            )}
          </div>

          <div className="mb-3 mt-5 d-flex justify-content-between">
            <div className="">
              <Link to="/register">Register</Link>
            </div>
            <div className="text-center text-primary  d-flex justify-content-end ">
              <small className="cursor">Forgot password</small>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Login;
