document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ipAddress');
    const locateBtn = document.getElementById('locateBtn');
    const resultsDiv = document.getElementById('results');

    locateBtn.addEventListener('click', locate);

    async function locate() {
        // Clear previous results
        resultsDiv.innerHTML = '<div class="text-white">Loading...</div>';

        const ip = ipInput.value.trim();
        if (!ip) {
            showError('Please enter an IP address or domain');
            return;
        }

        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Invalid IP address or domain');
            }

            displayResults(data);
        } catch (error) {
            showError(error.message);
        }
    }

    function displayResults(data) {
        const html = `
            <div class="table-responsive">
                <table class="table table-dark table-bordered">
                    <tbody>
                        <tr>
                            <td class="text-white-50">IP Address</td>
                            <td class="text-white">${data.ip}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Location</td>
                            <td class="text-white">${data.city}, ${data.region}, ${data.country_name}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Coordinates</td>
                            <td class="text-white">${data.latitude}, ${data.longitude}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">ISP</td>
                            <td class="text-white">${data.org}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Timezone</td>
                            <td class="text-white">${data.timezone}</td>
                        </tr>
                        <tr>
                            <td class="text-white-50">Currency</td>
                            <td class="text-white">${data.currency_name} (${data.currency})</td>
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