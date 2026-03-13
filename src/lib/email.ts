// Email service - Resend kullanarak gerçek email gönderimi

export async function sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
  try {
    // Log to console (works everywhere)
    console.log('⚠️  Email gönderimi (Console modu):');
    console.log('📧 ========================================');
    console.log('📧 ŞİFRE SIFIRLAMA EMAIL\'İ');
    console.log('📧 ========================================');
    console.log(`📧 Alıcı: ${email}`);
    console.log(`📧 Kod: ${code}`);
    console.log('📧 ========================================');
    console.log(`📧 Mesaj:`);
    console.log(`📧 Şifre sıfırlama kodunuz: ${code}`);
    console.log(`📧 Bu kod 15 dakika geçerlidir.`);
    console.log('📧 ========================================\n');

    // Eğer API key varsa gerçek email gönder
    if (process.env.RESEND_API_KEY) {
      try {
        console.log(`📧 Resend ile email gönderiliyor: ${email}`);
        
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        const { data, error } = await resend.emails.send({
      from: 'İmmün Risk AI <noreply@resend.dev>', // Test için resend.dev domain
      to: email,
      subject: 'Şifre Sıfırlama Kodu - İmmün Risk AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .code { font-size: 32px; font-weight: bold; color: #667eea; text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Şifre Sıfırlama</h1>
            </div>
            <div class="content">
              <p>Merhaba,</p>
              <p>İmmün Risk AI sisteminde şifre sıfırlama talebinde bulundunuz.</p>
              <p>Şifrenizi sıfırlamak için aşağıdaki kodu kullanın:</p>
              
              <div class="code">${code}</div>
              
              <p><strong>Bu kod 15 dakika geçerlidir.</strong></p>
              <p>Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
              
              <div class="footer">
                <p>Bu email İmmün Risk AI sistemi tarafından otomatik olarak gönderilmiştir.</p>
                <p>Bu çalışma Dem İlaç'ın koşulsuz eğitim desteği ile hazırlanmıştır.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });

        if (error) {
          console.error('❌ Resend hatası:', error);
        } else {
          console.log('✅ Email başarıyla gönderildi:', data?.id);
        }
      } catch (resendError) {
        console.error('❌ Resend email gönderme hatası:', resendError);
      }
    }
    
    // Her durumda true dön (console'a yazıldı)
    return true;
    
  } catch (error) {
    console.error('❌ Email gönderme hatası:', error);
    return false;
  }
}


