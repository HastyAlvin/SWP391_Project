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

  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (successMessage || errorMessage) {
      setTimeout(() => dispatch(messageClear()), 3000);
    }
  }, [successMessage, errorMessage, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "confirmPassword") {
      if (e.target.value !== formData.newPassword) {
        setPasswordError("Mật khẩu xác nhận không khớp!");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError("Mật khẩu xác nhận không khớp!");
      return;
    }
    dispatch(customer_change_password(formData));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Đổi Mật Khẩu</h2>

      {errorMessage && <p style={{ ...styles.message, ...styles.error }}>{errorMessage}</p>}
      {successMessage && <p style={{ ...styles.message, ...styles.success }}>{successMessage}</p>}
      {passwordError && <p style={{ ...styles.message, ...styles.error }}>{passwordError}</p>}

      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Mật khẩu cũ</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Nhập lại mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={loader || passwordError} style={styles.button}>
          {loader ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>
      </form>
    </div>
  );
};

// CSS viết dưới dạng object styles
const styles = {
  container: {
    width: "400px",
    margin: "50px auto",
    padding: "20px",
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "5px",
    color: "#555",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    fontSize: "16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    opacity: "1",
  },
  message: {
    textAlign: "center",
    margin: "10px 0",
    fontSize: "14px",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
};

export default ChangePasswordForm;
