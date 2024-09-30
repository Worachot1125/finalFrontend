// src/app/page.tsx
"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@mui/material";
import TransactionManager from "./creditList/page"; // นำเข้าคอมโพเนนต์
import styles from "./page.module.css";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);
  if (session) {
    return (
      <>
        <div className={styles.page}>HomePage</div>
        <Button variant="contained" onClick={() => signOut()}>
          Logout
        </Button>
        <TransactionManager /> {/* แสดงคอมโพเนนต์การจัดการบัญชี */}
      </>
    );
  } else {
    return (
      <div className={styles.page}>
        <h1>ระบบบัญชีรายรับรายจ่าย</h1>
        <Button variant="contained" href="/signin">
          Login
        </Button>
      </div>
    );
  }
}
