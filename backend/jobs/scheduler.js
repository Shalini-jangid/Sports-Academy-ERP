// jobs/scheduler.js
import cron from "node-cron";
import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { sendSMS } from "../utils/sms.js";
import { sendMail } from "../utils/mailer.js";

/**
 * Cron job: run every hour to find pending leaves older than 24 hours and notify coach/parent
 * and weekly attendance summary every Monday 07:00
 */
export const startJobs = () => {
  // run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const pending = await Leave.find({ status: "pending", createdAt: { $lte: twentyFourHoursAgo } }).populate("student");
      for (const leave of pending) {
        const coaches = await User.find({ role: "coach", sport: leave.student.sport });
        const notifyMsg = `Reminder: Leave request for ${leave.student.name} is still pending. Please act.`;
        for (const c of coaches) {
          if (c.phone) sendSMS(c.phone, notifyMsg);
          sendMail({ to: c.email, subject: "Pending Leave Reminder", text: notifyMsg }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Scheduler error:", err);
    }
  });

  // weekly report: every Monday at 7:00
  cron.schedule("0 7 * * 1", async () => {
    try {
      // produce a simple report: number of leaves and absences in last 7 days per sport/coach
      // For demo: notify all coaches
      const coaches = await User.find({ role: "coach" });
      for (const c of coaches) {
        const msg = `Weekly attendance report available in the dashboard.`;
        if (c.phone) sendSMS(c.phone, msg);
        sendMail({ to: c.email, subject: "Weekly Attendance Report", text: msg }).catch(() => {});
      }
    } catch (err) {
      console.error("Weekly job error:", err);
    }
  });

  console.log("✅ Scheduled jobs started");
};
