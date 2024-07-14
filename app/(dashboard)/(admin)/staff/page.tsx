"use client";

import { useEffect, useState, useRef } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RadioChangeEvent } from "antd";
import {
  Pagination,
  Empty,
  Input,
  Select,
  Modal,
  Button,
  Form,
  Radio,
  Skeleton
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

interface User {
  username: string;
  email: string;
  password: string;
  role: string;
}

const FormSchema = z
  .object({
    username: z.string().min(1, "Username is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must have than 8 characters"),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
    role: z.enum(["user", "admin"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export default function Employees() {
  const router = useRouter();

  // Skeleton

  const [skeleton, setSkeleton] = useState<boolean>(true)

  useEffect(() => {
    // Simulate a data fetch
    setTimeout(() => {
        setSkeleton(false);
    }, 2000); // Adjust the timeout duration as needed
}, []);

  // Create User
  const [value, setValue] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoadings(true);
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: values.username,
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
  const [isDeleted, setIsDeleted] = useState(false);

  const handleOnSubmit = async () => {
    const response = await fetch('/api/staffDelete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // userID: engineData?.userID,
      }),
    });

    if (response.ok) {
      setIsDeleted(true);
      router.push('/engines');
    } else {
      console.log('Something went wrong.');
    }
  };

  if (isDeleted) {
    return null;
  }

  // Users Data
  const [users, setUsers] = useState<User[]>([]);
  const [usersTotal, setUsersTotal] = useState<number>();

  // Dropwdown
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>(
    {}
  );

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
      });;
  
      // Toggle the clicked dropdown
      updatedState[index] = !prev[index];
  
      return updatedState;
    });
  };

  // Loading
  const [loadings, setLoadings] = useState<boolean>();

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Pagination, Search and Filter Options
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const pageSize = 6;
  const roles: string[] = ["No Filter", "employee", "admin", "courier"];

  const createOptions = (roles: string[]) =>
    roles.map((role) => ({ label: role, value: role }));

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch("/api/staff", {
          method: "POST",
        });
        const data = await res.json();
        setUsers(data.users);
        setUsersTotal(data.usersTotal);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    getUsers();
  }, [search]); // Include search, selectedEngineType, and selectedStock in dependencies

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
            Add Employee
          </Button>
          <Modal
            title="Add Staff"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
            ]}
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
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Role"
                name="role"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Radio.Group onChange={onChange} value={value}>
                  <Radio value={"admin"}>Admin</Radio>
                  <Radio value={"employee"}>Employee</Radio>
                  <Radio value={"courier"}>Courier</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please input your password!" },
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
                    onClick={() => toggleDropdown(index)}
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
                        <a
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                          Edit
                        </a>
                      </li>
                      <li>
                        <button className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
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
                    <p className="text-white text-xs flex-grow">(Department)</p>
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
        </Skeleton>
      </div>

    </>
  );
}
