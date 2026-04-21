package com.smartcampus.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(new InternetAddress(senderEmail, "SmartCampus"));
            helper.setTo(toEmail);
            helper.setSubject("Welcome to SmartCampus – Your Account is Ready!");
            helper.setText(buildWelcomeHtml(name, toEmail), true);

            mailSender.send(message);
            System.out.println("[EmailService] Welcome email sent successfully to: " + toEmail);

        } catch (MessagingException | UnsupportedEncodingException e) {
            System.err.println("[EmailService] MIME error sending to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        } catch (MailException e) {
            System.err.println("[EmailService] SMTP error sending to " + toEmail + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildWelcomeHtml(String name, String email) {
        String safeUrl = frontendUrl;
        return "<!DOCTYPE html>" +
            "<html lang=\"en\">" +
            "<head>" +
            "<meta charset=\"UTF-8\" />" +
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"/>" +
            "<title>Welcome to SmartCampus</title>" +
            "</head>" +
            "<body style=\"margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Arial,sans-serif;\">" +

            "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:#0f172a;padding:40px 16px;\">" +
            "<tr><td align=\"center\">" +
            "<table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:600px;width:100%;\">" +

            // ── Header ──
            "<tr>" +
            "<td style=\"background:#1d4ed8;border-radius:16px 16px 0 0;padding:48px 40px 36px;text-align:center;\">" +
            "<div style=\"display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 24px;margin-bottom:20px;\">" +
            "<span style=\"color:#ffffff;font-size:22px;font-weight:900;letter-spacing:3px;\">SMART CAMPUS</span>" +
            "</div>" +
            "<h1 style=\"margin:0 0 8px;color:#ffffff;font-size:30px;font-weight:800;\">Welcome aboard,</h1>" +
            "<h2 style=\"margin:0;color:#bfdbfe;font-size:26px;font-weight:700;\">" + escapeHtml(name) + "!</h2>" +
            "</td>" +
            "</tr>" +

            // ── Intro ──
            "<tr>" +
            "<td style=\"background:#1e293b;padding:32px 40px 24px;\">" +
            "<p style=\"margin:0 0 14px;color:#cbd5e1;font-size:16px;line-height:1.7;\">" +
            "Your SmartCampus account has been successfully created. You are registered as a " +
            "<strong style=\"color:#60a5fa;\">Student</strong> on the platform." +
            "</p>" +
            "<p style=\"margin:0;color:#94a3b8;font-size:15px;\">Registered email: " +
            "<strong style=\"color:#e2e8f0;\">" + escapeHtml(email) + "</strong></p>" +
            "</td>" +
            "</tr>" +

            divider() +

            // ── About ──
            "<tr>" +
            "<td style=\"background:#1e293b;padding:24px 40px;\">" +
            "<h3 style=\"margin:0 0 12px;color:#ffffff;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:2px;\">About SmartCampus</h3>" +
            "<p style=\"margin:0;color:#94a3b8;font-size:14px;line-height:1.8;\">" +
            "SmartCampus is a unified digital platform for students, lecturers, and campus staff. " +
            "It brings together session booking, facility management, support tickets, and real-time " +
            "notifications — so you can focus on learning, not logistics." +
            "</p>" +
            "</td>" +
            "</tr>" +

            divider() +

            // ── Navigation ──
            "<tr>" +
            "<td style=\"background:#1e293b;padding:24px 40px;\">" +
            "<h3 style=\"margin:0 0 18px;color:#ffffff;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:2px;\">Platform Navigation</h3>" +
            navCard("#60a5fa", "Study Sessions",
                "Browse all approved study sessions across campus facilities. Register for sessions that fit your schedule — seats fill up fast.") +
            navCard("#818cf8", "Support Tickets",
                "Raise a ticket for any campus issue — broken equipment, room problems, or IT. Track every update in real time.") +
            navCard("#34d399", "Live Notifications",
                "The bell icon in the navbar shows real-time alerts for session approvals, ticket replies, and campus activity.") +
            navCard("#f59e0b", "My Profile",
                "Update your name, profile picture, and personal details from the Profile page in the top navigation.") +
            "</td>" +
            "</tr>" +

            divider() +

            // ── Guidelines ──
            "<tr>" +
            "<td style=\"background:#1e293b;padding:24px 40px;\">" +
            "<h3 style=\"margin:0 0 18px;color:#ffffff;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:2px;\">Student Guidelines</h3>" +
            guideRow("01", "Browsing Sessions",
                "Go to Sessions in the navbar to see all approved sessions. Each card shows facility, date, time, and available seats.") +
            guideRow("02", "Registering for a Session",
                "Click Register on any session card. Once a session is full, registration closes automatically.") +
            guideRow("03", "Raising a Support Ticket",
                "Navigate to Tickets and click New Ticket. Describe the issue — an admin will respond and you will be notified.") +
            guideRow("04", "Staying Informed",
                "Watch the bell icon — it lights up whenever something needs your attention. Click any notification to jump to the page.") +
            "</td>" +
            "</tr>" +

            divider() +

            // ── Booking Rules ──
            "<tr>" +
            "<td style=\"background:#1e293b;padding:24px 40px;\">" +
            "<h3 style=\"margin:0 0 14px;color:#ffffff;font-size:16px;font-weight:700;text-transform:uppercase;letter-spacing:2px;\">Booking Rules</h3>" +
            "<ul style=\"margin:0;padding-left:20px;color:#94a3b8;font-size:14px;line-height:2.2;\">" +
            "<li>Weekday sessions: <strong style=\"color:#e2e8f0;\">8:00 AM – 5:00 PM</strong></li>" +
            "<li>Weekend sessions: <strong style=\"color:#e2e8f0;\">8:00 AM – 8:00 PM</strong></li>" +
            "<li>All slots are in <strong style=\"color:#e2e8f0;\">30-minute increments</strong></li>" +
            "<li>Sessions require <strong style=\"color:#e2e8f0;\">admin approval</strong> before appearing to students</li>" +
            "<li>Each facility has a <strong style=\"color:#e2e8f0;\">fixed seat capacity</strong> — register early</li>" +
            "</ul>" +
            "</td>" +
            "</tr>" +

            // ── CTA ──
            "<tr>" +
            "<td style=\"background:#1e293b;padding:8px 40px 40px;text-align:center;\">" +
            "<a href=\"" + safeUrl + "\" " +
            "style=\"display:inline-block;background:#2563eb;color:#ffffff;font-size:14px;font-weight:800;" +
            "text-decoration:none;padding:16px 44px;border-radius:50px;letter-spacing:2px;text-transform:uppercase;\">" +
            "Go to SmartCampus &rarr;" +
            "</a>" +
            "</td>" +
            "</tr>" +

            // ── Footer ──
            "<tr>" +
            "<td style=\"background:#0f172a;border-radius:0 0 16px 16px;padding:28px 40px;text-align:center;\">" +
            "<p style=\"margin:0 0 8px;color:#475569;font-size:13px;\">SmartCampus Operation Hub &middot; Megabyte Crew</p>" +
            "<p style=\"margin:0;color:#334155;font-size:12px;\">" +
            "You received this email because you created an account on SmartCampus.<br/>" +
            "If this wasn't you, please contact your campus administrator immediately." +
            "</p>" +
            "</td>" +
            "</tr>" +

            "</table>" +
            "</td></tr>" +
            "</table>" +
            "</body>" +
            "</html>";
    }

    private String divider() {
        return "<tr><td style=\"background:#1e293b;padding:0 40px;\">" +
               "<div style=\"height:1px;background:#334155;\"></div></td></tr>";
    }

    private String navCard(String color, String title, String desc) {
        return "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:12px;\">" +
               "<tr><td style=\"background:#0f172a;border:1px solid #334155;border-radius:10px;padding:14px 18px;\">" +
               "<p style=\"margin:0 0 5px;color:" + color + ";font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;\">" + title + "</p>" +
               "<p style=\"margin:0;color:#94a3b8;font-size:13px;line-height:1.6;\">" + desc + "</p>" +
               "</td></tr></table>";
    }

    private String guideRow(String num, String title, String desc) {
        return "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-bottom:12px;\">" +
               "<tr>" +
               "<td style=\"vertical-align:top;width:36px;padding-top:2px;\">" +
               "<span style=\"color:#2563eb;font-size:16px;font-weight:900;\">" + num + "</span>" +
               "</td>" +
               "<td style=\"padding-left:12px;\">" +
               "<p style=\"margin:0 0 4px;color:#e2e8f0;font-size:14px;font-weight:700;\">" + title + "</p>" +
               "<p style=\"margin:0;color:#94a3b8;font-size:13px;line-height:1.6;\">" + desc + "</p>" +
               "</td>" +
               "</tr></table>";
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
