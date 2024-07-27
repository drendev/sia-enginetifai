"use client";

import { useEffect, useState, useRef, createContext } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RadioChangeEvent } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import {
  Pagination,
  Empty,
  Input,
  Select,
  Modal,
  Button,
  Form,
  Radio,
  Skeleton,
  Spin,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const ReachableContext = createContext<string | null>(null);

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

const FormSchema = z
  .object({
    usernameInput: z
      .string()
      .min(5, "Minimum 5 characters required.")
      .max(100)
      .refine((username) => username.trim().length > 0, {
        message: "Username is required",
      }),
    role: z.enum(["admin", "employee", "courier"]),
    email: z
      .string()
      .email("Invalid email format")
      .min(5, "Minimum 5 characters required.")
      .max(100)
      .refine((email) => email.trim().length > 0, {
        message: "Email is required",
      }),
    password: z.string().min(8, "Password must have at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Employees() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const [modal, contextHolder] = Modal.useModal();
  const [showDelModal, setShowDelModal] = useState(false);
  // Users Data
  const [users, setUsers] = useState<User[]>([]);
  const [value, setVal] = useState("admin");
  const [skeleton, setSkeleton] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [loadings, setLoadings] = useState<boolean>();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [checkUsername, setCheckUsername] = useState<string | undefined>(
    undefined
  );
  const [checkEmail, setCheckEmail] = useState<string | undefined>(undefined);
  const [checkIfExistingUsername, setCheckIfExistingUsername] = useState<
    User | undefined
  >(undefined);
  const [checkIfExistingEmail, setCheckIfExistingEmail] = useState<
    User | undefined
  >(undefined);

  // Edit Staff
  const [showEditStaffForm, setShowEditStaffForm] = useState(false);
  const [editStaffForm] = Form.useForm();
  const [userEditData, setUserEditData] = useState<User | null>(null);

  const pageSize = 6;
  const roles: string[] = ["No Filter", "employee", "admin", "courier"];

  const config = {
    title: "Delete Staff",
    content: (
      <>
        <ReachableContext.Consumer>
          {(name) => `Are you sure you want to permanently delete this staff?`}
        </ReachableContext.Consumer>
        <br />
      </>
    ),
  };

  // Pagination, Search and Filter Options
  const createOptions = (roles: string[]) =>
    roles.map((role) => ({ label: role, value: role }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch Staff Info

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/staff", {
          method: "POST",
        });
        const data = await res.json();
        const usersWithIndex = data.users.map((user: any, index: number) => ({
          ...user,
          index: index + 1,
        }));

        setUsers(usersWithIndex);
        console.log(usersWithIndex);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, [search]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesUserRole = selectedRole ? user.role === selectedRole : true;
    return matchesSearch && matchesUserRole;
  });

  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Skeleton
  useEffect(() => {
    // Simulate a data fetch
    setTimeout(() => {
      setSkeleton(false);
    }, 2000); // Adjust the timeout duration as needed
  }, []);

  // Create User

  // Check if username is existing
  useEffect(() => {
    const fetchData = async () => {
      if (!checkUsername) return setCheckUsername(undefined);

      const res = await fetch(
        `/api/staffCheck/checkUsername?username=${checkUsername}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      setCheckIfExistingUsername(data);
    };

    fetchData();
  }, [checkUsername]);

  // Check if email is existing

  useEffect(() => {
    const fetchData = async () => {
      if (!checkEmail) return setCheckEmail(undefined);

      const res = await fetch(
        `/api/staffCheck/checkEmail?email=${checkEmail}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      setCheckIfExistingEmail(data);
    };

    fetchData();
  }, [checkEmail]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      usernameInput: "",
      email: "",
      password: " ",
      confirmPassword: "",
      role: "admin",
    },
  });

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setVal(e.target.value);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoadings(true);
    console.log(values);
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.usernameInput,
        email: values.email,
        password: values.password,
        role: values.role,
      }),
    });

    if (response.ok) {
      setLoadings(false);
      window.location.reload();
    } else {
      console.log("Something went wrong.");
    }
  };

  // Delete User

  const [confirmLoading, setConfirmLoading] = useState(false);
  useEffect(() => {
    if (showDelModal && selectedUserId) {
      Modal.confirm({
        ...config,

        onOk: async () => {
          setConfirmLoading(true);
          await handleOnSubmit();
          setConfirmLoading(false);
        },
        okText: "Confirm Delete",
        okType: "danger",
      });
      setShowDelModal(false); // reset the showModal state
    }
  }, [showDelModal, selectedUserId, confirmLoading]);

  const handleOnSubmit = async () => {
    if (selectedUserId) {
      const response = await fetch("/api/staffDelete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: selectedUserId,
        }),
      });

      console.log(selectedUserId);

      if (response.ok) {
        window.location.reload();
      } else {
        console.log("Something went wrong.");
      }
    }
  };

  const showDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setShowDelModal(true);
  };

  // Edit Staff
  const handleEditStaffButtonClick = (user: User) => {
    setShowEditStaffForm(true);
    setUserEditData(user);
    editStaffForm.setFieldsValue({
      userID: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: user.password,
    });
  };

  const handleEditStaffSubmit = async (values: any) => {
    setLoadings(true);
    console.log("values: ", values);
    const response = await fetch(`/api/staffEdit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID: values.userID,
        username: values.username,
        email: values.email,
        role: values.role,
        password: values.password,
      }),
    });

    if (response.ok) {
      setLoadings(false);
      setShowEditStaffForm(false);
      const updatedData = await response.json();
      setUserEditData(updatedData);
      window.location.reload();
    } else {
      setLoadings(false);
      console.log("Something went wrong.");
    }
  };

  // Dropdown
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (Object.values(dropdownOpen).every((isOpen) => !isOpen)) return;

      Object.keys(dropdownOpen).forEach((index) => {
        const dropdown = dropdownRefs.current[parseInt(index)];
        const trigger = triggerRefs.current[parseInt(index)];

        if (
          dropdown &&
          trigger &&
          !dropdown.contains(target as Node) &&
          !trigger.contains(target as Node)
        ) {
          setDropdownOpen((prev) => ({ ...prev, [index]: false }));
        }
      });
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen]);

  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggleDropdown = (index: number) => {
    setDropdownOpen((prev) => {
      // Create a new object to track the updated state
      const updatedState: { [key: number]: boolean } = {};

      // Close all other dropdowns
      Object.keys(prev).forEach((key: string) => {
        const numericKey: number = parseInt(key, 10); // Parse key to number
        updatedState[numericKey] = false; // Set corresponding value to false
      });

      // Toggle the clicked dropdown
      updatedState[index] = !prev[index];

      return updatedState;
    });
  };

  // Modals

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="pt-20 pl-10 pr-10 ">
        <Input
          className="h-16 text-sm font-medium w-full mb-5 shadow-inner font-sans font-semibold rounded-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          size="large"
          placeholder="Search Staff"
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex">
          <div className="mt-3 flex-grow">
            {filteredUsers.length}{" "}
            {filteredUsers.length === 1 || filteredUsers.length === 0
              ? "Staff"
              : "Staffs"}
          </div>

          <Select
            showSearch
            className="w-72 rounded-lg mr-4 h-10"
            placeholder="Staff Role"
            optionFilterProp="label"
            filterSort={(optionA, optionB) => {
              if (optionA.label === "No Filter") return -1;
              if (optionB.label === "No Filter") return 1;
              return (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase());
            }}
            options={createOptions(roles)}
            onChange={(value) =>
              value === "No Filter"
                ? setSelectedRole(null)
                : setSelectedRole(value)
            }
            value={selectedRole}
          />

          <Button
            onClick={showModal}
            className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
          >
            <svg
              className="w-3.5 h-3.5 me-2"
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56 32H32V56H24V32H0V24H24V0H32V24H56V32Z"
                fill="white"
              />
            </svg>
            Add Staff
          </Button>
          <Modal
            title="Add Staff"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[]}
          >
            <Form
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              onFinish={onSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="usernameInput"
                rules={[
                  { required: true, message: "Please input username" },
                  () => ({
                    validator(_, value) {
                      if (value === undefined) {
                        return Promise.reject();
                      } else if (value === checkIfExistingUsername?.username) {
                        return Promise.reject("Username already exists");
                      } else if (value.length < 5 && value.length > 1) {
                        return Promise.reject("Minimum 5 characters required.");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  value={checkUsername}
                  onChange={(e) => setCheckUsername(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Please select a role!" }]}
              >
                <Radio.Group onChange={onChange} value={value}>
                  <Radio value="admin">Admin</Radio>
                  <Radio value="employee">Employee</Radio>
                  <Radio value="courier">Courier</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  () => ({
                    validator(_, value) {
                      console.log(value);
                      console.log(checkIfExistingEmail);
                      if (value == undefined || value == "") {
                        return Promise.reject();
                      } else if (!emailRegex.test(value)) {
                        return Promise.reject("Invalid email format!");
                      } else if (value === checkIfExistingEmail?.email) {
                        return Promise.reject("Email already exists");
                      } else if (value.length < 5 && value.length > 1) {
                        return Promise.reject("Minimum 5 characters required.");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input
                  value={checkEmail}
                  onChange={(e) => setCheckEmail(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  () => ({
                    validator(_, value) {
                      console.log("values: ", { value });
                      if (value == undefined || value == "") {
                        return Promise.reject();
                      } else if (value.length < 8 && value.length > 0) {
                        return Promise.reject("Password is too short");
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Please confirm your password!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loadings}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
        {/* Kupal */}
        {showEditStaffForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50 overflow-scroll md:overflow-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg mt-16 shadow-lg w-full max-w-4xl">
              <h2 className="text-lg font-semibold mb-4">
                Edit Staff : {userEditData?.username}{" "}
              </h2>
              <Form
                autoComplete="off"
                form={editStaffForm}
                onFinish={handleEditStaffSubmit}
              >
                <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                  <div className="mb-4">
                    <Form.Item style={{ display: 'none' }}
                      name="userID"
                    >
                      <Input
                        type="hidden"
                      />
                    </Form.Item>
                    <label className="text-slate-50 dark:text-slate-200 block mb-1 font-sans font-semibold">
                      Username
                    </label>
                    <Form.Item
                      className="mb-0"
                      name="username"
                      rules={[
                        { required: true, message: "Please enter username" },
                      ]}
                    >
                      <Input
                        placeholder="Username"
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                        required
                      />
                    </Form.Item>
                  </div>
                  <div className="mb-4">
                    <label className="text-slate-50 dark:text-slate-200 block mb-1 font-sans font-semibold">
                      E-mail
                    </label>
                    <Form.Item
                      className="mb-0"
                      name="email"
                      rules={[
                        { required: true, message: "Please enter e-mail" },
                      ]}
                    >
                      <Input
                        placeholder="E-mail"
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                        required
                      />
                    </Form.Item>
                  </div>
                  <div className="mb-4">
                    <label className="text-slate-50 dark:text-slate-200 block mb-1 font-sans font-semibold">
                      Password
                    </label>
                    <Form.Item
                      className="mb-0"
                      name="password"
                      rules={[
                        { required: true, message: "Please enter password" },
                      ]}
                    >
                      <Input.Password
                        placeholder="password"
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white focus:outline-none w-full"
                        required
                      />
                    </Form.Item>
                  </div>
                  <div className="mb-4">
                    <label className="text-slate-50 dark:text-slate-200 block mb-1 font-sans font-semibold">
                      Role
                    </label>
                    <Form.Item
                      className="mb-0"
                      name="role"
                      rules={[{ required: true, message: "Please enter role" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Search to Select"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? "").toLowerCase())
                        }
                        options={[
                          {
                            value: "Admin",
                            label: "Admin",
                          },
                          {
                            value: "Employee",
                            label: "Employee",
                          },
                          {
                            value: "Courier",
                            label: "Courier",
                          },
                        ]}
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2"
                    onClick={() => setShowEditStaffForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-primary text-white rounded-lg"
                  >
                    {loadings ? (
                      <Spin
                        indicator={
                          <LoadingOutlined className="text-white" spin />
                        }
                      />
                    ) : (
                      "Edit Staff"
                    )}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}

        {/* Staff Cards */}
        <Skeleton loading={skeleton} active avatar paragraph={{ rows: 5 }}>
          <div className="grid grid-cols-1 justify-center gap-x-8 gap-y-4 mt- 5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <div
                  key={index}
                  className="m-3 p-3 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-end px-4 pt-4">
                    <button
                      ref={(el) => (triggerRefs.current[index] = el)}
                      onClick={() => {
                        toggleDropdown(index);
                        console.log(currentUsers);
                        console.log(index);
                      }}
                      className="flex items-center gap-2 md:gap-4 hover:opacity-60 active:opacity-85"
                    >
                      <span className="sr-only">Open dropdown</span>
                      <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 3"
                      >
                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                      </svg>
                    </button>
                    {/* Dropdown menu */}
                    <div
                      ref={(el) => (dropdownRefs.current[index] = el)}
                      onFocus={() =>
                        setDropdownOpen((prev) => ({ ...prev, [index]: true }))
                      }
                      onBlur={() =>
                        setDropdownOpen((prev) => ({ ...prev, [index]: false }))
                      }
                      className={`absolute flex mt-5 flex-col rounded-xl border border-stroke bg-white shadow-md dark:border-slate-700 z-[1000] dark:bg-slate-900 ${
                        dropdownOpen[index] ? "block" : "hidden"
                      }`}
                    >
                      <ul className="py-2">
                        <li>
                          <button
                            onClick={() => {
                              handleEditStaffButtonClick(user), setDropdownOpen((prev) => ({ ...prev, [index]: false }));
                            }}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              showDeleteModal(user.id);
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pb-10">
                    <img
                      className="w-16 h-16 mb-3 ml-3 rounded-full shadow-lg"
                      src="https://cdn-icons-png.flaticon.com/512/219/219969.png"
                      alt="Bonnie image"
                    />
                    <h5 className="ml-1 mb-1 text-xl font-medium text-gray-900 dark:text-white">
                      {user.username}
                    </h5>
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                      {user.role}
                    </span>
                    <div className="flex mt-3 ml-1">
                      <p className="text-gray-400 text-xs flex-grow">
                        Department
                      </p>
                      <p className="text-gray-400 text-xs mr-2">Date Hired</p>
                    </div>
                    <div className="flex mt-3 ml-1">
                      <p className="text-white text-xs flex-grow">
                        (Department)
                      </p>
                      <p className="text-white text-xs mr-2">(Date)</p>
                    </div>
                    <div className="flex mt-5 ml-1">
                      <svg
                        className="w-3.5 h-3.5 me-2"
                        width="80"
                        height="64"
                        viewBox="0 0 80 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M72 0H8C3.6 0 0.04 3.6 0.04 8L0 56C0 60.4 3.6 64 8 64H72C76.4 64 80 60.4 80 56V8C80 3.6 76.4 0 72 0ZM72 16L40 36L8 16V8L40 28L72 8V16Z"
                          fill="white"
                        />
                      </svg>
                      <p className="text-white text-xs mr-2 text-right flex-grow">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex mt-3 ml-1">
                      <svg
                        className="w-3.5 h-3.5 me-2"
                        width="72"
                        height="72"
                        viewBox="0 0 72 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14.48 31.16C20.24 42.48 29.52 51.72 40.84 57.52L49.64 48.72C50.72 47.64 52.32 47.28 53.72 47.76C58.2 49.24 63.04 50.04 68 50.04C70.2 50.04 72 51.84 72 54.04V68C72 70.2 70.2 72 68 72C30.44 72 0 41.56 0 4C0 1.8 1.8 0 4 0H18C20.2 0 22 1.8 22 4C22 9 22.8 13.8 24.28 18.28C24.72 19.68 24.4 21.24 23.28 22.36L14.48 31.16Z"
                          fill="white"
                        />
                      </svg>
                      <p className="text-white text-xs mr-2 text-right flex-grow">
                        9953715230
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center col-span-full h-full md:h-72">
                <Empty className="text-center" description="No staff found" />
              </div>
            )}
          </div>
          <div className="text-center mt-3 mb-3 pb-5">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredUsers.length}
              onChange={handlePageChange}
            />
          </div>
          {contextHolder}
        </Skeleton>
      </div>
    </>
  );
}
