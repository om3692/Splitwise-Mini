export const calculateSettlements = (expenses) => {
    const balances = {};

    // 1. Calculate net balances
    expenses.forEach(({ payer, splitWith, amount }) => {
        const splitAmount = amount / splitWith.length;
        balances[payer] = (balances[payer] || 0) + amount;
        splitWith.forEach(person => {
            balances[person] = (balances[person] || 0) - splitAmount;
        });
    });

    // 2. Separate into debtors and creditors
    let debtors = [];
    let creditors = [];
    for (const [person, balance] of Object.entries(balances)) {
        if (balance < -0.01) debtors.push({ person, amount: -balance });
        else if (balance > 0.01) creditors.push({ person, amount: balance });
    }

    // 3. Sort to optimize the greedy match
    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements = [];
    let i = 0,
        j = 0;

    // 4. Greedily settle debts
    while (i < debtors.length && j < creditors.length) {
        const minAmount = Math.min(debtors[i].amount, creditors[j].amount);
        settlements.push({
            from: debtors[i].person,
            to: creditors[j].person,
            amount: minAmount.toFixed(2)
        });

        debtors[i].amount -= minAmount;
        creditors[j].amount -= minAmount;

        if (debtors[i].amount < 0.01) i++;
        if (creditors[j].amount < 0.01) j++;
    }

    return settlements;
};