console.log("classes.js loaded");

if (typeof Subject === "undefined") {

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

    window.Subject = Subject;
}

if (typeof Task === "undefined") {

    class Task {
        constructor(
            taskName,
            hours,
            dueDate,
            weighting = 0,
            comp = 0,
            diff = 2.5
        ) {
            this.taskName = taskName;
            this.hours = Number(hours);
            this.dueDate = dueDate;
            this.weighting = Number(weighting);
            this.comp = Number(comp);
            this.diff = Number(diff);
            this.importance = 0;
        }

        calculateDaysDue() {
            const today = new Date();
            const due = new Date(this.dueDate);

            return (
                due - today
            ) / (1000 * 60 * 60 * 24);
        }

        calculateImportance() {
            const daysDue =
                this.calculateDaysDue();

            this.importance =
                (this.hours / daysDue) *
                this.comp *
                this.weighting *
                this.diff;

            return this.importance;
        }
    }

    window.Task = Task;
}