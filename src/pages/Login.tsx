import { Button, Form, Input, type FormProps } from "antd";
import { LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { NavBar, NavDetails } from "../common";
import { useNavigate } from "react-router-dom";

type FieldType = {
  username?: string;
  password?: string;
  remember?: string;
};

const Login = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    navigate("/my-account");
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
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Phone number"
              prefix={
                <PhoneOutlined className="site-form-item-icon text-success" />
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
                <LockOutlined className="site-form-item-icon text-success" />
              }
            />
          </Form.Item>

          <div className="col-12">
            <Button
              type="primary"
              htmlType="submit"
              className=" mt-3 col-12 bg-green"
            >
              Login
            </Button>
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
