import { AppDispatch, RootState } from "../store";
import {
  Button,
  Form,
  Input,
  InputNumber,
  type FormProps,
  Spin,
} from "antd";
// import { setKey, fromAddress } from "react-geocode";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { NavBar } from "../common";
import { registerUser } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { appSession } from "../utils/appStorage";

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
};

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = appSession.getUser();
  // const [address, setAddress] = useState<any>(null);
  // const [location, setLocation] = useState<any>(null);
  // const [lat, setLat] = useState<any>(null);
  // const [long, setLong] = useState<any>(null);
  const { loadingRegistration } = useSelector((state: RootState) => state.auth);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    dispatch(
      registerUser({
        username: values.username,
        phone: values.phone,
        email: values.email,
        role: "Landlord",
        password: "11111111",
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        location: values.location,
        // lat,
        // long,
        national_id: values.national_id,
        building_name: values.building_name,
        plot_number: values.plot_number,
        meter_number: values.meter_number,
      })
    );
  };

  // const onChangeAddress: any = (address: any) => {
  //   setLocation(address?.label);
  //   setAddress(address);

  //   setKey("AIzaSyDnogG0wcavOEE8_BkXdzq6fiaBBEQ5GYQ");

  //   // get lat and lon of the address
  //   fromAddress(address?.label).then(
  //     (response: any) => {
  //       const { lat, lng } = response?.results[0].geometry.location;
  //       setLat(lat);
  //       setLong(lng);
  //     },
  //     (error: any) => {
  //       console.error(error);
  //     }
  //   );
  // };

  return (
    <>
      <NavBar>
        <div className="navbar-nav ms-auto d-flex align-items-center gap-2 py-2">
          <div className="me-2 text-nowrap">
            <small>
              {user?.first_name} {user?.last_name} ({user?.role})
            </small>
          </div>
          <Link to="/my-account">
            <Button type="default" shape="round" className="btn-outline-brand">
              Back To Dashboard
            </Button>
          </Link>
          <Button
            type="primary"
            shape="round"
            className="btn-brand text-white fw-bold"
            onClick={() => {
              sessionStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </NavBar>
      <section className="auth-page register-page">
        <Form
          {...formItemLayout}
          style={{ maxWidth: 900 }}
          onFinish={onFinish}
          className="auth-card register-card"
        >
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>
              You are signed in. Fill in user details below to register a new
              account.
            </p>
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
          {/* <Form.Item
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
          </Form.Item> */}
          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input style={{ width: "100%" }} />
          </Form.Item>
          {loadingRegistration ? (
            <div className="text-center py-2">
              <Spin />
            </div>
          ) : (
            <Form.Item wrapperCol={{ offset: 9, span: 16 }}>
              <Button type="primary" htmlType="submit" className="btn-brand">
                Submit
              </Button>
            </Form.Item>
          )}
        </Form>
      </section>
    </>
  );
};

export default Register;
