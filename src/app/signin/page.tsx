// src/app/signin.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ตรวจสอบข้อมูลการเข้าสู่ระบบที่นี่ (API หรืออื่น ๆ)
    // สมมุติว่าการเข้าสู่ระบบสำเร็จ
    router.push("/creditList"); // เปลี่ยนเส้นทางไปยัง TransactionManager
  };

  return (
    <div>
      <h1>เข้าสู่ระบบ</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="รหัสผ่าน (1234)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">เข้าสู่ระบบ</button>
      </form>

      {/* เพิ่มปุ่ม Sign Up */}
      <button onClick={() => router.push("/signup")}>ลงทะเบียน</button>
    </div>
  );
};

export default SignIn;
