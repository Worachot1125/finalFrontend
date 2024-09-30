// src/components/TransactionManager.tsx
"use client";
import React, { useState, useEffect } from "react";
import styles from "../page.module.css";
import { signOut } from "next-auth/react";

interface Transaction {
  _id: string;
  amount: number;
  date: string;
  type: string; // รายรับหรือรายจ่าย
  notes: string;
  userEmail: string; // เพิ่มฟิลด์อีเมลผู้ใช้
}

const TransactionManager = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    date: "",
    type: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null); // สถานะการแก้ไข

  // Fetch all transactions (READ)
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/CRUD", {
        method: "GET",
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  // Create or update transaction
  const saveTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.date || !newTransaction.type) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const method = editingTransactionId ? "PUT" : "POST"; // ใช้ PUT ถ้ามีการแก้ไข
      const res = await fetch("/api/CRUD", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTransaction,
          amount: Number(newTransaction.amount), // แปลงเป็นเลขก่อนส่ง
          id: editingTransactionId, // ถ้ามีการแก้ไข
        }),
      });
      const data = await res.json();
      if (data.success) {
        if (editingTransactionId) {
          // ถ้ามีการแก้ไข
          setTransactions(transactions.map(t => (t._id === editingTransactionId ? data.data : t)));
        } else {
          setTransactions([...transactions, data.data]);
        }
        setNewTransaction({ amount: "", date: "", type: "", notes: "" }); // Reset form
        setEditingTransactionId(null); // ล้างสถานะการแก้ไข
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  // Start editing a transaction
  const editTransaction = (transaction: Transaction) => {
    setNewTransaction({
      amount: transaction.amount.toString(),
      date: transaction.date,
      type: transaction.type,
      notes: transaction.notes,
    });
    setEditingTransactionId(transaction._id); // ตั้งค่า id สำหรับการแก้ไข
  };

  // Delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      const res = await fetch("/api/CRUD", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTransactions(transactions.filter((transaction) => transaction._id !== id));
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Calculate total balance
  const calculateTotalBalance = () => {
    let total = 0;
    transactions.forEach(transaction => {
      if (transaction.type === "income") {
        total += transaction.amount; // เพิ่มสำหรับรายรับ
      } else if (transaction.type === "expense") {
        total -= transaction.amount; // ลดสำหรับรายจ่าย
      }
    });
    return total;
  };

  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className={styles.page}>
      <h1>บัญชีรายรับ รายจ่าย</h1>
      <h2>ยอดเงินคงเหลือ: {calculateTotalBalance()} บาท</h2> {/* แสดงยอดเงินคงเหลือ */}
  
      {/* ปุ่ม Logout */}
      <button className={styles.logoutButton} onClick={() => signOut()}>Logout</button>
  
      {/* Create or edit transaction */}
      <div className={styles.createTransaction}>
        <h2>{editingTransactionId ? "แก้ไขบัญชี" : "สร้างบัญชีรายรับ / รายจ่าย"}</h2>
        <h3>จำนวนเงิน</h3>
        <input
          type="number"
          placeholder="จำนวนเงิน (บาท)"
          value={newTransaction.amount}
          onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
        />
        <h3>วัน/เดือน/ปี</h3>
        <input
          type="date"
          value={newTransaction.date}
          onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
        />
        <select
          value={newTransaction.type}
          onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
        >
          <option value="" disabled>รายรับหรือรายจ่าย</option>
          <option value="income">รายรับ</option>
          <option value="expense">รายจ่าย</option>
        </select>
        <h3>รายละเอียด</h3>
        <textarea
          placeholder="Notes"
          value={newTransaction.notes}
          onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
        />
        <button onClick={saveTransaction}>{editingTransactionId ? "อัปเดตบัญชี" : "สร้างบัญชี"}</button>
      </div>
  
      {/* Display loading state */}
      {loading && <p>Loading...</p>}
  
      {/* Display all transactions */}
      <div className={styles.transactionList}>
        <h2>รายการบัญชี</h2>
        {transactions.length === 0 ? (
          <p>ยังไม่มีบัญชี</p>
        ) : (
          <ul>
            {transactions.map((transaction) => (
              <li key={transaction._id} className={styles.transactionItem}>
                <h3>{transaction.type === "income" ? "รายรับ " : "รายจ่าย "}: ${transaction.amount}</h3>
                <p>วันที่: {new Date(transaction.date).toLocaleDateString()}</p>
                <p>รายละเอียด: {transaction.notes}</p>
                <button className={styles.editButton} onClick={() => editTransaction(transaction)}>แก้ไข</button>
                <button className={styles.deleteButton} onClick={() => deleteTransaction(transaction._id)}>ลบ</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TransactionManager;
