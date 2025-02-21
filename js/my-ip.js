document.addEventListener('DOMContentLoaded', () => {
    const ipDiv = document.getElementById('ipAddress');
    const detailsDiv = document.getElementById('details');
    const refreshBtn = document.getElementById('refreshBtn');

    // Fetch IP info on load
    fetchIPInfo();

    // Add refresh button handler
    refreshBtn.addEventListener('click', fetchIPInfo);

    async function fetchIPInfo() {
        ipDiv.textContent = 'Loading...';
        detailsDiv.innerHTML = '';

        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Failed to fetch IP information');
            }

            // Display IP
            ipDiv.textContent = data.ip;

            // Display details
            const details = `
                <div class="table-responsive">
                    <table class="table table-dark table-bordered">
                        <tbody>
                            <tr>
                                <td class="text-white-50">Location</td>
                                <td class="text-white">${data.city}, ${data.region}, ${data.country_name}</td>
                            </tr>
                            <tr>
                                <td class="text-white-50">ISP</td>
                                <td class="text-white">${data.org}</td>
                            </tr>
                            <tr>
                                <td class="text-white-50">Network</td>
                                <td class="text-white">${data.network}</td>
                            </tr>
                            <tr>
                                <td class="text-white-50">Timezone</td>
                                <td class="text-white">${data.timezone}</td>
                            </tr>
                            <tr>
                                <td class="text-white-50">ASN</td>
                                <td class="text-white">${data.asn}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            detailsDiv.innerHTML = details;

        } catch (error) {
            ipDiv.textContent = 'Error';
            detailsDiv.innerHTML = `
                <div class="alert alert-danger">
                    Failed to fetch IP information. Please try again later.
                </div>
            `;
        }
    }
}); 