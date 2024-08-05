const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const Certificate = require('../models/certificate.model');
const User = require('../models/user.model');


const generatePDF = async (user) => {
    const pdfPath = path.join(__dirname, '..', 'temp', `congratulation_${user._id}.pdf`);
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: 'A4',
            margin: 50
        });

        doc.pipe(fs.createWriteStream(pdfPath));

        // Add border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

        // Calculate center of page
        const centerX = doc.page.width / 2;

        // Add NSS logo
        doc.image('temp/logo.jpg', centerX - 50, 60, {
            fit: [100, 100],
            align: 'center'
        });

        // Move down after the logo
        doc.y = 180;

        // Add text
        doc.font('Helvetica-Bold').fontSize(22).text('Sardar Patel Institute of Technology', {
            align: 'center'
        });

        doc.moveDown(1);

        doc.font('Helvetica-Bold').fontSize(26).text('Certificate of Merit', {
            align: 'center',
            color: '#4a4a4a'
        });

        doc.moveDown(1.5);

        doc.font('Helvetica').fontSize(14).text('This is to certify that', {
            align: 'center'
        });

        doc.moveDown(0.5);

        doc.font('Helvetica-Bold').fontSize(20).text(user.name, {
            align: 'center',
            color: '#2c3e50'
        });

        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(14).text('has successfully completed', {
            align: 'center'
        });

        doc.moveDown(0.5);

        doc.font('Helvetica-Bold').fontSize(20).text('240 hours', {
            align: 'center',
            color: '#2c3e50'
        });

        doc.moveDown(0.5);

        doc.font('Helvetica').fontSize(14).text('in the National Service Scheme (NSS)', {
            align: 'center'
        });

        // Add date
        doc.moveDown(2);
        doc.font('Helvetica-Oblique').fontSize(12).text(`Issued on: ${new Date().toLocaleDateString()}`, {
            align: 'center'
        });

        // Add signature placeholder
        doc.moveDown(2);
        doc.font('Helvetica').fontSize(12).text('_______________________', {
            align: 'right'
        });
        doc.moveDown(0.5);
        doc.fontSize(12).text('NSS Program Officer', {
            align: 'right'
        });

        doc.end();
        doc.on('end', () => resolve(pdfPath));
        doc.on('error', reject);
    });
};
const sendEmail = async (user, pdfPath) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    
    try {
        console.log('Attempting to send email...');
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Congratulations on Completing 240 Hours!',
            text: `Congratulations ${user.name} for successfully completing 240 hours in NSS.`,
            attachments: [
                {
                    filename: 'congratulation.pdf',
                    path: pdfPath,
                },
            ],
        });
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

const issueCertificate = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        
        if (user.totalHrs < 240) {
            throw new Error('User has not completed 240 hours');
        }
        
        // const existingCertificate = await Certificate.findOne({ userId });
        // if (existingCertificate) {
        //     throw new Error('Certificate already issued for this user');
        // }
        
        console.log('Generating PDF...');
        const pdfPath = await generatePDF(user);
        console.log('PDF generated at:', pdfPath);

        console.log('Sending email...');
        await sendEmail(user, pdfPath);
        console.log('Email sent successfully');
        
        // Record the issued certificate
        await Certificate.create({ userId });
        
        // Update user to avoid repeated sending
       // user.totalHrs = 239; // or any logic to avoid repeated sending
        await user.save();
        
        // Clean up the temporary PDF file
        fs.unlinkSync(pdfPath);
        
        console.log('Certificate issued successfully');
    } catch (error) {
        console.error('Error issuing certificate:', error);
        throw error;
    }
};

module.exports = {
    issueCertificate
};