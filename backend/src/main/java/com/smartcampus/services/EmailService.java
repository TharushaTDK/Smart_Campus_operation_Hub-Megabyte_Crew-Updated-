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
