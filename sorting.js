function sortTasks(tasks) {

    const sorted = [...tasks];

    for (let i = 0; i < sorted.length - 1; i++) {

        for (let j = 0; j < sorted.length - i - 1; j++) {

            if (
                sorted[j].task.importance <
                sorted[j + 1].task.importance
            ) {

                const temp = sorted[j];
                sorted[j] = sorted[j + 1];
                sorted[j + 1] = temp;
            }
        }
    }

    return sorted;
}