import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { customer_change_password, messageClear } from "../../store/reducers/authReducer";

const ChangePasswordForm = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => dispatch(messageClear()), 3000);
      // Nếu đổi mật khẩu thành công, reset form sau 3s
      if (successMessage) {
        setFormData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage, dispatch]);

  const validateForm = () => {
    let errors = {};
    if (!formData.oldPassword) errors.oldPassword = "Vui lòng nhập mật khẩu cũ!";
    if (!formData.newPassword) errors.newPassword = "Vui lòng nhập mật khẩu mới!";
    if (formData.newPassword.length < 6) errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự!";
    if (formData.newPassword !== formData.confirmPassword) errors.confirmPassword = "Mật khẩu xác nhận không khớp!";
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Xóa lỗi tương ứng khi người dùng nhập liệu
    setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    dispatch(customer_change_password(formData));
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-center text-xl font-semibold mb-4">Đổi Mật Khẩu</h2>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mật khẩu cũ */}
        <div>
          <label className="block font-medium">Mật khẩu cũ</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.oldPassword && <p className="text-red-500 text-sm">{formErrors.oldPassword}</p>}
        </div>

        {/* Mật khẩu mới */}
        <div>
          <label className="block font-medium">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.newPassword && <p className="text-red-500 text-sm">{formErrors.newPassword}</p>}
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <label className="block font-medium">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          {formErrors.confirmPassword && <p className="text-red-500 text-sm">{formErrors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loader}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {loader ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
