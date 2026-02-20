<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>OTP Verification</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:24px 0;">
    <tr>
        <td align="center">
            <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;padding:24px;">
                <tr>
                    <td>
                        <h2 style="margin:0 0 10px 0;color:#1f2d6e;">Alpine Tasker OTP Verification</h2>
                        <p style="margin:0 0 12px 0;color:#334155;font-size:14px;line-height:1.5;">
                            Use the OTP below to complete your {{ $purpose === 'login' ? 'login' : 'account verification' }}.
                        </p>
                        <div style="display:inline-block;padding:12px 18px;border-radius:10px;background:#1e2756;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:4px;">
                            {{ $otp }}
                        </div>
                        <p style="margin:14px 0 0 0;color:#64748b;font-size:12px;">
                            This code expires in 10 minutes. Do not share this code with anyone.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>

