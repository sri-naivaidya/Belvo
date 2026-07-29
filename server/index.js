import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import multer from "multer";
import nodemailer from "nodemailer";
import { TOOLS_CATALOG } from "./data/tools.js";
import { authenticateToken, getJWTSecret, authLimiter, otpLimiter } from "./middleware/auth.js";
import { supabase, isDbReady } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Multer setup for image uploads ─────────────────────
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `member-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── Admin credentials ─────────────────────────────────
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// ── In-memory stores for intern OTP + checklist ───────
const otpStore = new Map();       // email → { otp, expiresAt }
const checklistStore = new Map(); // email → { watchedLms, offerLetter, idCard }

// ── Nodemailer config (reused from api/register.js) ───
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const HR_EMAIL = process.env.HR_EMAIL;

const emailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// ── Auth Routes ────────────────────────────────────────
app.post("/admin/login", authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { username, role: "admin" },
      getJWTSecret(),
      { expiresIn: "7d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ── Intern OTP Auth Routes ───────────────────────────

const ALLOWED_INTERN_EMAIL = process.env.ALLOWED_INTERN_EMAIL;

// POST /intern/send-otp — Generate and send OTP to email
app.post("/intern/send-otp", otpLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    if (email.toLowerCase() !== ALLOWED_INTERN_EMAIL) {
      return res.status(403).json({ success: false, message: "This email is not authorized for intern access" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 60000; // 60 seconds

    // Store OTP
    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    // Send OTP email
    await emailTransporter.sendMail({
      from: `"BELVO Intern Portal" <${SMTP_USER}>`,
      to: email,
      subject: "Your BELVO Verification Code",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #7B2FBE, #9D4EDD); padding: 32px 28px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 22px;">Verification Code</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.75); font-size: 13px;">BELVO Intern Portal</p>
          </div>
          <div style="padding: 32px; text-align: center;">
            <p style="color: #555; font-size: 14px; margin: 0 0 16px;">Your 6-digit verification code is:</p>
            <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #7B2FBE; padding: 16px; background: #f5f0ff; border-radius: 12px; margin: 0 0 16px;">${otp}</div>
            <p style="color: #999; font-size: 12px; margin: 0;">This code expires in 1 minute.</p>
            <p style="color: #999; font-size: 12px; margin: 8px 0 0;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="text-align: center; padding: 16px; background: #fafafa; font-size: 12px; color: #aaa;">BELVO — belvo.buzz</div>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
  }
});

// POST /intern/verify-otp — Verify OTP and return JWT
app.post("/intern/verify-otp", otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
      return res.status(400).json({ success: false, message: "No OTP found. Please request a new one." });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (stored.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
    }

    // OTP valid — delete from store and issue JWT
    otpStore.delete(email.toLowerCase());
    checklistStore.delete(email.toLowerCase());

    const token = jwt.sign(
      { email: email.toLowerCase(), role: "intern" },
      getJWTSecret(),
      { expiresIn: "7d" }
    );

    res.json({ success: true, token, email: email.toLowerCase() });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /intern/submit-offer-letter — Send offer letter request to HR
app.post("/intern/submit-offer-letter", async (req, res) => {
  try {
    const { email, name, age, aadharNumber, designation, tenure, address } = req.body;

    if (!email || !name || !age || !aadharNumber || !designation || !tenure || !address) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Send to HR
    await emailTransporter.sendMail({
      from: `"BELVO Intern Portal" <${SMTP_USER}>`,
      to: HR_EMAIL,
      subject: `New Offer Letter Request — ${name}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #7B2FBE, #9D4EDD); padding: 32px 28px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 22px;">New Offer Letter Request</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.75); font-size: 13px;">BELVO Intern Portal</p>
          </div>
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em;">Name</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${name}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Email</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${email}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Age</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${age}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Aadhar Number</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${aadharNumber}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Designation</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${designation}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Tenure</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${tenure}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Address</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${address}</td></tr>
            </table>
          </div>
          <div style="text-align: center; padding: 16px; background: #fafafa; font-size: 12px; color: #aaa;">BELVO — belvo.buzz</div>
        </div>
      `,
    });

    // Mark checklist item complete
    const key = email.toLowerCase();
    const current = checklistStore.get(key) || { watchedLms: false, offerLetter: false, idCard: false, instagram: false, linkedin: false, whatsapp: false, nda: false };
    current.offerLetter = true;
    checklistStore.set(key, current);

    res.json({ success: true, message: "Offer letter request submitted successfully" });
  } catch (err) {
    console.error("Submit offer letter error:", err);
    res.status(500).json({ success: false, message: "Failed to submit request. Please try again." });
  }
});

// POST /intern/submit-id-card — Send ID card request to HR
app.post("/intern/submit-id-card", async (req, res) => {
  try {
    const { email, name, department, photoBase64 } = req.body;

    if (!email || !name || !department) {
      return res.status(400).json({ success: false, message: "Name and department are required" });
    }

    // Build email options
    const mailOptions = {
      from: `"BELVO Intern Portal" <${SMTP_USER}>`,
      to: HR_EMAIL,
      subject: `New ID Card Request — ${name}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #7B2FBE, #9D4EDD); padding: 32px 28px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 22px;">New ID Card Request</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.75); font-size: 13px;">BELVO Intern Portal</p>
          </div>
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em;">Name</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${name}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Email</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${email}</td></tr>
              <tr><td style="padding: 10px 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Department</td></tr>
              <tr><td style="padding: 0 0 16px; font-size: 16px; font-weight: 600; color: #222;">${department}</td></tr>
            </table>
          </div>
          <div style="text-align: center; padding: 16px; background: #fafafa; font-size: 12px; color: #aaa;">BELVO — belvo.buzz</div>
        </div>
      `,
      attachments: [],
    };

    // Attach photo if provided
    if (photoBase64) {
      const matches = photoBase64.match(/^data:(.+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const ext = mimeType.split("/")[1] || "jpg";
        mailOptions.attachments.push({
          filename: `photo-${name.replace(/\s+/g, "-")}.${ext}`,
          content: buffer,
          contentType: mimeType,
        });
      }
    }

    await emailTransporter.sendMail(mailOptions);

    // Mark checklist item complete
    const key = email.toLowerCase();
    const current = checklistStore.get(key) || { watchedLms: false, offerLetter: false, idCard: false, instagram: false, linkedin: false, whatsapp: false, nda: false };
    current.idCard = true;
    checklistStore.set(key, current);

    res.json({ success: true, message: "ID card request submitted successfully" });
  } catch (err) {
    console.error("Submit ID card error:", err);
    res.status(500).json({ success: false, message: "Failed to submit request. Please try again." });
  }
});

// GET /intern/checklist-status — Get checklist completion status
app.get("/intern/checklist-status", (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const status = checklistStore.get(email.toLowerCase()) || {
      watchedLms: false,
      offerLetter: false,
      idCard: false,
      instagram: false,
      linkedin: false,
      whatsapp: false,
      nda: false,
    };

    res.json({ success: true, status });
  } catch (err) {
    console.error("Checklist status error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /intern/submit-nda — Upload signed NDA PDF
app.post("/intern/submit-nda", async (req, res) => {
  try {
    const { email, name, pdfBase64 } = req.body;

    if (!email || !pdfBase64) {
      return res.status(400).json({ success: false, message: "Email and PDF file are required" });
    }

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"BELVO Intern Portal" <${SMTP_USER}>`,
      to: HR_EMAIL,
      subject: `NDA Signed — ${name || email}`,
      html: `<h2>NDA Submission</h2><p><strong>Name:</strong> ${name || "N/A"}</p><p><strong>Email:</strong> ${email}</p>`,
      attachments: [{ filename: `NDA_${(name || email).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`, content: pdfBuffer, contentType: "application/pdf" }],
    });

    const key = email.toLowerCase();
    const current = checklistStore.get(key) || { watchedLms: false, offerLetter: false, idCard: false, instagram: false, linkedin: false, whatsapp: false, nda: false };
    current.nda = true;
    checklistStore.set(key, current);

    res.json({ success: true, message: "NDA submitted successfully" });
  } catch (err) {
    console.error("Submit NDA error:", err);
    res.status(500).json({ success: false, message: "Failed to submit NDA. Please try again." });
  }
});

// POST /intern/mark-checklist — Toggle a checklist item (LMS, Offer Letter, ID Card)
app.post("/intern/mark-checklist", (req, res) => {
  try {
    const { email, item } = req.body;

    if (!email || !item) {
      return res.status(400).json({ success: false, message: "Email and item are required" });
    }

    const validItems = ["watchedLms", "offerLetter", "idCard"];
    if (!validItems.includes(item)) {
      return res.status(400).json({ success: false, message: "Invalid checklist item" });
    }

    const key = email.toLowerCase();
    const current = checklistStore.get(key) || { watchedLms: false, offerLetter: false, idCard: false, instagram: false, linkedin: false, whatsapp: false, nda: false };
    current[item] = !current[item];
    checklistStore.set(key, current);

    res.json({ success: true, message: "Item updated", value: current[item] });
  } catch (err) {
    console.error("Mark checklist error:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// POST /intern/mark-social — Mark a social checklist item as done
app.post("/intern/mark-social", (req, res) => {
  try {
    const { email, item } = req.body;

    if (!email || !item) {
      return res.status(400).json({ success: false, message: "Email and item are required" });
    }

    const validItems = ["instagram", "linkedin", "whatsapp"];
    if (!validItems.includes(item)) {
      return res.status(400).json({ success: false, message: "Invalid social item" });
    }

    const key = email.toLowerCase();
    const current = checklistStore.get(key) || { watchedLms: false, offerLetter: false, idCard: false, instagram: false, linkedin: false, whatsapp: false, nda: false };
    current[item] = true;
    checklistStore.set(key, current);

    res.json({ success: true, message: "Item marked as complete" });
  } catch (err) {
    console.error("Mark social error:", err);
    res.status(500).json({ success: false, message: "Failed to update status" });
  }
});

// POST /intern/submit-onboarding — Send comprehensive summary to HR
app.post("/intern/submit-onboarding", async (req, res) => {
  try {
    const { email, offerLetter, idCard, nda, social } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const socialChecked = [];
    if (social?.instagram) socialChecked.push("Instagram");
    if (social?.linkedin) socialChecked.push("LinkedIn");
    if (social?.whatsapp) socialChecked.push("WhatsApp Community");

    const checklistItems = [];
    if (offerLetter) checklistItems.push("Offer Letter Request");
    if (idCard) checklistItems.push("ID Card Request");
    if (nda) checklistItems.push("NDA Signed");

    await emailTransporter.sendMail({
      from: `"BELVO Intern Portal" <${SMTP_USER}>`,
      to: HR_EMAIL,
      subject: `Onboarding Complete — ${offerLetter?.name || email}`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #7B2FBE, #9D4EDD); padding: 32px 28px; text-align: center;">
            <h1 style="margin: 0; color: #fff; font-size: 22px;">Onboarding Completed</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.75); font-size: 13px;">BELVO Intern Portal</p>
          </div>
          <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              ${offerLetter ? `
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Email</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${email}</td></tr>
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Full Name</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${offerLetter.name}</td></tr>
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Age</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${offerLetter.age}</td></tr>
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Aadhar Number</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${offerLetter.aadharNumber}</td></tr>
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Designation</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${offerLetter.designation}</td></tr>
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Tenure</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${offerLetter.tenure}</td></tr>
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Address</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${offerLetter.address}</td></tr>
              ` : ''}
              ${idCard ? `
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">ID Card Name</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${idCard.name}</td></tr>
                <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">ID Card Department</td></tr>
                <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${idCard.department}</td></tr>
              ` : ''}
              <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Checklist Completed</td></tr>
              <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${checklistItems.length > 0 ? checklistItems.join(" ✅<br>") + " ✅" : "None"}</td></tr>
              <tr><td style="padding: 10px 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; border-top: 1px solid #eee;">Social Media Followed</td></tr>
              <tr><td style="padding: 0 0 12px; font-size: 15px; color: #222;">${socialChecked.length > 0 ? socialChecked.join(" ✅<br>") + " ✅" : "None"}</td></tr>
            </table>
          </div>
          <div style="text-align: center; padding: 16px; background: #fafafa; font-size: 12px; color: #aaa;">BELVO — belvo.buzz</div>
        </div>
      `,
    });

    res.json({ success: true, message: "Onboarding summary sent to HR" });
  } catch (err) {
    console.error("Submit onboarding error:", err);
    res.status(500).json({ success: false, message: "Failed to send summary" });
  }
});

// ── Health Check ───────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    db: isDbReady() ? "connected" : "not configured",
    timestamp: new Date().toISOString(),
  });
});

// ── Team Routes ────────────────────────────────────────

// GET /api/team — List all members
app.get("/api/team", async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;

    res.json({ success: true, members: data });
  } catch (err) {
    console.error("GET /api/team error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch team members" });
  }
});

// ── Tools Registration ──────────────────────────────────
app.post("/api/tools-register", authLimiter, async (req, res) => {
  try {
    const { toolId, name, email, whatsapp } = req.body;

    if (!toolId || !name || !email || !whatsapp) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!isDbReady()) {
      return res.status(500).json({
        success: false,
        message: "Database not configured",
      });
    }

    const selectedTool = TOOLS_CATALOG[toolId];

    if (!selectedTool || !selectedTool.active) {
      return res.status(400).json({
        success: false,
        message: "Invalid or unavailable tool",
      });
    }

    const { data, error } = await supabase
      .from("tool_orders")
      .insert([
        {
          customer_name: name.trim(),
          customer_email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim(),

          tool_name: selectedTool.name,
          plan_name: selectedTool.plan,

          amount: selectedTool.amount,
          currency: selectedTool.currency,

          payment_status: "pending",
          fulfilment_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Registration received",
      order: {
        id: data.id,
        toolId: selectedTool.id,
        toolName: data.tool_name,
        planName: data.plan_name,
        amount: data.amount,
        currency: data.currency,
        paymentStatus: data.payment_status,
        fulfilmentStatus: data.fulfilment_status,
      },
    });
  } catch (err) {
    console.error("POST /api/tools-register error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to save registration",
    });
  }
});

// POST /api/departments — Create a department
app.post("/api/departments", authenticateToken, async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { id, name, color, lightColor, sortOrder } = req.body;

    if (!id || !name) {
      return res.status(400).json({ success: false, message: "ID and name are required" });
    }

    const { data, error } = await supabase
      .from("departments")
      .insert([{
        id,
        name,
        color: color || "#7B2FBE",
        light_color: lightColor || color || "#9D4EDD",
        sort_order: sortOrder || 0,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, department: data });
  } catch (err) {
    console.error("POST /api/departments error:", err);
    res.status(500).json({ success: false, message: "Failed to create department" });
  }
});

// PUT /api/departments/:id — Update a department
app.put("/api/departments/:id", authenticateToken, async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { id } = req.params;
    const { name, color, lightColor, sortOrder } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    if (lightColor !== undefined) updates.light_color = lightColor;
    if (sortOrder !== undefined) updates.sort_order = sortOrder;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("departments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }

    res.json({ success: true, department: data });
  } catch (err) {
    console.error("PUT /api/departments/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to update department" });
  }
});

// DELETE /api/departments/:id — Delete a department
app.delete("/api/departments/:id", authenticateToken, async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.status(500).json({ success: false, message: "Database not configured" });
    }

    const { id } = req.params;

    // Check if department has members
    const { count } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("team_id", id);

    if (count && count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete — ${count} member(s) still in this department`,
      });
    }

    const { error } = await supabase
      .from("departments")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ success: true, message: "Department deleted" });
  } catch (err) {
    console.error("DELETE /api/departments/:id error:", err);
    res.status(500).json({ success: false, message: "Failed to delete department" });
  }
});

// ── Upload Route ───────────────────────────────────────

app.post("/api/upload", authenticateToken, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ success: false, message: "File too large. Max 5MB." });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const url = `/uploads/${req.file.filename}`;
    res.json({ success: true, url });
  });
});

// ── Portal Auth Middleware ──────────────────────────────

function parseCookies(req) {
  const cookieHeader = req.headers?.cookie;
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map(c => {
      const idx = c.indexOf('=');
      if (idx === -1) return [c.trim(), ''];
      return [c.slice(0, idx).trim(), c.slice(idx + 1).trim()];
    })
  );
}

const PORTAL_JWT_SECRET = process.env.AUTH_SECRET || process.env.JWT_SECRET || "portal-dev-secret-change-in-prod";

function authenticatePortal(req, res, next) {
  const cookies = parseCookies(req);
  const token = cookies.belvo_session;
  if (!token) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  try {
    const decoded = jwt.verify(token, PORTAL_JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
}

// ── Portal Auth Routes ─────────────────────────────────
// POST /api/auth/login — Authenticate portal user
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (!isDbReady()) {
      return res.status(503).json({ success: false, message: "Database not configured" });
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase().trim())
      .limit(1);

    if (error) throw error;
    if (!profiles || profiles.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const profile = profiles[0];
    const valid = await bcrypt.compare(password, profile.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: profile.id, email: profile.email, role: profile.role || "client" },
      PORTAL_JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("belvo_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      success: true,
      user: { id: profile.id, email: profile.email, fullName: profile.full_name, role: profile.role || "client" },
    });
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/signup — Create portal account
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    if (!isDbReady()) {
      return res.status(503).json({ success: false, message: "Database not configured" });
    }

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .limit(1);

    if (existing && existing.length > 0) {
      return res.status(409).json({ success: false, message: "An account with this email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { data: profile, error } = await supabase
      .from("profiles")
      .insert([{
        email: email.toLowerCase().trim(),
        full_name: fullName || null,
        password_hash,
        role: "client",
      }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { userId: profile.id, email: profile.email, role: profile.role },
      PORTAL_JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("belvo_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      success: true,
      user: { id: profile.id, email: profile.email, fullName: profile.full_name, role: profile.role },
    });
  } catch (err) {
    console.error("POST /api/auth/signup error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST /api/auth/logout — Clear session
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("belvo_session", {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Signed out" });
});

// GET /api/auth/me — Current user
app.get("/api/auth/me", authenticatePortal, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.userId,
      email: req.user.email,
      fullName: req.user.fullName || null,
      role: req.user.role,
    },
  });
});

// GET /api/client/dashboard — Client dashboard data
app.get("/api/client/dashboard", authenticatePortal, async (req, res) => {
  try {
    if (req.user.role !== "client") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!isDbReady()) {
      return res.status(503).json({ success: false, message: "Database not configured" });
    }

    const clientId = req.user.userId;

    const { data: payments } = await supabase
      .from("payments")
      .select("*")
      .eq("client_id", clientId);

    const { data: timelineEvents } = await supabase
      .from("timeline_events")
      .select("*")
      .eq("client_id", clientId)
      .eq("visible_to_client", true)
      .order("event_date", { ascending: false })
      .limit(5);

    const paid = payments?.filter(p => p.status === "paid").length || 0;
    const pending = payments?.filter(p => p.status === "pending").length || 0;
    const overdue = payments?.filter(p => p.status === "overdue").length || 0;
    const cancelled = payments?.filter(p => p.status === "cancelled").length || 0;
    const outstandingAmount = payments?.filter(p => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

    const upcoming = timelineEvents?.filter(e => e.status === "upcoming").length || 0;
    const completed = timelineEvents?.filter(e => e.status === "completed").length || 0;

    res.json({
      success: true,
      payments: {
        total: payments?.length || 0,
        paid,
        pending,
        overdue,
        cancelled,
        outstandingAmount,
      },
      timeline: {
        totalVisible: timelineEvents?.length || 0,
        upcoming,
        completed,
        recent: (timelineEvents || []).map(e => ({
          id: e.id,
          title: e.title,
          description: e.description || null,
          type: e.type,
          eventDate: e.event_date,
        })),
      },
    });
  } catch (err) {
    console.error("GET /api/client/dashboard error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ── Error handling ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✦ BELVO API server running on http://localhost:${PORT}`);
  console.log(`  ✦ Database: ${isDbReady() ? "✅ Connected" : "⚠️  Not configured (set Supabase env vars)"}`);
  console.log(`  ✦ Health:   http://localhost:${PORT}/api/health\n`);
});
