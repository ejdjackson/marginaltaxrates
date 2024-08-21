// Tax calculation functions
function calculateIncomeTax(income) {
    let personalAllowance = 12570;

    // Reduce personal allowance by £1 for every £2 of income over £100,000
    if (income > 100000) {
        const reduction = (income - 100000) / 2;
        personalAllowance = Math.max(0, 12570 - reduction);
    }

    const taxableIncome = income - personalAllowance;

    // Calculate income tax based on taxable income
    if (taxableIncome <= 0) {
        return 0;
    } else if (taxableIncome <= 37700) {
        return taxableIncome * 0.20;
    } else if (taxableIncome <= 150000) {
        return 37700 * 0.20 + (taxableIncome - 37700) * 0.40;
    } else {
        return 37700 * 0.20 + (150000 - 37700) * 0.40 + (taxableIncome - 150000) * 0.45;
    }
}

function calculateNationalInsurance(income) {
    if (income <= 12570) {
        return 0;
    } else if (income <= 50270) {
        return (income - 12570) * 0.12;
    } else {
        return (50270 - 12570) * 0.12 + (income - 50270) * 0.02;
    }
}

// Generate the table and chart data
function generateTableAndChart() {
    const tbody = document.querySelector('#taxTable tbody');
    tbody.innerHTML = ""; // Clear the table body before inserting rows

    const incomeValues = [];
    const overallTaxRates = [];
    const marginalTaxRates = [];
    let previousTax = 0;

    for (let income = 5000; income <= 150000; income += 5000) {
        const incomeTax = calculateIncomeTax(income);
        const nationalInsurance = calculateNationalInsurance(income);
        const totalTax = incomeTax + nationalInsurance;
        const overallTaxRate = (totalTax / income) * 100;
        const marginalTaxRate = (income === 5000) ? 0 : ((totalTax - previousTax) / 5000) * 100;

        // Create a new row
        const row = document.createElement('tr');
        
        // Insert the columns with values
        row.innerHTML = `
            <td>£${income.toLocaleString()}</td>
            <td>£${incomeTax.toFixed(2)}</td>
            <td>£${nationalInsurance.toFixed(2)}</td>
            <td>${overallTaxRate.toFixed(2)}%</td>
            <td>${marginalTaxRate.toFixed(2)}%</td>
        `;

        // Append the row to the table body
        tbody.appendChild(row);

        // Store values for chart
        incomeValues.push(income);
        overallTaxRates.push(overallTaxRate.toFixed(2));
        marginalTaxRates.push(marginalTaxRate.toFixed(2));
        
        // Update previousTax for the next iteration
        previousTax = totalTax;
    }

    // Add £0 income with 0% tax rates to the beginning of the data arrays
    incomeValues.unshift(0);
    overallTaxRates.unshift(0);
    marginalTaxRates.unshift(0);

    // Create the chart
    createChart(incomeValues, overallTaxRates, marginalTaxRates);
}

function createChart(incomeValues, overallTaxRates, marginalTaxRates) {
    const ctx = document.getElementById('taxChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: incomeValues.map(val => `£${val.toLocaleString()}`),
            datasets: [
                {
                    label: 'Overall Tax Rate (%)',
                    data: overallTaxRates,
                    borderColor: 'orange',
                    fill: false,
                },
                {
                    label: 'Marginal Tax Rate (%)',
                    data: marginalTaxRates,
                    borderColor: 'blue',
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Gross Income (£)'
                    },
                    min: 0 // Ensure X-axis starts at £0
                },
                y: {
                    title: {
                        display: true,
                        text: 'Percentage (%)'
                    }
                }
            }
        }
    });
}

// Generate the table and chart on page load
window.onload = generateTableAndChart;
