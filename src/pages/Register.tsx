import { Button, Form, Input, InputNumber, Select } from "antd";
import { useState } from "react";
import { NavBar } from "../common";

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

const Register = () => {
  const [user_type, setUserType] = useState("");

  return (
    <>
      <NavBar />
      <div className="d-flex justify-content-center align-items-center">
        <Form
          {...formItemLayout}
          // variant="filled"
          style={{ maxWidth: 900 }}
          className="form-height shadow rounded p-3 my-5 col-md-3 col-sm-3 bg-white col-10"
        >
          <div className="text-center my-3">
            <h5>Si-Maxis Meters Limited</h5>
          </div>
          <Form.Item
            label="First name"
            name="First name"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Middle name"
            name="Middle name"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last name"
            name="Last name"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ID number"
            name="ID number"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Phone number"
            name="Phone number"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="Email"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Tenant/Landloard"
            name="Select"
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
              name="Meter number"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          )}
          {user_type === "Landlord" && (
            <>
              <Form.Item
                label="Quantity"
                name="Quantity"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="How many meter devices?"
                />
              </Form.Item>
              <Form.Item
                label="Building Location"
                name="Location"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Plot number"
                name="Plot number"
                rules={[{ required: true, message: "Please input!" }]}
              >
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item
            label="Password"
            name="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm password"
            name="Confirm password"
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
