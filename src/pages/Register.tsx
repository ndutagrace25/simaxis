import { Button, Form, Input, InputNumber, Select, type FormProps } from "antd";
import { useState } from "react";
import { NavBar, NavDetails } from "../common";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

type FieldType = {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  id_number?: number;
  phone_number?: number;
  email?: string;
  user_type?: string;
  meter_number?: number;
  quantity?: number;
  location?: string;
  plot_number?: string;
  password?: string;
  confirm_password?: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [user_type, setUserType] = useState("");

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    if (values.password !== values.confirm_password) {
      Swal.fire("Error", "Password didn't match!", "error");
    } else {
      Swal.fire(
        "Success",
        "You have successfully registered! Login to check your approval status",
        "success"
      );
      navigate("/login");
    }
  };

  return (
    <>
      <NavBar>
        <NavDetails />
      </NavBar>
      <div className="d-flex justify-content-center align-items-center">
        <Form
          {...formItemLayout}
          style={{ maxWidth: 900 }}
          onFinish={onFinish}
          className="form-height shadow rounded p-3 my-5 col-md-4 col-sm-3 bg-white col-10"
        >
          <div className="text-center my-3">
            <h5>Si-Maxis Meters Limited</h5>
          </div>
          <Form.Item
            label="First name"
            name="first_name"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Middle name"
            name="middle_name"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="last_name"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ID number"
            name="id_number"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Phone number"
            name="phone_number"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Tenant/Landloard"
            name="user_type"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Select
              options={[
                { value: "Tenant", label: "Tenant" },
                { value: "Landlord", label: "Landlord" },
              ]}
              value={user_type}
              onChange={setUserType}
            />
          </Form.Item>
          {user_type === "Tenant" && (
            <Form.Item
              label="Meter number"
              name="meter_number"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          )}
          {user_type === "Landlord" && (
            <>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="How many meter devices?"
                />
              </Form.Item>
              <Form.Item
                label="Building Location"
                name="location"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Plot number"
                name="plot_number"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="confirm_password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
            <Button type="primary" htmlType="submit" className="bg-green">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Register;
