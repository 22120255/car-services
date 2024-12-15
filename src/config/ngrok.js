const ngrok = require("@ngrok/ngrok");
const path = require('path');
const fs = require('fs');

// Hàm khởi động ngrok, ghi đè VNP_IPN_URL trong file .env.dev
async function setupNgrok() {
    try {
        // Kiểm tra authtoken trước khi khởi động
        if (!process.env.NGROK_AUTHTOKEN) {
            throw new Error('NGROK_AUTHTOKEN is not set in environment variables');
        }

        // Khởi động ngrok tunnel
        const listener = await ngrok.forward({ 
            addr: 3000,
            authtoken_from_env: true 
        });
        const ngrokUrl = listener.url();
        console.log('Ngrok tunnel established:', ngrokUrl);

        // Đường dẫn file .env.dev
        const envPath = path.resolve(process.cwd(), '.env.dev');
        
        // Kiểm tra file tồn tại
        if (!fs.existsSync(envPath)) {
            throw new Error(`.env.dev file not found at ${envPath}`);
        }

        try {
            // Đọc và cập nhật nội dung file
            let envContent = fs.readFileSync(envPath, 'utf-8');
            let envLines = envContent.split('\n').filter(line => line.trim()); // Loại bỏ dòng trống
            
            const newIpnUrl = `VNP_IPN_URL="${ngrokUrl}/api/payment/vnpay_ipn"`;
            const vnpIpnUrlIndex = envLines.findIndex(line => line.trim().startsWith('VNP_IPN_URL='));
            
            if (vnpIpnUrlIndex !== -1) {
                // Cập nhật dòng hiện có
                envLines[vnpIpnUrlIndex] = newIpnUrl;
                console.log('Updated existing VNP_IPN_URL');
            } else {
                // Thêm dòng mới
                envLines.push(newIpnUrl);
                console.log('Added new VNP_IPN_URL');
            }
            
            // Ghi file với một dòng trống ở cuối
            fs.writeFileSync(envPath, envLines.join('\n') + '\n', 'utf-8');
            console.log('Successfully updated .env.dev file');

            // Cập nhật biến môi trường
            process.env.VNP_IPN_URL = `${ngrokUrl}/api/payment/vnpay_ipn`;
            
            return ngrokUrl;
        } catch (fileError) {
            throw new Error(`Error updating .env.dev file: ${fileError.message}`);
        }

    } catch (error) {
        console.error('Ngrok setup error:', {
            message: error.message,
            stack: error.stack
        });
        throw error; // Re-throw để caller có thể xử lý
    }
}

module.exports = setupNgrok;