
class Subject{
    constructor(subjectName,teacher,colour)  {
        this.subjectName = subjectName;
        this.teacher = teacher;
        this.colour = colour;
    }
    set subjectDets(subjectArray){
        // Validation for "if newSubjectName.includes(house) or newSubjectName.includes(study) = False"
        // will happen outside of the setter method so that the setter method does not run
        // if it is not adding a subject
        // subjectArray will be an array with subject, teacher and colour. This array will be set using 
        // this.subjectName = subjectArray[0];
        // this.teacher = subjectArray[1];
        // this.colour = subjectArray[2];
        this.subjectName = subjectArray[0];
        this.teacher = subjectArray[1];
        this.colour = subjectArray[2];
    }
    get subjectName(){
        return this.subjectName
    }
    get teacher(){
        return this.teacher
    }
    get colour(){
        return this.colour
    }
    }
class Task{
    constructor(subject,taskName,hours,dueDate,diff,taskWeight,comp,varWeights,importance){
        subject = this.subject
        taskName = this.taskName
        hours = this.hours
        dueDate = this.dueDate
        diff = this.diff
        taskWeight = this.taskWeight
        comp = this.comp
        varWeights = this.varWeights
        importance = this.importance
        }
    set taskDets(taskArray){
        this.taskName = taskArray[0];
        this.hours = taskArray[1];
        this.dueDate = taskArray[2];
        if (taskArray[3] != ""){
            this.diff = taskArray[3];
        }
        if (taskArray[4] != ""){
            this.taskWeight = taskArray[4];
        }
        if (taskArray[5] != ""){
            this.comp = taskArray[5];
        }
    }
    
    }
