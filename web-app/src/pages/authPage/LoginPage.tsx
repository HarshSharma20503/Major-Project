import { useState, ChangeEvent, FormEvent } from "react";
import { apiCall } from "../../utils/ApiClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    type ApiResponse = {
      success: boolean;
      message: string;
      data?: { success: boolean; message: string };
    };
    const data = await apiCall<ApiResponse>({
      url: "/api/auth/login",
      method: "POST",
      data: formData,
    });
    console.log(data);
    if (data?.success) {
      localStorage.setItem("user", JSON.stringify(data?.data));
      toast.success("Login Successful");
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div
      className="container h-75 d-flex justify-content-center align-content-center"
      style={{ minHeight: "80vh" }}
    >
      <form
        className="d-flex flex-column justify-content-center align-content-center"
        style={{ minWidth: "20vw" }}
        onSubmit={handleSubmit} // Form should handle submit here
      >
        <h3 className="text-white w-100 text-center">Log In</h3>
        <div className="mb-3">
          <label className="text-white mb-2">Email address</label>
          <input
            type="email"
            name="email"
            className="form-control py-2"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="text-white mb-2">Password</label>
          <input
            type="password"
            name="password"
            className="form-control py-2"
            placeholder="Enter password"
            onChange={handleChange}
            value={formData.password}
          />
        </div>
        <div className="d-grid">
          <button type="submit" className="btn btn-primary py-2">
            {loading ? (
              <div className="w-100 text-center ">
                <Spinner animation="border" variant="light" />
              </div>
            ) : (
              <>Submit</>
            )}
          </button>
          <div
            className="my-3 text-white "
            style={{ display: "flex", justifyContent: "center" }}
          >
            Don't have an account?{" "}
            <span
              className="text-primary text-decoration-underline mx-1"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Sign Up
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
