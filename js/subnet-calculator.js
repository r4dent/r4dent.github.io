document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ipAddress');
    const maskSelect = document.getElementById('subnetMask');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsDiv = document.getElementById('results');

    calculateBtn.addEventListener('click', calculate);

    function calculate() {
        // Clear previous results
        resultsDiv.innerHTML = '';

        // Get input values
        const ip = ipInput.value;
        const cidr = parseInt(maskSelect.value);

        // Validate IP
        if (!isValidIP(ip)) {
            showError('Please enter a valid IP address (e.g., 192.168.1.0)');
            return;
        }

        // Calculate subnet details
        try {
            const details = calculateSubnet(ip, cidr);
            displayResults(details);
        } catch (error) {
            showError(error.message);
        }
    }

    function isValidIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;

        return parts.every(part => {
            const num = parseInt(part);
            return !isNaN(num) && num >= 0 && num <= 255;
        });
    }

    function calculateSubnet(ip, cidr) {
        // Convert IP to binary
        const ipBin = ip.split('.')
            .map(num => parseInt(num))
            .map(num => num.toString(2).padStart(8, '0'))
            .join('');

        // Create subnet mask
        const maskBin = '1'.repeat(cidr) + '0'.repeat(32 - cidr);

        // Calculate network address
        const networkBin = ipBin.split('')
            .map((bit, i) => bit & maskBin[i])
            .join('');

        // Calculate broadcast address
        const broadcastBin = networkBin.split('')
            .map((bit, i) => i < cidr ? bit : '1')
            .join('');

        return {
            network: binToIP(networkBin),
            broadcast: binToIP(broadcastBin),
            firstHost: getFirstHost(networkBin),
            lastHost: getLastHost(broadcastBin),
            totalHosts: Math.pow(2, 32 - cidr) - 2,
            mask: binToIP(maskBin),
            cidr: cidr
        };
    }

    function binToIP(binary) {
        return binary.match(/.{8}/g)
            .map(bin => parseInt(bin, 2))
            .join('.');
    }

    function getFirstHost(networkBin) {
        const firstBin = networkBin.slice(0, -1) + '1';
        return binToIP(firstBin);
    }

    function getLastHost(broadcastBin) {
        const lastBin = broadcastBin.slice(0, -1) + '0';
        return binToIP(lastBin);
    }

    function displayResults(details) {
        const html = `
            <div class="table-responsive">
                <table class="table table-dark table-bordered">
                    <tbody>
                        <tr>
                            <td class="text-white-50">Network Address</td>
                            <td class="text-white">${details.network}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Broadcast Address</td>
                            <td class="text-white">${details.broadcast}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">First Usable Host</td>
                            <td class="text-white">${details.firstHost}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Last Usable Host</td>
                            <td class="text-white">${details.lastHost}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Total Usable Hosts</td>
                            <td class="text-white">${details.totalHosts.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Subnet Mask</td>
                            <td class="text-white">${details.mask} (/${details.cidr})</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        resultsDiv.innerHTML = html;
    }

    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="alert alert-danger">
                ${message}
            </div>
        `;
    }
}); 