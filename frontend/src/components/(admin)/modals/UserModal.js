import React, { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import Modal from "@/components/shared/Modal";
import { Input, Select, Button } from "@/components/shared/inputs";
import { FaUser, FaEnvelope, FaPhone, FaCalendar } from "react-icons/fa";
import { toast } from "sonner";

const UserModal = ({
  isOpen,
  onClose,
  mode = "add",
  user = null,
  onSuccess,
}) => {
  const { addUser, updateUser } = useUserStore();
  const { languages } = useLanguageStore();
  const { currencies } = useCurrencyStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    user_type: "user",
    language_id: "",
    currency_id: "",
  });
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && mode === "edit" && user?.id) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        date_of_birth: user.date_of_birth || "",
        user_type: user.user_type || "user",
        language_id: user.language_id || "",
        currency_id: user.currency_id || "",
      });
      // Parse date_of_birth if it exists
      if (user.date_of_birth) {
        const [year, month, day] = user.date_of_birth.split("-");
        setBirthYear(year || "");
        setBirthMonth(month ? String(parseInt(month, 10)) : "");
        setBirthDay(day ? String(parseInt(day, 10)) : "");
      } else {
        setBirthDay("");
        setBirthMonth("");
        setBirthYear("");
      }
      setFormErrors({});
    } else if (isOpen && mode === "add") {
      setFormData({
        name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        user_type: "user",
        language_id: "",
        currency_id: "",
      });
      setBirthDay("");
      setBirthMonth("");
      setBirthYear("");
      setFormErrors({});
    }
  }, [isOpen, mode, user]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Combine date parts into date_of_birth
    let dateOfBirth = "";
    if (birthYear && birthMonth && birthDay) {
      dateOfBirth = `${birthYear}-${birthMonth.padStart(
        2,
        "0"
      )}-${birthDay.padStart(2, "0")}`;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (mode === "add") {
        result = await addUser({ ...formData, date_of_birth: dateOfBirth });
      } else if (mode === "edit" && user?.id) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: dateOfBirth,
          user_type: formData.user_type,
          language_id: formData.language_id || null,
          currency_id: formData.currency_id || null,
        };
        result = await updateUser(user.id, updateData);
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        const errors = {};
        Object.keys(errorData.errors).forEach((key) => {
          errors[key] = errorData.errors[key][0];
        });
        setFormErrors(errors);
        const firstError = Object.values(errorData.errors)[0][0];
        toast.error(firstError);
      } else {
        toast.error(errorData?.message || `Failed to ${mode} user`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // User type options
  const userTypeOptions = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  // Generate day options (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

  // Generate month options
  const monthOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate year options (from 1900 to current year - 10)
  const currentYear = new Date().getFullYear();
  const maxYear = currentYear - 10;
  const yearOptions = Array.from({ length: maxYear - 1900 + 1 }, (_, i) => ({
    value: String(maxYear - i),
    label: String(maxYear - i),
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "add" ? "Add New User" : "Edit User"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "add" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> A temporary password will be generated and
              sent to the user's email along with a link to set their own
              password. The user's email will be automatically verified.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter user name"
            error={formErrors.name}
            required
            icon={<FaUser />}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="Enter email address"
            error={formErrors.email}
            required
            icon={<FaEnvelope />}
          />
        </div>

        <Input
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+216 XX XXX XXX"
          error={formErrors.phone}
          icon={<FaPhone />}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-3">
            <Select
              label="Day"
              name="birth_day"
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              options={dayOptions}
              placeholder="Day"
            />
            <Select
              label="Month"
              name="birth_month"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              options={monthOptions}
              placeholder="Month"
            />
            <Select
              label="Year"
              name="birth_year"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              options={yearOptions}
              placeholder="Year"
            />
          </div>
          {formErrors.date_of_birth && (
            <p className="text-sm text-red-600 mt-1">
              {formErrors.date_of_birth}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            User must be at least 10 years old
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Language"
            name="language_id"
            value={formData.language_id}
            onChange={(e) =>
              setFormData({ ...formData, language_id: e.target.value })
            }
            options={languages.map((lang) => ({
              value: lang.id,
              label: lang.name,
            }))}
            error={formErrors.language_id}
            placeholder="Select language (optional)"
          />

          <Select
            label="Currency"
            name="currency_id"
            value={formData.currency_id}
            onChange={(e) =>
              setFormData({ ...formData, currency_id: e.target.value })
            }
            options={currencies.map((currency) => ({
              value: currency.id,
              label: `${currency.name} (${currency.code})`,
            }))}
            error={formErrors.currency_id}
            placeholder="Select currency (optional)"
          />
        </div>

        <Select
          label="User Type"
          name="user_type"
          value={formData.user_type}
          onChange={(e) =>
            setFormData({ ...formData, user_type: e.target.value })
          }
          options={userTypeOptions}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            {mode === "add" ? "Add User" : "Update User"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
