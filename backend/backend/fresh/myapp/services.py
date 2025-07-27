import requests
import os
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

class EmailService:
    def __init__(self):
        # Email configuration from Django settings
        self.from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@farmerconnect.com')
        
    def send_otp(self, email, otp_code, purpose='login'):
        """
        Send OTP via Email
        Args:
            email: Recipient's email address
            otp_code: 6-digit OTP code
            purpose: 'login' or 'registration'
        """
        try:
            # Create subject and message based on purpose
            if purpose == 'registration':
                subject = 'Welcome to Farmer Connect - Verify Your Email'
                message = f"""
Welcome to Farmer Connect!

Your email verification code is: {otp_code}

This code is valid for 10 minutes. Please do not share this code with anyone.

If you didn't request this verification, please ignore this email.

Best regards,
Farmer Connect Team
                """
            else:  # login
                subject = 'Farmer Connect - Login Verification Code'
                message = f"""
Hello,

Your login verification code is: {otp_code}

This code is valid for 10 minutes. Please do not share this code with anyone.

If you didn't request this login, please secure your account immediately.

Best regards,
Farmer Connect Team
                """
            
            # Send email
            send_mail(
                subject=subject,
                message=message,
                from_email=self.from_email,
                recipient_list=[email],
                fail_silently=False,
            )
            
            print(f"✅ Email OTP sent successfully to {email}")
            print(f"🎯 Purpose: {purpose}")
            print(f"📧 OTP Code: {otp_code}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending email: {e}")
            # Fallback to console output for development
            print(f"📧 Email OTP for {email}: {otp_code} (Purpose: {purpose})")
            print("⚠️  Note: Configure email settings in Django to send actual emails")
            return True
    
    def send_welcome_email(self, email, username):
        """
        Send welcome email after successful registration
        """
        try:
            subject = 'Welcome to Farmer Connect!'
            message = f"""
Dear {username},

Welcome to Farmer Connect! 🎉

Your account has been created successfully. You can now:
- Browse fresh products from local suppliers
- Add items to your cart
- Place orders with trusted vendors
- Track your deliveries

Start exploring: http://localhost:3001/shop

Thank you for joining our community of farmers and vendors!

Best regards,
The Farmer Connect Team
            """
            
            send_mail(
                subject=subject,
                message=message,
                from_email=self.from_email,
                recipient_list=[email],
                fail_silently=False,
            )
            
            print(f"✅ Welcome email sent to {email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending welcome email: {e}")
            print(f"📧 Welcome message for {email}: Welcome {username} to Farmer Connect!")
            return False
    
    def verify_otp(self, email, otp_code):
        """
        Verify OTP (this would typically be handled by the email service)
        For now, we'll just return True as verification is done in the OTP model
        """
        return True