package com.smartcampus.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger log = Logger.getLogger(EmailService.class.getName());

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends a notification email when admin/staff replies to a ticket.
     */
    public void sendTicketReplyNotification(String toEmail, String toName,
                                             String ticketId, String ticketSubject,
                                             String replyContent, String replierName) {
        String subject = "Re: [Ticket #" + ticketId.substring(Math.max(0, ticketId.length() - 6)).toUpperCase() + "] " + ticketSubject;

        String body = buildHtml(
            toName,
            "You have a new reply on your support ticket.",
            ticketSubject,
            ticketId,
            buildReplyBlock(replierName, replyContent),
            "#3b82f6",
            "VIEW YOUR TICKET",
            "A member of the Smart Campus support team has responded. Log in to continue the conversation."
        );

        sendHtml(toEmail, subject, body);
    }

    /**
     * Sends a notification email when ticket status changes.
     */
    public void sendTicketStatusNotification(String toEmail, String toName,
                                              String ticketId, String ticketSubject,
                                              String newStatus, String note) {
        String subject = "Ticket Update: [#" + ticketId.substring(Math.max(0, ticketId.length() - 6)).toUpperCase() + "] " + ticketSubject;

        String statusColor = statusColor(newStatus);
        String statusBlock = buildStatusBlock(newStatus, statusColor, note);

        String body = buildHtml(
            toName,
            "Your support ticket status has been updated.",
            ticketSubject,
            ticketId,
            statusBlock,
            statusColor,
            "VIEW YOUR TICKET",
            "The Smart Campus support team has updated your ticket. Log in to see the full details."
        );

        sendHtml(toEmail, subject, body);
    }

    /**
     * Sends a welcome email to a newly registered user.
     */
    public void sendWelcomeEmail(String toEmail, String toName) {
        String subject = "Welcome to Smart Campus Operation Hub!";
        String body = buildWelcomeHtml(toName, toEmail);
        sendHtml(toEmail, subject, body);
    }

    private String buildWelcomeHtml(String toName, String toEmail) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head>"
             + "<body style='margin:0;padding:0;background:#0a0f1c;font-family:Arial,sans-serif'>"
             + "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0a0f1c;padding:40px 20px'><tr><td>"
             + "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px;margin:0 auto'>"

             // Header
             + "<tr><td style='background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);border-radius:16px 16px 0 0;"
             + "padding:40px;text-align:center;border-bottom:1px solid #1e293b'>"
             + "<div style='display:inline-block;background:#3b82f6;border-radius:16px;width:56px;height:56px;"
             + "line-height:56px;text-align:center;font-size:20px;font-weight:900;color:#fff;margin-bottom:16px'>SC</div>"
             + "<p style='margin:0 0 4px;color:#60a5fa;font-size:10px;font-weight:800;letter-spacing:4px;text-transform:uppercase'>Smart Campus · Operation Hub</p>"
             + "<h1 style='margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:900'>Welcome aboard!</h1>"
             + "</td></tr>"

             // Greeting
             + "<tr><td style='background:#131c31;padding:36px 40px 24px'>"
             + "<p style='color:#e2e8f0;font-size:15px;margin:0 0 8px'>Hello, <strong>" + escHtml(toName) + "</strong> 👋</p>"
             + "<p style='color:#94a3b8;font-size:13px;line-height:1.7;margin:0 0 24px'>"
             + "Your account has been successfully created with the email <strong style='color:#60a5fa'>" + escHtml(toEmail) + "</strong>. "
             + "You now have access to the Smart Campus Operation Hub — your all-in-one platform for managing campus life.</p>"

             // Feature cards
             + "<p style='color:#64748b;font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;margin:0 0 14px'>What you can do</p>"
             + "<table width='100%' cellpadding='0' cellspacing='0'>"
             + featureRow("🏫", "Book Study Sessions", "Browse approved sessions, register with one click, and generate your personal QR attendance code.")
             + featureRow("🔧", "Submit Maintenance Tickets", "Report facility issues — hardware, software, or general — and track status updates in real time.")
             + featureRow("📊", "Real-Time Notifications", "Stay informed instantly whenever your tickets are updated, sessions are approved, or new activity occurs.")
             + featureRow("🏗", "Facility Management", "View available campus facilities, study areas, labs, and equipment — all in one dashboard.")
             + featureRow("📋", "Attendance Tracking", "Lecturers can scan student QR codes to mark attendance; students can view their attendance history.")
             + "</table></td></tr>"

             // Account info box
             + "<tr><td style='background:#131c31;padding:0 40px 28px'>"
             + "<div style='background:#0f172a;border-radius:12px;padding:20px 24px;border:1px solid #1e293b'>"
             + "<p style='color:#64748b;font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px'>Your account details</p>"
             + "<table width='100%' cellpadding='4' cellspacing='0'>"
             + "<tr><td style='color:#94a3b8;font-size:12px;width:100px'>Name</td>"
             + "<td style='color:#e2e8f0;font-size:12px;font-weight:600'>" + escHtml(toName) + "</td></tr>"
             + "<tr><td style='color:#94a3b8;font-size:12px'>Email</td>"
             + "<td style='color:#e2e8f0;font-size:12px;font-weight:600'>" + escHtml(toEmail) + "</td></tr>"
             + "<tr><td style='color:#94a3b8;font-size:12px'>Role</td>"
             + "<td style='color:#e2e8f0;font-size:12px;font-weight:600'>Student (default)</td></tr>"
             + "<tr><td style='color:#94a3b8;font-size:12px'>Status</td>"
             + "<td style='color:#10b981;font-size:12px;font-weight:700'>&#10003; Active</td></tr>"
             + "</table>"
             + "<p style='color:#475569;font-size:11px;margin:12px 0 0'>Your role may be updated by an administrator based on your position.</p>"
             + "</div></td></tr>"

             // CTA
             + "<tr><td style='background:#131c31;padding:0 40px 36px;text-align:center'>"
             + "<a href='http://localhost:5173' style='display:inline-block;background:linear-gradient(135deg,#2563eb,#0ea5e9);"
             + "color:#ffffff;text-decoration:none;font-size:11px;font-weight:800;letter-spacing:3px;"
             + "text-transform:uppercase;padding:14px 40px;border-radius:50px'>"
             + "GO TO SMART CAMPUS</a>"
             + "<p style='color:#475569;font-size:11px;line-height:1.6;margin:20px 0 0'>"
             + "If you did not create this account, please contact the campus administrator immediately.</p>"
             + "</td></tr>"

             // Footer
             + "<tr><td style='background:#0f172a;border-radius:0 0 16px 16px;padding:16px 40px;text-align:center'>"
             + "<p style='margin:0;color:#334155;font-size:10px;letter-spacing:1px'>"
             + "Smart Campus Operation Hub &middot; Automated Notification &middot; Do not reply to this email</p>"
             + "</td></tr>"

             + "</table></td></tr></table></body></html>";
    }

    private String featureRow(String emoji, String title, String description) {
        return "<tr><td style='padding:0 0 12px 0;vertical-align:top'>"
             + "<div style='background:#0f172a;border-radius:10px;padding:14px 16px;display:flex'>"
             + "<table width='100%' cellpadding='0' cellspacing='0'><tr>"
             + "<td style='width:32px;vertical-align:top;padding-top:1px;font-size:18px'>" + emoji + "</td>"
             + "<td style='padding-left:12px;vertical-align:top'>"
             + "<p style='margin:0 0 3px;color:#e2e8f0;font-size:13px;font-weight:700'>" + escHtml(title) + "</p>"
             + "<p style='margin:0;color:#64748b;font-size:11px;line-height:1.6'>" + escHtml(description) + "</p>"
             + "</td></tr></table></div>"
             + "</td></tr>";
    }

    /* ── private helpers ──────────────────────────────────────────── */

    private void sendHtml(String to, String subject, String html) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("tharushatheekshana60@gmail.com", "Smart Campus Support");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(message);
            log.info("Email sent to " + to + " | " + subject);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            log.severe("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    private String buildReplyBlock(String name, String content) {
        return "<div style='background:#1e293b;border-left:4px solid #3b82f6;border-radius:8px;padding:20px 24px;margin:20px 0'>"
             + "<p style='color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px'>Reply from " + escHtml(name) + "</p>"
             + "<p style='color:#e2e8f0;font-size:14px;line-height:1.7;margin:0'>" + escHtml(content) + "</p>"
             + "</div>";
    }

    private String buildStatusBlock(String status, String color, String note) {
        StringBuilder sb = new StringBuilder();
        sb.append("<div style='text-align:center;margin:24px 0'>")
          .append("<span style='display:inline-block;background:").append(color).append("22;color:").append(color)
          .append(";border:1px solid ").append(color).append("55;border-radius:50px;padding:8px 28px;")
          .append("font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase'>")
          .append(escHtml(status)).append("</span></div>");

        if (note != null && !note.isBlank()) {
            sb.append("<div style='background:#1e293b;border-left:4px solid ").append(color)
              .append(";border-radius:8px;padding:16px 20px;margin:16px 0'>")
              .append("<p style='color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px'>Note</p>")
              .append("<p style='color:#e2e8f0;font-size:14px;line-height:1.6;margin:0;font-style:italic'>\"").append(escHtml(note)).append("\"</p>")
              .append("</div>");
        }
        return sb.toString();
    }

    private String buildHtml(String toName, String subtitle, String ticketSubject,
                              String ticketId, String contentBlock, String accentColor,
                              String ctaText, String footerNote) {
        String shortId = ticketId.substring(Math.max(0, ticketId.length() - 6)).toUpperCase();
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'></head><body style='"
             + "margin:0;padding:0;background:#0a0f1c;font-family:Arial,sans-serif'>"
             + "<table width='100%' cellpadding='0' cellspacing='0' style='background:#0a0f1c;padding:40px 20px'><tr><td>"
             + "<table width='100%' cellpadding='0' cellspacing='0' style='max-width:600px;margin:0 auto'>"

             // Header
             + "<tr><td style='background:#131c31;border-radius:16px 16px 0 0;padding:32px 40px;border-bottom:1px solid #1e293b;text-align:center'>"
             + "<p style='margin:0 0 4px;color:" + accentColor + ";font-size:10px;font-weight:800;letter-spacing:4px;text-transform:uppercase'>Smart Campus · Support System</p>"
             + "<h1 style='margin:0;color:#ffffff;font-size:22px;font-weight:900;letter-spacing:-0.5px'>Ticket Notification</h1>"
             + "</td></tr>"

             // Body
             + "<tr><td style='background:#131c31;padding:32px 40px'>"
             + "<p style='color:#94a3b8;font-size:13px;margin:0 0 6px'>Hello, <strong style='color:#e2e8f0'>" + escHtml(toName) + "</strong></p>"
             + "<p style='color:#64748b;font-size:12px;margin:0 0 24px'>" + subtitle + "</p>"

             // Ticket info row
             + "<div style='background:#0f172a;border-radius:10px;padding:14px 20px;margin-bottom:20px;display:flex'>"
             + "<table width='100%' cellpadding='0' cellspacing='0'><tr>"
             + "<td style='color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase'>Ticket</td>"
             + "<td style='color:#64748b;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-align:right'>ID_#" + shortId + "</td>"
             + "</tr><tr>"
             + "<td colspan='2' style='color:#e2e8f0;font-size:14px;font-weight:700;padding-top:6px'>" + escHtml(ticketSubject) + "</td>"
             + "</tr></table></div>"

             // Dynamic content block
             + contentBlock

             // Footer note
             + "<p style='color:#475569;font-size:11px;line-height:1.6;margin:24px 0 0'>" + footerNote + "</p>"
             + "</td></tr>"

             // CTA button
             + "<tr><td style='background:#131c31;padding:0 40px 32px;text-align:center'>"
             + "<a href='http://localhost:5173/tickets' style='display:inline-block;background:" + accentColor
             + ";color:#ffffff;text-decoration:none;font-size:10px;font-weight:800;letter-spacing:3px;"
             + "text-transform:uppercase;padding:14px 36px;border-radius:50px'>" + ctaText + "</a>"
             + "</td></tr>"

             // Bottom bar
             + "<tr><td style='background:#0f172a;border-radius:0 0 16px 16px;padding:16px 40px;text-align:center'>"
             + "<p style='margin:0;color:#334155;font-size:10px;letter-spacing:1px'>Smart Campus Operation Hub · Automated Notification · Do not reply to this email</p>"
             + "</td></tr>"

             + "</table></td></tr></table></body></html>";
    }

    private String statusColor(String status) {
        return switch (status.toUpperCase()) {
            case "IN_PROGRESS" -> "#f59e0b";
            case "RESOLVED"    -> "#10b981";
            case "REJECTED"    -> "#ef4444";
            case "CLOSED"      -> "#64748b";
            default            -> "#3b82f6";
        };
    }

    private String escHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
