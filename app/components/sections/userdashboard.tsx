"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { BsCartCheckFill } from "react-icons/bs";

interface Order {
  id: number;
  date: string;
  status: string;
  total: number;
}
interface UserInfo {
  name: string;
  email: string;
  createdAt: string;
}

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "hossein",
    email: "hosein@gmail.com",
    createdAt: "2024/8/15",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeSection, setActiveSection] = useState("profile"); // Track active section
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(userInfo.name);
  const [newEmail, setNewEmail] = useState(userInfo.email);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        const ordersResponse = await fetch("/api/orders");
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setOrders(ordersData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const handleUpdateUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName, email: newEmail }),
      });
      if (response.ok) {
        const updatedUserInfo = await response.json();
        setUserInfo(updatedUserInfo);
        setIsEditing(false);
      } else {
        throw new Error("Failed to update user information");
      }
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };
  // if (loading)
  //   return (
  //     <div className="flex items-center justify-center h-screen relative">
  //       <Image
  //         src="/assets/images/Eclipse@1x-1.0s-200px-200px.svg"
  //         className="  top-1/2 left-1/2"
  //         alt="Loading..."
  //         width={100}
  //         height={100}
  //       />
  //     </div>
  //   );
  // if (!userInfo) return <div>User not found</div>;

  const Sidebar = () => (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-blue-800 h-screen p-6 text-white fixed"
      dir="rtl"
    >
      <h2 className="text-2xl font-bold mb-6">داشبورد ( نام کاربر )</h2>
      <nav className="space-y-4">
        <button
          onClick={() => setActiveSection("profile")}
          className={`flex items-center gap-2 p-2 w-full rounded-lg ${
            activeSection === "profile" ? "bg-blue-600" : ""
          }`}
        >
          <FaUser /> پروفایل
        </button>
        <button
          onClick={() => setActiveSection("orders")}
          className={`flex items-center gap-2 p-2 w-full rounded-lg ${
            activeSection === "orders" ? "bg-blue-600" : ""
          }`}
        >
          <BsCartCheckFill /> سفارشات
        </button>
        <button
          onClick={() => setActiveSection("settings")}
          className={`flex items-center gap-2 p-2 w-full rounded-lg ${
            activeSection === "settings" ? "bg-blue-600" : ""
          }`}
        >
          <FaCog /> پیگیری سفارش
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 p-2 w-full rounded-lg text-red-400 hover:bg-red-600"
        >
          <FaSignOutAlt /> خروج
        </button>
      </nav>
    </motion.aside>
  );

  const ProfileSection = () => (
    <motion.section
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="shadow rounded-xl m-6 p-10 flex flex-col gap-4"
      style={{ backgroundColor: "#3a6ea5" }}
      dir="rtl"
    >
      <h3
        className="text-2xl font-semibold mb-4 inline-flex items-center gap-2"
        style={{ color: "#ff6700" }}
      >
        <FaUser /> <span>اطلاعات کاربری</span>
      </h3>
      {isEditing ? (
        <form onSubmit={handleUpdateUserInfo}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="نام جدید"
            className="border rounded p-2 w-full mb-4"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="ایمیل جدید"
            className="border rounded p-2 w-full mb-4"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded shadow bg-blue-500 text-white"
          >
            به‌روزرسانی
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 rounded shadow mr-2 bg-red-500 text-white ml-2"
          >
            انصراف
          </button>
        </form>
      ) : (
        <>
          <p style={{ color: "#e4e4e4" }}>
            <strong> نام :</strong> {userInfo.name}
          </p>
          <p style={{ color: "#e4e4e4" }}>
            <strong> ایمیل :</strong> {userInfo.email}
          </p>
          <p style={{ color: "#e4e4e4" }}>
            <strong> تاریخ ایجاد اکانت :</strong>{" "}
            {new Date(userInfo.createdAt).toLocaleDateString()}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 w-fit rounded shadow bg-green-500 text-white"
          >
            ویرایش اطلاعات
          </button>
        </>
      )}
    </motion.section>
  );

  const OrdersSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#3a6ea5" }}
      className="p-10 shadow rounded-xl m-10"
      dir="rtl"
    >
      <h3 className="text-2xl text-white font-bold mb-4">سفارشات من</h3>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="border-b py-4 last:border-none">
              <p>
                <strong>شماره سفارش:</strong> {order.id}
              </p>
              <p>
                <strong>وضعیت:</strong> {order.status}
              </p>
              <p>
                <strong>مجموع:</strong> ${order.total}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>شما سفارشی ندارید.</p>
      )}
    </motion.div>
  );

  const SettingsSection = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ backgroundColor: "#3a6ea5" }}
      dir="rtl"
      className="p-6 m-10 rounded-xl shadow-lg"
    >
      <h3 className="text-2xl text-white font-bold mb-4">پیگیری سفارشات</h3>
      <p className="mb-4" style={{ color: "#ffffff" }}>
        لطفا شماره سفارش خود را وارد کنید تا اطلاعات سفارش را دریافت کنید.
      </p>
      <input
        type="text"
        placeholder="شماره سفارش"
        className="border rounded p-2 w-full mb-4 focus:ring-2 focus:outline-none"
        style={{
          borderColor: "#004e98",
          outlineColor: "none",
          color: "#004e98",
        }}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-4 py-2 rounded shadow"
        style={{
          backgroundColor: "#004e98",
          color: "#fff",
          transition: "all 0.2s ease-in-out",
        }}
      >
        پیگیری سفارش
      </motion.button>
    </motion.div>
  );

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 w-full bg-gray-100 min-h-screen">
        {activeSection === "profile" && <ProfileSection />}
        {activeSection === "orders" && <OrdersSection />}
        {activeSection === "settings" && <SettingsSection />}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">آیا مطمئن هستید؟</h2>
            <p className="mb-4">آیا می‌خواهید از حساب کاربری خود خارج شوید؟</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 text-gray-600 border border-gray-300 rounded"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-white bg-red-500 rounded"
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
