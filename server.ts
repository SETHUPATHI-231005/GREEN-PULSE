import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import { recommendCrop, recommendFertilizer, detectDisease } from "./src/lib/agricultureLogic.ts";

// Note: In a real production app, use process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || "agro-smart-secret-key-123";

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "/tmp"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Auth routes (Mocking DB for auth to keep it simple and focused on features, 
  // but ideally this would hit Firestore)
  // We'll use a simple in-memory store for demo users to ensure it's "fully functional"
  // without needing complex server-side Firebase Admin setup for now.
  const users: any[] = [];

  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, farmDetails } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), name, email, password: hashedPassword, farmDetails };
    users.push(user);
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user.id, name, email, farmDetails } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, farmDetails: user.farmDetails } });
  });

  // Agricultural APIs
  app.post("/api/prediction/crop", (req, res) => {
    const recommendation = recommendCrop(req.body);
    res.json({ recommendation });
  });

  app.post("/api/prediction/fertilizer", (req, res) => {
    const recommendation = recommendFertilizer(req.body);
    res.json({ recommendation });
  });

  app.post("/api/upload-image", upload.single("image"), (req: any, res) => {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    const result = detectDisease(req.file.originalname);
    res.json(result);
  });

  // Mock data for crops and fertilizers for the dashboard
  app.get("/api/crops", (req, res) => {
    res.json([
      { id: 1, cropName: "Paddy (Rice)", season: "Samba", yield: 5.2, soilType: "Alluvial" },
      { id: 2, cropName: "Ragi", season: "Summer", yield: 2.8, soilType: "Red" },
      { id: 3, cropName: "Sugarcane", season: "Annual", yield: 85.0, soilType: "Black" }
    ]);
  });

  app.get("/api/fertilizer", (req, res) => {
    res.json([
      { id: 1, type: "Urea", quantity: 500, crop: "Paddy" },
      { id: 2, type: "NPK 17:17:17", quantity: 250, crop: "Sugarcane" },
      { id: 3, type: "Neem Cake", quantity: 100, crop: "Ragi" }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
