import * as Yup from "yup";

export const ACCOUNT_TYPES = {
  INDIVIDUAL: "individual",
};

export const signupSteps = {
  [ACCOUNT_TYPES.INDIVIDUAL]: [
    {
      title: "Tạo tài khoản",
      subtitle: "Bắt đầu bằng việc thiết lập thông tin đăng nhập của bạn",
      fields: ["email", "password", "confirmPassword"],
    },
    {
      title: "Thông tin cá nhân",
      subtitle: "Cho chúng tôi biết về bạn",
      fields: ["fullName", "phoneNumber", "birthDate"],
    },
    {
      title: "Thông tin bổ sung",
      subtitle: "Hoàn thành hồ sơ của bạn",
      fields: ["cccd", "country", "address"],
    },
  ],
};

const passwordRules = {
  matches: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
  min: 8,
  max: 50,
};

const baseValidationSchema = {
  email: Yup.string()
    .email("Địa chỉ email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .min(
      passwordRules.min,
      `Mật khẩu phải có ít nhất ${passwordRules.min} ký tự`,
    )
    .max(passwordRules.max, `Mật khẩu phải ít hơn ${passwordRules.max} ký tự`)
    .matches(
      passwordRules.matches,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt",
    )
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
    .required("Vui lòng xác nhận mật khẩu của bạn"),
  phoneNumber: Yup.string()
    .matches(/^(\+?[0-9])\d{1,14}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại là bắt buộc"),
  country: Yup.string().required("Quốc gia là bắt buộc"),
  address: Yup.string().required("Địa chỉ là bắt buộc"),
};

export const validationSchemas = {
  [ACCOUNT_TYPES.INDIVIDUAL]: Yup.object({
    ...baseValidationSchema,
    fullName: Yup.string()
      .min(2, "Tên quá ngắn")
      .max(50, "Tên quá dài")
      .required("Họ và tên là bắt buộc"),
    birthDate: Yup.date()
      .max(new Date(), "Ngày sinh không thể nằm trong tương lai")
      .required("Ngày sinh là bắt buộc"),
    cccd: Yup.string()
      .matches(/^\d{9,12}$/, "Số CCCD/CMND không hợp lệ")
      .required("Số CCCD/CMND là bắt buộc"),
  }),
};

export const initialValues = {
  [ACCOUNT_TYPES.INDIVIDUAL]: {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    cccd: "",
    country: "",
    address: "",
  },
};
