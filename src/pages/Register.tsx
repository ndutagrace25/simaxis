import { AppDispatch, RootState } from "../store";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select as AntSelect,
  type FormProps,
  Spin,
} from "antd";
import { setKey, fromAddress } from "react-geocode";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { NavBar, NavDetails } from "../common";
import { registerUser } from "../features/auth/authSlice";
import Select from "react-select";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getLandlords, Landlord } from "../features/customer/customerSlice";

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
  building_name?: string;
  password?: string;
  confirm_password?: string;
};

const Register = () => {
  const [role, setUserType] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const [address, setAddress] = useState<any>(null);
  const [location, setLocation] = useState<any>(null);
  const [lat, setLat] = useState<any>(null);
  const [long, setLong] = useState<any>(null);
  const [landlord_id, setLandlord] = useState<any>(null);

  const { loadingRegistration } = useSelector((state: RootState) => state.auth);
  const { landlords } = useSelector((state: RootState) => state.customer);

  const formattedData = landlords.map((item: Landlord) => {
    return {
      value: item.id,
      label: `${item.first_name} ${item.last_name} - ${item.building_name}`,
    };
  });

  useEffect(() => {
    dispatch(getLandlords());
  }, []);

  const handleLandlordChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setLandlord(selectedOption);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    if (values.password !== values.confirm_password) {
      Swal.fire("Error", "Password didn't match!", "error");
    } else {
      if (values.role === "Landlord" && !location) {
        Swal.fire("Error", "Please select a location", "error");
      } else {
        if (values.role === "Tenant" && !landlord_id?.value) {
          Swal.fire("Error", "Please select a location", "error");
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
              location,
              lat,
              long,
              national_id: values.national_id,
              building_name: values.building_name,
              plot_number: values.plot_number,
              meter_number: values.meter_number,
              landlord_id: landlord_id?.value,
            })
          );
        }
      }
    }
  };

  const onChangeAddress: any = (address: any) => {
    setLocation(address?.label);
    setAddress(address);

    setKey("AIzaSyDnogG0wcavOEE8_BkXdzq6fiaBBEQ5GYQ");

    // get lat and lon of the address
    fromAddress(address?.label).then(
      (response: any) => {
        const { lat, lng } = response?.results[0].geometry.location;
        setLat(lat);
        setLong(lng);
      },
      (error: any) => {
        console.error(error);
      }
    );
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
            <AntSelect
              options={[
                { value: "Tenant", label: "Tenant" },
                { value: "Landlord", label: "Landlord" },
              ]}
              value={role}
              onChange={setUserType}
            />
          </Form.Item>

          {role === "Landlord" && (
            <>
              <Form.Item
                className=""
                label="Location"
                name="location"
                rules={[{ required: false, message: "Please input!" }]}
              >
                <GooglePlacesAutocomplete
                  apiKey={"AIzaSyDnogG0wcavOEE8_BkXdzq6fiaBBEQ5GYQ"}
                  apiOptions={{ region: "ke" }}
                  autocompletionRequest={{
                    componentRestrictions: {
                      country: ["ke"],
                    },
                  }}
                  selectProps={{
                    value: address,
                    onChange: onChangeAddress,
                    className: "text-black rounded mt-2",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Building Name"
                name="building_name"
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

          {role === "Tenant" && (
            <>
              <Form.Item label="Select your landlord" name="landlord_id">
                <Select
                  value={landlord_id}
                  onChange={(option) => handleLandlordChange(option)}
                  options={formattedData}
                />
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
