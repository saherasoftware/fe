const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(toEmail, token, serverBaseUrl) {
  const verifyUrl = `${serverBaseUrl}/users/verify/${token}`;
  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '✅ Verify Your ShopEase Account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#f9f9f9;border-radius:10px;">
        <h2 style="color:#1E293B;text-align:center;">Welcome to ShopEase! 🎉</h2>
        <p style="color:#555;font-size:15px;text-align:center;">
          Thanks for signing up. Please verify your email address to activate your account.
        </p>
        <div style="text-align:center;margin:30px 0;">
          <a href="${verifyUrl}"
            style="background:#FF6B35;color:#fff;padding:14px 32px;border-radius:8px;
                   text-decoration:none;font-size:16px;font-weight:bold;">
            Verify Email Address
          </a>
        </div>
        <p style="color:#999;font-size:12px;text-align:center;">
          This link expires in 24 hours. If you didn't create an account, ignore this email.
        </p>
      </div>
    `,
  });
}

async function sendOrderConfirmationEmail(toEmail, order) {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.productName}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${item.price.toFixed(2)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🛍️ Order Confirmed! #${order._id}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#f9f9f9;border-radius:10px;">
        <h2 style="color:#1E293B;text-align:center;">Order Confirmed! 🎉</h2>
        <p style="color:#555;font-size:15px;">
          Hi <strong>${toEmail}</strong>, your order has been placed successfully.
        </p>

        <div style="background:#fff;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:0;color:#777;font-size:13px;">Order ID</p>
          <p style="margin:4px 0 0;font-weight:bold;color:#1E293B;">#${order._id}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#1E293B;color:#fff;">
              <th style="padding:10px;text-align:left;">Product</th>
              <th style="padding:10px;text-align:center;">Qty</th>
              <th style="padding:10px;text-align:right;">Price</th>
              <th style="padding:10px;text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="background:#fff;border-radius:8px;padding:20px;margin:20px 0;">
          <table style="width:100%;">
            <tr>
              <td style="color:#777;">Subtotal</td>
              <td style="text-align:right;">$${order.orderTotal.subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="color:#27ae60;">Discount</td>
              <td style="text-align:right;color:#27ae60;">-$${order.orderTotal.discount.toFixed(2)}</td>
            </tr>
            <tr style="font-weight:bold;font-size:16px;border-top:2px solid #eee;">
              <td style="padding-top:8px;">Total Paid</td>
              <td style="text-align:right;color:#FF6B35;padding-top:8px;">$${order.orderTotal.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="background:#fff;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:0;font-weight:bold;color:#1E293B;">Shipping Address</p>
          <p style="margin:6px 0 0;color:#555;font-size:14px;">
            ${order.shippingAddress.street}, ${order.shippingAddress.city},<br>
            ${order.shippingAddress.state} ${order.shippingAddress.postalCode},<br>
            ${order.shippingAddress.country}
          </p>
        </div>

        <p style="color:#999;font-size:12px;text-align:center;margin-top:20px;">
          Thank you for shopping with ShopEase ❤️
        </p>
      </div>
    `,
  });
}

module.exports = { sendVerificationEmail, sendOrderConfirmationEmail };
