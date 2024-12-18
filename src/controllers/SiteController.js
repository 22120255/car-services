const fs = require('fs')
const path = require('path')
class SiteController {
    // [GET] /
    index(req, res) {
        res.redirect('/dashboard')
    }

    // [GET] /settings
    settings(req, res) {
        res.render("site/settings", {
            title: "Settings"
        })
    }

    // [GET] /logs
    logs(req, res) {
        const logFilePath = path.join(__dirname, '../logs/error.log');

        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Cannot read log file', error: err.message });
            }

            const logLines = data.split('\n').filter(line => line.trim() !== '');

            const logs = logLines.map(line => {
                const parts = line.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[ERROR\]: File: (.*?), func: (\d+), error: (.*)/);
                return parts ? {
                    timestamp: parts[1].trim(),
                    file: parts[2].trim(),
                    func: parseInt(parts[3].trim()),
                    error: parts[4].trim()
                } : { raw: line };
            });

            res.status(200).json({ logs });
        });
    }
}

module.exports = new SiteController()
