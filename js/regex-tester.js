document.addEventListener('DOMContentLoaded', () => {
    const regexInput = document.getElementById('regexInput');
    const flagsInput = document.getElementById('flagsInput');
    const testInput = document.getElementById('testInput');
    const quickTest = document.getElementById('quickTest');
    const quickTestResult = document.getElementById('quickTestResult');
    const matchCount = document.getElementById('matchCount');
    const matches = document.getElementById('matches');

    // Real-time testing
    const updateMatches = () => {
        const pattern = regexInput.value;
        const flags = flagsInput.value;
        const text = testInput.value;

        // Clear previous results
        matches.innerHTML = '';
        matchCount.textContent = '0';

        if (!pattern || !text) return;

        try {
            const regex = new RegExp(pattern, flags);
            const results = [];
            let match;

            // Find all matches
            if (flags.includes('g')) {
                while ((match = regex.exec(text)) !== null) {
                    results.push({
                        match: match[0],
                        groups: match.slice(1),
                        index: match.index
                    });
                }
            } else {
                match = regex.exec(text);
                if (match) {
                    results.push({
                        match: match[0],
                        groups: match.slice(1),
                        index: match.index
                    });
                }
            }

            // Update match count
            matchCount.textContent = results.length;

            // Display matches
            if (results.length > 0) {
                const matchesHtml = results.map((result, index) => {
                    let html = `
                        <div class="mb-3">
                            <div class="text-success">Match ${index + 1}:</div>
                            <div class="ms-3">
                                <div>Text: ${escapeHtml(result.match)}</div>
                                <div>Index: ${result.index}</div>
                    `;

                    if (result.groups.length > 0) {
                        html += `
                            <div>Groups:</div>
                            <div class="ms-3">
                        `;
                        result.groups.forEach((group, i) => {
                            html += `<div>Group ${i + 1}: ${escapeHtml(group)}</div>`;
                        });
                        html += '</div>';
                    }

                    html += '</div></div>';
                    return html;
                }).join('');

                matches.innerHTML = matchesHtml;
            } else {
                matches.innerHTML = '<div class="text-warning">No matches found</div>';
            }

        } catch (error) {
            matches.innerHTML = `<div class="text-danger">Invalid regex: ${error.message}</div>`;
            matchCount.textContent = '0';
        }
    };

    // Quick test functionality
    const updateQuickTest = () => {
        const pattern = regexInput.value;
        const flags = flagsInput.value;
        const text = quickTest.value;

        if (!pattern || !text) {
            quickTestResult.className = 'bi';
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            if (regex.test(text)) {
                quickTestResult.className = 'bi bi-check-circle-fill text-success';
            } else {
                quickTestResult.className = 'bi bi-x-circle-fill text-danger';
            }
        } catch (error) {
            quickTestResult.className = 'bi bi-exclamation-circle-fill text-warning';
        }
    };

    // Event listeners
    regexInput.addEventListener('input', () => {
        updateMatches();
        updateQuickTest();
    });

    flagsInput.addEventListener('input', () => {
        updateMatches();
        updateQuickTest();
    });

    testInput.addEventListener('input', updateMatches);
    quickTest.addEventListener('input', updateQuickTest);

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}); 