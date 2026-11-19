import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:4000/api/account/tx";

export default function FirmwareEmulator() {
  // ---- UI STATE ----
  const [open, setOpen] = useState(true);
  const [pos, setPos] = useState({ x: 40, y: 40 });
  const dragRef = useRef(null);
  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  // ---- DEVICE STATE ----
  const [screen, setScreen] = useState("menu");
  const [cursor, setCursor] = useState(0);
  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [transactionType, setTransactionType] = useState("");
  const [deviceId] = useState("9913804724");
//   5308649416

  // ---- OFFLINE SIM ----
  const [online, setOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState([]);

  // ---- DRAG LOGIC ----
  const startDrag = (e) => {
    e.preventDefault();
    isDragging.current = true;
    offset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    document.body.style.userSelect = "none";
  };

  const stopDrag = () => (isDragging.current = false);

  const onDrag = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", onDrag, { passive: false });
    window.addEventListener("mouseup", stopDrag);

    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, []);

  // ---- API POST ----
  async function sendToServer(body) {
    if (!online) {
      setOfflineQueue((q) => [...q, body]);
      return { statuscode: 400, message: "Offline Mode" };
    }

    try {
      const res = await axios.post(API_URL, body);
      return res.data;
    } catch (e) {
      return { statuscode: 400, message: "Network Error", error: `error: ${e.message}`};
    }
  }

  // ---- SYNC OFFLINE ----
  useEffect(() => {
    if (online && offlineQueue.length > 0) {
      const sync = async () => {
        for (const tx of offlineQueue) await sendToServer(tx);
        setOfflineQueue([]);
      };
      sync();
    }
  }, [online]);

  // ---- SIM NFC TAG ----
  function simulateCardTap() {
    if (!amount || !transactionType) return alert("Enter amount first");

    const card = prompt("Enter card number to simulate NFC tap:");
    if (!card) return;

    setCardNumber(card);
    setScreen("processing");

    const body = {
      uid: card,
      amount: parseFloat(amount),
      transactionType,
      deviceId,
    };

    sendToServer(body).then((res) => {
      setScreen("result");
      setResult(res);
    });
  }

  const [result, setResult] = useState(null);

  // ---- UI COMPONENT ----
  if (!open)
    return (
      <div
        onMouseDown={startDrag}
        style={{
          position: "fixed",
          top: pos.y,
          left: pos.x,
          padding: "10px",
          background: "#111",
          color: "#fff",
          borderRadius: 8,
          cursor: "grab",
        }}
      >
        <button onClick={() => setOpen(true)} style={{ color: "white" }}>
          Open Emulator
        </button>
      </div>
    );

  return (
    <div
      style={{
        position: "fixed",
        top: pos.y,
        left: pos.x,
        width: 300,
        padding: 10,
        background: "#222",
        color: "white",
        borderRadius: 10,
        boxShadow: "0 0 10px #0005",
        fontFamily: "monospace",
        zIndex: 99999,
      }}
    >
      {/* ------- HEADER ------- */}
      <div
        onMouseDown={startDrag}
        style={{
          background: "#000",
          padding: "5px 10px",
          borderRadius: 6,
          cursor: "grab",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>NFC Terminal Emulator</span>
        <button
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => setOpen(false)}
        >
          —
        </button>
      </div>

      {/* ------- LCD AREA ------- */}
      <div
        style={{
          background: "#0f0",
          color: "#000",
          padding: 10,
          borderRadius: 6,
          marginTop: 10,
          minHeight: 80,
          fontSize: 14,
          whiteSpace: "pre-line",
        }}
      >
        {screen === "menu" && (
          <>
            {'  '}MAKE PAYMENT{"\n"}
            {'  '}RECEIVE PAYMENT{"\n"}
            {'  '}CHECK BALANCE
          </>
        )}

        {screen === "amount" && (
          <>Enter Amount: {amount || "____"}</>
        )}

        {screen === "tap" && (
          <>Amount: #{amount}\nTap Card...</>
        )}

        {screen === "processing" && <>PROCESSING...</>}

        {screen === "result" && (
          <>
            Status: {result?.statuscode}{"\n"}
            {result?.message}
          </>
        )}
      </div>

      {/* ------- BUTTONS ------- */}
      <div style={{ marginTop: 10 }}>
        {screen === "menu" && (
          <>
            <button onClick={() => { setTransactionType("make"); setScreen("amount"); }} className="btn">Make</button>
            <button onClick={() => { setTransactionType("receive"); setScreen("amount"); }} className="btn">Receive</button>
          </>
        )}

        {screen === "amount" && (
          <>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: "100%", padding: 5, borderRadius: 4 }}
            />
            <button
              onClick={() => setScreen("tap")}
              style={{ width: "100%", marginTop: 5 }}
            >
              Continue
            </button>
          </>
        )}

        {screen === "tap" && (
          <button
            onClick={simulateCardTap}
            style={{ width: "100%" }}
          >
            Simulate Card Tap
          </button>
        )}

        {screen === "result" && (
          <button style={{ width: "100%" }} onClick={() => setScreen("menu")}>
            Back to Menu
          </button>
        )}

        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={online}
              onChange={(e) => setOnline(e.target.checked)}
            />{" "}
            Online Mode
          </label>
        </div>
      </div>
    </div>
  );
}
