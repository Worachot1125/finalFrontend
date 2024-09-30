// src/app/signup.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ทำการสมัครสมาชิกที่นี่ (API หรืออื่น ๆ)
    // สมมุติว่าการสมัครสมาชิกสำเร็จ
    router.push("/signin"); // เปลี่ยนเส้นทางไปยังหน้าเข้าสู่ระบบ
  };

  return (
    <div>
      <h1>ลงทะเบียน</h1>
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
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">ลงทะเบียน</button>
      </form>
    </div>
  );
};

export default SignUp;
