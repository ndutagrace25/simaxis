import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  type FormProps,
  Spin,
} from "antd";
import { useState } from "react";
import { NavBar, NavDetails } from "../common";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { registerUser } from "../features/auth/authSlice";

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
  username?: string;
  national_id?: number;
  phone?: string;
  email?: string;
  role?: string;
  meter_number?: number;
  location?: string;
  plot_number?: string;
  password?: string;
  confirm_password?: string;
};

const Register = () => {
  const [role, setUserType] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const { loadingRegistration } = useSelector((state: RootState) => state.auth);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    if (values.password !== values.confirm_password) {
      Swal.fire("Error", "Password didn't match!", "error");
    } else {
      dispatch(
        registerUser({
          username: values.username,
          phone: values.phone,
          email: values.email,
          role: values.role,
          password: values.password,
          first_name: values.first_name,
          middle_name: values.middle_name,
          last_name: values.last_name,
          location: values.location,
          national_id: values.national_id,
          plot_number: values.plot_number,
          meter_number: values.meter_number,
        })
      );
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
            label="Username (unique)"
            name="username"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="ID number"
            name="national_id"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Phone number"
            name="phone"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Tenant/Landlord"
            name="role"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Select
              options={[
                { value: "Tenant", label: "Tenant" },
                { value: "Landlord", label: "Landlord" },
              ]}
              value={role}
              onChange={setUserType}
            />
          </Form.Item>
          {/* {role === "Tenant" && (
            <Form.Item
              label="Meter number"
              name="meter_number"
              rules={[{ required: true, message: "Please input!" }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          )} */}
          {role === "Landlord" && (
            <>
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
          {loadingRegistration ? (
            <Spin />
          ) : (
            <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
              <Button type="primary" htmlType="submit" className="bg-blue">
                Submit
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </>
  );
};

export default Register;
