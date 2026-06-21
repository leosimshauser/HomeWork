class Subject {
    constructor(subjectName, teacher, colour) {
        this.subjectName = subjectName;
        this.teacher = teacher;
        this.colour = colour;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }
}

class Task {
    constructor(
        subject,
        taskName,
        hours,
        dueDate,
        diff = 2.5,
        taskWeight = 0,
        comp = 0
    ) {
        this.subject = subject;
        this.taskName = taskName;
        this.hours = hours;
        this.dueDate = dueDate;
        this.diff = diff;
        this.taskWeight = taskWeight;
        this.comp = comp;
        this.importance = 0;
    }

    calculateDaysDue() {
        const today = new Date();
        const due = new Date(this.dueDate);

        return (due - today) / (1000 * 60 * 60 * 24);
    }

    calculateImportance() {
        const daysDue = this.calculateDaysDue();

        this.importance =
            (this.hours / daysDue) *
            this.comp *
            this.taskWeight *
            this.diff;

        return this.importance;
    }

    applyWeights(weights) {
        this.hours *= weights[0];
        this.diff =
            (this.diff * weights[2]) / 5 +
            (1 - weights[2]) / 2 +
            0.5;

        this.taskWeight *= weights[3];
        this.comp *= weights[4];
    }
}