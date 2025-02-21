document.addEventListener('DOMContentLoaded', () => {
    const domainInput = document.getElementById('domain');
    const recordTypeSelect = document.getElementById('recordType');
    const lookupBtn = document.getElementById('lookupBtn');
    const resultsDiv = document.getElementById('results');

    lookupBtn.addEventListener('click', performLookup);

    async function performLookup() {
        const domain = domainInput.value.trim();
        const recordType = recordTypeSelect.value;

        if (!domain) {
            showError('Please enter a domain name');
            return;
        }

        resultsDiv.innerHTML = '<div class="text-white">Loading...</div>';

        try {
            const response = await fetch(`https://dns.google/resolve?name=${domain}&type=${recordType}`);
            const data = await response.json();

            if (data.Status !== 0) {
                throw new Error('DNS query failed');
            }

            displayResults(data, recordType);
        } catch (error) {
            showError('Failed to perform DNS lookup. Please try again.');
        }
    }

    function displayResults(data, recordType) {
        if (!data.Answer || data.Answer.length === 0) {
            resultsDiv.innerHTML = `
                <div class="alert alert-warning">
                    No ${recordType} records found for this domain.
                </div>
            `;
            return;
        }

        let html = `
            <div class="table-responsive">
                <table class="table table-dark table-bordered">
                    <thead>
                        <tr>
                            <th class="text-white">Name</th>
                            <th class="text-white">Type</th>
                            <th class="text-white">TTL</th>
                            <th class="text-white">Data</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        data.Answer.forEach(record => {
            html += `
                <tr>
                    <td class="text-white">${record.name}</td>
                    <td class="text-white">${getRecordTypeName(record.type)}</td>
                    <td class="text-white">${record.TTL}s</td>
                    <td class="text-white">${formatRecordData(record.data)}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;

        resultsDiv.innerHTML = html;
    }

    function getRecordTypeName(type) {
        const types = {
            1: 'A',
            2: 'NS',
            5: 'CNAME',
            6: 'SOA',
            15: 'MX',
            16: 'TXT',
            28: 'AAAA'
        };
        return types[type] || type;
    }

    function formatRecordData(data) {
        // Remove quotes from TXT records
        return data.replace(/^"(.*)"$/, '$1');
    }

    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="alert alert-danger">
                ${message}
            </div>
        `;
    }
}); 