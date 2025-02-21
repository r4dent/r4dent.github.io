document.addEventListener('DOMContentLoaded', () => {
    const hostInput = document.getElementById('host');
    const countSelect = document.getElementById('count');
    const pingBtn = document.getElementById('pingBtn');
    const resultsDiv = document.getElementById('results');
    const statsDiv = document.getElementById('statistics');

    let pinging = false;
    let times = [];

    pingBtn.addEventListener('click', togglePing);

    function togglePing() {
        if (pinging) {
            pinging = false;
            pingBtn.textContent = 'Start Ping';
            return;
        }

        const host = hostInput.value.trim();
        if (!host) {
            showError('Please enter a host or IP address');
            return;
        }

        pinging = true;
        pingBtn.textContent = 'Stop Ping';
        times = [];
        resultsDiv.innerHTML = '';
        statsDiv.innerHTML = '';
        
        startPing(host, parseInt(countSelect.value));
    }

    async function startPing(host, count) {
        let sent = 0;
        let received = 0;

        for (let i = 0; i < count && pinging; i++) {
            sent++;
            const startTime = performance.now();
            
            try {
                const response = await fetch(`https://${host}`, { mode: 'no-cors' });
                const endTime = performance.now();
                const time = Math.round(endTime - startTime);
                times.push(time);
                received++;

                addResult(`Reply from ${host}: time=${time}ms`);
            } catch (error) {
                addResult(`Request timed out.`, true);
            }

            updateStatistics(sent, received);
            
            if (i < count - 1 && pinging) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        pinging = false;
        pingBtn.textContent = 'Start Ping';
    }

    function addResult(message, isError = false) {
        const div = document.createElement('div');
        div.className = isError ? 'text-danger' : 'text-white';
        div.textContent = message;
        resultsDiv.appendChild(div);
        resultsDiv.scrollTop = resultsDiv.scrollHeight;
    }

    function updateStatistics(sent, received) {
        const lost = sent - received;
        const lossPercent = Math.round((lost / sent) * 100);
        
        let stats = '';
        if (times.length > 0) {
            const min = Math.min(...times);
            const max = Math.max(...times);
            const avg = Math.round(times.reduce((a, b) => a + b) / times.length);
            
            stats = `
                <div class="table-responsive">
                    <table class="table table-dark table-bordered">
                        <tbody>
                            <tr>
                                <td class="text-white-50">Packets: Sent = ${sent}, Received = ${received}, Lost = ${lost} (${lossPercent}% loss)</td>
                            </tr>
                            <tr>
                                <td class="text-white-50">Approximate round trip times in milliseconds:</td>
                            </tr>
                            <tr>
                                <td class="text-white">Minimum = ${min}ms, Maximum = ${max}ms, Average = ${avg}ms</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        }
        
        statsDiv.innerHTML = stats;
    }

    function showError(message) {
        resultsDiv.innerHTML = `
            <div class="alert alert-danger">
                ${message}
            </div>
        `;
        statsDiv.innerHTML = '';
    }
}); 