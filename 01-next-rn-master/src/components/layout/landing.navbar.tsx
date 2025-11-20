"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<{ name: string } | null>(null);
    const [reloadFlag, setReloadFlag] = useState(0); // flag để trigger useEffect

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const name = localStorage.getItem("userName");
        if (token && name) {
            setUser({ name });
        } else {
            setUser(null);
        }
    }, [reloadFlag]); // mỗi khi reloadFlag thay đổi, useEffect chạy lại
    //****** */
    useEffect(() => {
        const onLogin = () => {
            const token = localStorage.getItem("authToken");
            const name = localStorage.getItem("userName");
            setUser(token && name ? { name } : null);
        };

        window.addEventListener("login", onLogin);
        return () => window.removeEventListener("login", onLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        setUser(null);
        setReloadFlag((prev) => prev + 1); // trigger re-render
    };

    // Hàm để login xong từ trang khác gọi, update Navbar
    const handleLogin = () => {
        setReloadFlag((prev) => prev + 1);
    };

    return (
        <nav className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
            <div className="container mx-auto flex justify-between items-center px-6 py-4">
                <Link href="/" className="text-2xl font-display font-bold text-[#14532d]">
                    🌱 Agritech
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 text-neutral-700 font-medium">
                    <Link href="#features" className="hover:text-primary transition">Tính năng</Link>
                    <Link href="#testimonials" className="hover:text-primary transition">Phản hồi</Link>
                    <Link href="#footer" className="hover:text-primary transition">Liên hệ</Link>
                    <Link href="#about" className="hover:text-primary transition">Về chúng tôi</Link>
                    <Link href="/users" className="hover:text-primary transition">Người dùng</Link>
                </div>

                {/* Desktop Auth */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-sm font-medium text-neutral-700">👋 Xin chào, {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-gray-50 transition"
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="rounded-full border border-green-600 px-5 py-2 text-sm text-green-700 font-semibold hover:bg-green-50 transition"
                                onClick={handleLogin} // nếu login thành công, gọi handleLogin
                            >
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="btn-primary text-sm">Dùng thử</Link>
                            <Link href="/register/no-hook" className="btn-primary text-sm">Register No Hook</Link>
                            {/* <Link href="/users" className="hover:text-primary transition">Người dùng</Link> */}
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden text-neutral-700" onClick={() => setIsOpen((p) => !p)}>
                    {isOpen ? <CloseOutlined /> : <MenuOutlined />}
                </button>
            </div>

            {/* Mobile dropdown */}
            {isOpen && (
                <div className="md:hidden bg-white shadow-inner px-6 py-4 space-y-4">
                    <Link href="#features" className="block text-neutral-700 hover:text-primary">Tính năng</Link>
                    <Link href="#testimonials" className="block text-neutral-700 hover:text-primary">Phản hồi</Link>
                    <Link href="#footer" className="block text-neutral-700 hover:text-primary">Liên hệ</Link>
                    <Link href="#about" className="block text-neutral-700 hover:text-primary">Về chúng tôi</Link>
                    <Link href="/users" className="hover:text-primary transition">Người dùng</Link>

                    {user ? (
                        <div className="space-y-2">
                            <span className="block text-sm font-medium text-neutral-700">👋 {user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="w-full rounded-full border border-neutral-300 px-5 py-2 text-sm text-neutral-700 hover:bg-gray-50 transition"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                href="/login"
                                className="block w-full rounded-full border border-green-600 px-5 py-2 text-sm text-green-700 font-semibold text-center hover:bg-green-50 transition"
                                onClick={handleLogin} // cập nhật Navbar ngay khi login
                            >
                                Đăng nhập
                            </Link>
                            <Link href="/register" className="btn-primary w-full text-sm text-center block">Dùng thử</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
