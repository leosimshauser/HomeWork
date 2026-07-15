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
            this.aveHours = 0;
            this.priority = 0;
        }
        calculateDaysDue() {
            const today = new Date();
            
            const due = new Date(this.dueDate);

            return (due - today) / (1000 * 60 * 60 * 24);
        }

        calculateImportance(weights) {
            const days =
                Math.ceil(Math.max(1, this.calculateDaysDue())) * weights.days;

            const hours =
                this.hours * weights.hours;

            const weighting =
                (1 + this.weighting / 5) * weights.weight;

            const completion =
                (1 - this.comp / 100) * weights.comp;

            const difficulty =
                (this.diff * weights.diff) / 5 +
                (1 - weights.diff) / 5 +
                0.25;

            this.importance =
                (hours / days) *
                weighting *
                completion *
                difficulty;

            return this.importance;
        }
        calculateAveHours() {
            const today = new Date();
            const days =
                Math.ceil(Math.max(1, this.calculateDaysDue()));
            
            const completion =
                (1 - this.comp / 100);
            this.aveHours = (this.hours*completion)/days;
            return this.aveHours;
        }
    };

    window.Task = Task;
}