<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AuthOtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $otp,
        public string $purpose
    ) {
    }

    public function envelope(): Envelope
    {
        $subject = $this->purpose === 'login'
            ? 'Your Login OTP Code'
            : 'Verify Your Account OTP Code';

        return new Envelope(
            subject: $subject
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.auth-otp'
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

