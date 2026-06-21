
// class Subject{
//     constructor(subjectName,teacher,colour)  {
//         this.__subjectName = subjectName;
//         this.__teacher = teacher;
//         this.__colour = colour;
//     }
//     set subjectDets(subjectArray){
//         // Validation for "if newSubjectName.includes(house) or newSubjectName.includes(study) = False"
//         // will happen outside of the setter method so that the setter method does not run
//         // if it is not adding a subject
//         // subjectArray will be an array with subject, teacher and colour. This array will be set using 
//         // this.subjectName = subjectArray[0];
//         // this.teacher = subjectArray[1];
//         // this.colour = subjectArray[2];
//         this.subjectName = subjectArray[0];
//         this.teacher = subjectArray[1];
//         this.colour = subjectArray[2];
//     }
//     get subjectName(){
//         return this.__subjectName
//     }
//     get teacher(){
//         return this.__teacher
//     }
//     get colour(){
//         return this.__colour
//     }
//     }
// class Task{
//     constructor(subject,taskName,hours,daysDue,diff,taskWeight,comp,varWeights,importance){
//         this.subject = subject;
//         this.taskName = taskName;
//         this.hours = hours;
//         this.daysDue = daysDue;
//         this.diff = diff;
//         this.taskWeight = taskWeight;
//         this.comp = comp;
//         this.importance = importance;
//         }
//     set taskDets(taskArray){
//         // More validation later
//         this.taskName = taskArray[0];
//         this.hours = taskArray[1];
//         const dueDate = new Date(taskArray[2]);
//         const today = new Date();
//         this.daysDue =
//             (dueDate - today) / (1000 * 60 * 60 * 24);
        
//         if (taskArray[3] != ""){
//             this.diff = taskArray[3];
//         }
//         else{
//             this.diff = 2.5
//         }
//         if (taskArray[4] != ""){
//             this.taskWeight = taskArray[4];
//         }
//         else{
//             this.taskWeight= 0
//         }
//         if (taskArray[5] != ""){
//             this.comp = taskArray[5];
//         }
//         else{
//             this.comp = 0
//         }
//     }
//     set weightedVars(varWeights){
//         this.hours = this.hours*varWeights[0];
//         this.daysDue = this.daysDue/varWeights[1];
//         this.diff = (diff*(varWeights[2]))/5 + (1-varWeights[2])/2 + 0.5
//         this.taskWeight = this.taskWeight*varWeights[3]
//         this.comp = this.comp*varWeights[4]
//     }
//     setImportance() {
//         this.importance = (this.hours/(this.daysDue))*(this.comp)*(this.taskWeight)*(this.diff)
//     }
//     get importance(){
//         return this.importance
//     }
//     }
